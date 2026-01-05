import { SCHEMAS } from '@schema'
import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'

const list = forgeController
  .query()
  .description({
    en: 'Get all music score types',
    ms: 'Dapatkan semua jenis skor muzik',
    'zh-CN': '获取所有音乐乐谱类型',
    'zh-TW': '獲取所有音樂樂譜類型'
  })
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('scoresLibrary__types_aggregated')
      .sort(['name'])
      .execute()
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new score type',
    ms: 'Cipta jenis skor baharu',
    'zh-CN': '创建新乐谱类型',
    'zh-TW': '創建新樂譜類型'
  })
  .input({
    body: SCHEMAS.scoresLibrary.types.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('scoresLibrary__types').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description({
    en: 'Update score type details',
    ms: 'Kemas kini butiran jenis skor',
    'zh-CN': '更新乐谱类型详情',
    'zh-TW': '更新樂譜類型詳情'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.scoresLibrary.types.schema
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('scoresLibrary__types').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete a score type',
    ms: 'Padam jenis skor',
    'zh-CN': '删除乐谱类型',
    'zh-TW': '刪除樂譜類型'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('scoresLibrary__types').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
