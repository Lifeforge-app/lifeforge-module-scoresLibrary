import z from 'zod'

import forge from '../forge'
import scoresLibrarySchemas from '../schema'
import { processFiles, setLeft } from '../utils/uploadFiles'

export const sidebarData = forge
  .query({
    description: 'Get sidebar statistics and filters',
    output: {
      OK: z.object({
        total: z.number(),
        favourites: z.number(),
        types: z.array(scoresLibrarySchemas.types_aggregated),
        authors: z.record(z.string(), z.number())
      })
    }
  })
  .callback(async ({ pb, response }) => {
    const allScores = await pb.getList
      .collection('entries')
      .page(1)
      .perPage(1)
      .execute()

    const favourites = await pb.getList
      .collection('entries')
      .page(1)
      .perPage(1)
      .filter([
        {
          field: 'isFavourite',
          operator: '=',
          value: true
        }
      ])
      .execute()

    const allAuthors = await pb.getFullList
      .collection('authors_aggregated')
      .execute()

    const allTypes = await pb.getFullList
      .collection('types_aggregated')
      .sort(['amount', 'name'])
      .execute()

    return response.ok({
      total: allScores.totalItems,
      favourites: favourites.totalItems,
      types: allTypes,
      authors: Object.fromEntries(
        allAuthors.map(author => [author.name, author.amount])
      )
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
        items: z.array(scoresLibrarySchemas.entries),
        page: z.number(),
        perPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number()
      })
    }
  })
  .callback(
    async ({
      pb,
      query: { page, query = '', category, author, collection, starred, sort },
      response
    }) => {
      const parsedPage = parseInt(page ?? '1', 10) || 1

      const parsedStarred = starred === 'true'

      return response.ok(
        await pb.getList
          .collection('entries')
          .page(parsedPage)
          .perPage(20)
          .filter([
            {
              combination: '||',
              filters: [
                {
                  field: 'name',
                  operator: '~',
                  value: query || ''
                },
                {
                  field: 'author',
                  operator: '~',
                  value: query || ''
                }
              ]
            },
            ...(category
              ? ([
                  {
                    field: 'type',
                    operator: '=',
                    value: category === 'uncategorized' ? '' : category
                  }
                ] as const)
              : []),
            ...(author
              ? ([
                  {
                    field: 'author',
                    operator: '=',
                    value: author === '[na]' ? '' : author
                  }
                ] as const)
              : []),
            ...(collection
              ? ([
                  {
                    field: 'collection',
                    operator: '=',
                    value: collection
                  }
                ] as const)
              : []),
            ...(parsedStarred
              ? ([
                  {
                    field: 'isFavourite',
                    operator: '=',
                    value: parsedStarred
                  }
                ] as const)
              : [])
          ])
          .sort([
            '-isFavourite',
            (
              {
                name: 'name',
                author: 'author',
                newest: '-created',
                oldest: 'created'
              } as const
            )[sort]
          ])
          .execute()
      )
    }
  )

export const random = forge
  .query({
    description: 'Get a random score',
    output: {
      OK: scoresLibrarySchemas.entries
    }
  })
  .callback(async ({ pb, response }) => {
    const allScores = await pb.getFullList.collection('entries').execute()

    return response.ok(allScores[Math.floor(Math.random() * allScores.length)])
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
      OK: z.string(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ io, pb, media: { files }, core: { tasks }, response }) => {
    if (!files) {
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
            pdf: any | null
            mscz: any | null
            mp3: any | null
          }
        > = {}

        for (const file of files as any[]) {
          const decodedName = decodeURIComponent(file.originalname)

          const extension = decodedName.split('.').pop()

          if (!extension || !['mscz', 'mp3', 'pdf'].includes(extension))
            continue

          const name = decodedName.split('.').slice(0, -1).join('.')

          if (!groups[name]) {
            groups[name] = {
              pdf: null,
              mscz: null,
              mp3: null
            }
          }

          groups[name][extension as 'pdf' | 'mscz' | 'mp3'] = file
        }

        for (const group of Object.values(groups)) {
          if (group.pdf) continue
        }

        groups = Object.fromEntries(
          Object.entries(groups).filter(([_, group]) => group.pdf)
        )

        tasks.update(io, taskId, {
          status: 'running',
          progress: {
            left: Object.keys(groups).length,
            total: Object.keys(groups).length
          }
        })

        setLeft(Object.keys(groups).length)

        processFiles(pb, groups, io, taskId, tasks)

        return { status: 'success' }
      } catch (error) {
        tasks.update(io, taskId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })

        return { status: 'error', message: 'Failed to process files' }
      }
    })()

    return response.ok(taskId)
  })

export const update = forge
  .mutation({
    description: 'Update score details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: scoresLibrarySchemas.entries
        .pick({
          name: true,
          author: true,
          type: true
        })
        .extend({
          collection: z.string().optional()
        })
    },
    existenceCheck: {
      query: { id: 'entries' },
      body: { collection: '[collections]' }
    },
    output: {
      OK: scoresLibrarySchemas.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('entries').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a score',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('entries').id(id).execute()

    return response.noContent()
  })

export const toggleFavourite = forge
  .mutation({
    description: 'Toggle favourite status',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: scoresLibrarySchemas.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const entry = await pb.getOne.collection('entries').id(id).execute()

    return response.ok(
      await pb.update
        .collection('entries')
        .id(id)
        .data({
          isFavourite: !entry.isFavourite
        })
        .execute()
    )
  })
