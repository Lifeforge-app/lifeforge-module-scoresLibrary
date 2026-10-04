import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  isNull,
  or,
  sql
} from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import type { StagedFile } from '@lifeforge/file-storage'

import forge from '../forge'
import { scoreEntries, scoreTypes } from '../schema.drizzle'
import { processFiles, setLeft } from '../utils/uploadFiles'

const entryDto = createSelectSchema(scoreEntries)

const typeAggregateDto = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  amount: z.number()
})

export const sidebarData = forge
  .query({
    description: 'Get sidebar statistics and filters',
    output: {
      OK: z.object({
        total: z.number(),
        favourites: z.number(),
        types: z.array(typeAggregateDto),
        authors: z.record(z.string(), z.number())
      })
    }
  })
  .callback(async ({ db, response }) => {
    const [totalRow] = await db.select({ value: count() }).from(scoreEntries)

    const [favouritesRow] = await db
      .select({ value: count() })
      .from(scoreEntries)
      .where(eq(scoreEntries.is_favourite, true))

    const typeRows = await db
      .select({
        id: scoreTypes.id,
        name: scoreTypes.name,
        icon: scoreTypes.icon,
        amount: count(scoreEntries.id)
      })
      .from(scoreTypes)
      .leftJoin(scoreEntries, eq(scoreEntries.type, scoreTypes.id))
      .groupBy(scoreTypes.id)
      .orderBy(asc(count(scoreEntries.id)), asc(scoreTypes.name))

    const authorRows = await db
      .select({ name: scoreEntries.author, amount: count() })
      .from(scoreEntries)
      .groupBy(scoreEntries.author)

    return response.ok({
      total: totalRow.value,
      favourites: favouritesRow.value,
      types: typeRows,
      authors: Object.fromEntries(authorRows.map(a => [a.name, a.amount]))
    })
  })

export const list = forge
  .query({
    description: 'Get scores with filters and pagination',
    input: {
      query: z.object({
        page: z.string().optional().default('1'),
        query: z.string().optional(),
        category: z.string().optional(),
        author: z.string().optional(),
        collection: z.string().optional(),
        starred: z.string().optional(),
        sort: z
          .enum(['name', 'author', 'newest', 'oldest'])
          .optional()
          .default('newest')
      })
    },
    output: {
      OK: z.object({
        items: z.array(entryDto),
        page: z.number(),
        perPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number()
      })
    }
  })
  .callback(
    async ({
      db,
      query: { page, query = '', category, author, collection, starred, sort },
      response
    }) => {
      const parsedPage = parseInt(page ?? '1', 10) || 1

      const perPage = 20

      const parsedStarred = starred === 'true'

      const conditions = []

      if (query) {
        conditions.push(
          or(
            ilike(scoreEntries.name, `%${query}%`),
            ilike(scoreEntries.author, `%${query}%`)
          )
        )
      }

      if (category) {
        conditions.push(
          category === 'uncategorized'
            ? isNull(scoreEntries.type)
            : eq(scoreEntries.type, category)
        )
      }

      if (author) {
        conditions.push(
          eq(scoreEntries.author, author === '[na]' ? '' : author)
        )
      }

      if (collection) {
        conditions.push(eq(scoreEntries.collection, collection))
      }

      if (parsedStarred) {
        conditions.push(eq(scoreEntries.is_favourite, true))
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined

      const orderBy = [
        desc(scoreEntries.is_favourite),
        sort === 'name'
          ? asc(scoreEntries.name)
          : sort === 'author'
            ? asc(scoreEntries.author)
            : sort === 'oldest'
              ? asc(scoreEntries.created)
              : desc(scoreEntries.created)
      ]

      const items = await db
        .select()
        .from(scoreEntries)
        .where(where)
        .orderBy(...orderBy)
        .limit(perPage)
        .offset((parsedPage - 1) * perPage)

      const [totalRow] = await db
        .select({ value: count() })
        .from(scoreEntries)
        .where(where)

      const totalItems = totalRow.value

      return response.ok({
        items,
        page: parsedPage,
        perPage,
        totalItems,
        totalPages: Math.ceil(totalItems / perPage)
      })
    }
  )

export const random = forge
  .query({
    description: 'Get a random score',
    output: {
      OK: entryDto
    }
  })
  .callback(async ({ db, response }) => {
    const [row] = await db
      .select()
      .from(scoreEntries)
      .orderBy(sql`random()`)
      .limit(1)

    if (!row) {
      return response.notFound()
    }

    return response.ok(row)
  })

export const upload = forge
  .mutation({
    description: 'Upload score files',
    media: {
      files: {
        optional: false,
        multiple: true
      }
    },
    output: {
      OK: z.string()
    }
  })
  .callback(
    async ({ db, io, media: { files }, core: { tasks, storage }, response }) => {
      if (!files || files.length === 0) {
        return response.badRequest('No files provided')
      }

      const taskId = tasks.add(io, {
        module: 'scoresLibrary',
        description: 'Uploading music scores from local',
        progress: {
          left: 0,
          total: 0
        },
        status: 'pending'
      })

      ;(async () => {
        try {
          let groups: Record<
            string,
            {
              pdf: StagedFile | null
              mscz: StagedFile | null
              mp3: StagedFile | null
            }
          > = {}

          for (const file of files) {
            const originalName = Buffer.from(
              file.originalName,
              'latin1'
            ).toString('utf-8')

            const extension = originalName.split('.').pop()

            if (!extension || !['mscz', 'mp3', 'pdf'].includes(extension)) {
              continue
            }

            const name = originalName.split('.').slice(0, -1).join('.')

            if (!groups[name]) {
              groups[name] = {
                pdf: null,
                mscz: null,
                mp3: null
              }
            }

            groups[name][extension as 'pdf' | 'mscz' | 'mp3'] = file
          }

          groups = Object.fromEntries(
            Object.entries(groups).filter(([, group]) => group.pdf)
          )

          tasks.update(io, taskId, {
            status: 'running',
            progress: {
              left: Object.keys(groups).length,
              total: Object.keys(groups).length
            }
          })

          setLeft(Object.keys(groups).length)

          processFiles(db, storage, groups, io, taskId, tasks)
        } catch (error) {
          tasks.update(io, taskId, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })()

      return response.ok(taskId)
    }
  )

export const update = forge
  .mutation({
    description: 'Update score details',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), scoreEntries)
      }),
      body: z.object({
        name: z.string(),
        author: z.string(),
        type: z.string().optional(),
        collection: z.string().optional()
      })
    },
    output: {
      OK: entryDto
    }
  })
  .callback(async ({ db, query: { id }, body, response }) => {
    const [updated] = await db
      .update(scoreEntries)
      .set({
        name: body.name,
        author: body.author,
        type: body.type || null,
        collection: body.collection || null,
        updated: new Date()
      })
      .where(eq(scoreEntries.id, id))
      .returning()

    return response.ok(updated)
  })

export const remove = forge
  .mutation({
    description: 'Delete a score',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), scoreEntries)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, core, response }) => {
    const entry = await db.query.entries.findFirst({ where: { id } })

    if (!entry) {
      return response.notFound()
    }

    for (const key of [entry.thumbnail, entry.pdf, entry.audio, entry.musescore]) {
      if (key) {
        await core.storage.delete(key)
      }
    }

    await db.delete(scoreEntries).where(eq(scoreEntries.id, id))

    return response.noContent()
  })

export const toggleFavourite = forge
  .mutation({
    description: 'Toggle favourite status',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), scoreEntries)
      })
    },
    output: {
      OK: entryDto
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const entry = (await db.query.entries.findFirst({ where: { id } }))!

    const [updated] = await db
      .update(scoreEntries)
      .set({ is_favourite: !entry.is_favourite, updated: new Date() })
      .where(eq(scoreEntries.id, id))
      .returning()

    return response.ok(updated)
  })

export const cleanup = forge
  .mutation({
    description: 'Extract score name and author from raw string using AI',
    input: {
      body: z.object({
        rawName: z.string()
      })
    },
    output: {
      OK: z.object({
        name: z.string(),
        author: z.string()
      })
    }
  })
  .callback(
    async ({
      body: { rawName },
      core: {
        api: { fetchAI }
      },
      response
    }) => {
      const NameCleanupSchema = z.object({
        name: z
          .string()
          .describe('The cleaned score name without author or extraneous info'),
        author: z
          .string()
          .describe('The composer/artist name, or empty string if unknown')
      })

      const result = await fetchAI({
        provider: 'deepseek',
        model: 'deepseek-v4-flash',
        messages: [
          {
            role: 'system',
            content: `You are a music metadata cleaner. Given a raw filename or identifier for a music score,
extract the score title and the composer/artist name.

Rules:
- The raw name may contain underscores, hyphens, timestamps, IDs or other noise.
- Split it into a clean score name and the author name.
- If the author cannot be clearly identified, output an empty string for author.
- The score name should be in natural title case (e.g. "Kiss the Rain" not "Kiss_The_Rain").
- Remove trailing numbers, timestamps, or ID-like suffixes.`
          },
          {
            role: 'user',
            content: rawName
          }
        ],
        structure: NameCleanupSchema
      })

      return response.ok({
        name: result?.name || rawName,
        author: result?.author || ''
      })
    }
  )
