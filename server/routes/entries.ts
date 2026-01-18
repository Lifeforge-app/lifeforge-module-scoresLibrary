import { ClientError } from '@lifeforge/server-utils'
import z from 'zod'

import forge from '../forge'
import scoresLibrarySchemas from '../schema'
import { processFiles, setLeft } from '../utils/uploadFiles'

export const sidebarData = forge
  .query()
  .description('Get sidebar statistics and filters')
  .input({})
  .callback(async ({ pb }) => {
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

    return {
      total: allScores.totalItems,
      favourites: favourites.totalItems,
      types: allTypes,
      authors: Object.fromEntries(
        allAuthors.map(author => [author.name, author.amount])
      )
    }
  })

export const list = forge
  .query()
  .description('Get scores with filters and pagination')
  .input({
    query: z.object({
      page: z
        .string()
        .optional()
        .transform(val => parseInt(val ?? '1', 10) || 1),
      query: z.string().optional(),
      category: z.string().optional(),
      author: z.string().optional(),
      collection: z.string().optional(),
      starred: z
        .string()
        .optional()
        .transform(val => val === 'true'),
      sort: z
        .enum(['name', 'author', 'newest', 'oldest'])
        .optional()
        .default('newest')
    })
  })
  .callback(
    ({
      pb,
      query: { page, query = '', category, author, collection, starred, sort }
    }) => {
      return pb.getList
        .collection('entries')
        .page(page)
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
          ...(starred
            ? ([
                {
                  field: 'isFavourite',
                  operator: '=',
                  value: starred
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
    }
  )

export const random = forge
  .query()
  .description('Get a random score')
  .input({})
  .callback(async ({ pb }) => {
    const allScores = await pb.getFullList.collection('entries').execute()

    return allScores[Math.floor(Math.random() * allScores.length)]
  })

export const upload = forge
  .mutation()
  .description('Upload score files')
  .input({})
  .statusCode(202)
  .media({
    files: {
      optional: false,
      multiple: true
    }
  })
  .callback(async ({ io, pb, media: { files }, core: { tasks } }) => {
    if (!files) {
      throw new ClientError('No files provided')
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

    return taskId
  })

export const update = forge
  .mutation()
  .description('Update score details')
  .input({
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
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .existenceCheck('body', {
    collection: '[collections]'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('entries').id(id).data(body).execute()
  )

export const remove = forge
  .mutation()
  .description('Delete a score')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) =>
    pb.delete.collection('entries').id(id).execute()
  )

export const toggleFavourite = forge
  .mutation()
  .description('Toggle favourite status')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne.collection('entries').id(id).execute()

    return await pb.update
      .collection('entries')
      .id(id)
      .data({
        isFavourite: !entry.isFavourite
      })
      .execute()
  })
