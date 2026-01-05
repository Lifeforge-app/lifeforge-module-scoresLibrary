import { SCHEMAS } from '@schema'
import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { addToTaskPool, updateTaskInPool } from '@functions/socketio/taskPool'

import { processFiles } from '../utils/uploadFiles'

export let left = 0

export function setLeft(value: number) {
  left = value
}

const sidebarData = forgeController
  .query()
  .description({
    en: 'Get sidebar statistics and filters',
    ms: 'Dapatkan statistik dan penapis bar sisi',
    'zh-CN': '获取侧边栏统计和筛选',
    'zh-TW': '獲取側邊欄統計和篩選'
  })
  .input({})
  .callback(async ({ pb }) => {
    const allScores = await pb.getList
      .collection('scoresLibrary__entries')
      .page(1)
      .perPage(1)
      .execute()

    const favourites = await pb.getList
      .collection('scoresLibrary__entries')
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
      .collection('scoresLibrary__authors_aggregated')
      .execute()

    const allTypes = await pb.getFullList
      .collection('scoresLibrary__types_aggregated')
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

const list = forgeController
  .query()
  .description({
    en: 'Get scores with filters and pagination',
    ms: 'Dapatkan skor dengan penapis dan penomboran halaman',
    'zh-CN': '获取带筛选和分页的乐谱',
    'zh-TW': '獲取帶篩選和分頁的樂譜'
  })
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
        .collection('scoresLibrary__entries')
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

const random = forgeController
  .query()
  .description({
    en: 'Get a random score',
    ms: 'Dapatkan skor rawak',
    'zh-CN': '获取随机乐谱',
    'zh-TW': '獲取隨機樂譜'
  })
  .input({})
  .callback(async ({ pb }) => {
    const allScores = await pb.getFullList
      .collection('scoresLibrary__entries')
      .execute()

    return allScores[Math.floor(Math.random() * allScores.length)]
  })

const upload = forgeController
  .mutation()
  .description({
    en: 'Upload score files',
    ms: 'Muat naik fail skor',
    'zh-CN': '上传乐谱文件',
    'zh-TW': '上傳樂譜檔案'
  })
  .input({})
  .statusCode(202)
  .media({
    files: {
      optional: false,
      multiple: true
    }
  })
  .callback(async ({ io, pb, media: { files } }) => {
    if (!files) {
      throw new ClientError('No files provided')
    }

    const taskId = addToTaskPool(io, {
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
            pdf: Express.Multer.File | null
            mscz: Express.Multer.File | null
            mp3: Express.Multer.File | null
          }
        > = {}

        for (const file of files as Express.Multer.File[]) {
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

        updateTaskInPool(io, taskId, {
          status: 'running',
          progress: {
            left: Object.keys(groups).length,
            total: Object.keys(groups).length
          }
        })

        left = Object.keys(groups).length

        processFiles(pb, groups, io, taskId)

        return { status: 'success' }
      } catch (error) {
        updateTaskInPool(io, taskId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })

        return { status: 'error', message: 'Failed to process files' }
      }
    })()

    return taskId
  })

const update = forgeController
  .mutation()
  .description({
    en: 'Update score details',
    ms: 'Kemas kini butiran skor',
    'zh-CN': '更新乐谱详情',
    'zh-TW': '更新樂譜詳情'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.scoresLibrary.entries.schema
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
    id: 'scoresLibrary__entries'
  })
  .existenceCheck('body', {
    collection: '[scoresLibrary__collections]'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('scoresLibrary__entries').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete a score',
    ms: 'Padam skor',
    'zh-CN': '删除乐谱',
    'zh-TW': '刪除樂譜'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'scoresLibrary__entries'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) =>
    pb.delete.collection('scoresLibrary__entries').id(id).execute()
  )

const toggleFavourite = forgeController
  .mutation()
  .description({
    en: 'Toggle favourite status',
    ms: 'Togol status kegemaran',
    'zh-CN': '切换收藏状态',
    'zh-TW': '切換收藏狀態'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'scoresLibrary__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne
      .collection('scoresLibrary__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('scoresLibrary__entries')
      .id(id)
      .data({
        isFavourite: !entry.isFavourite
      })
      .execute()
  })

export default forgeRouter({
  sidebarData,
  list,
  random,
  upload,
  update,
  remove,
  toggleFavourite
})
