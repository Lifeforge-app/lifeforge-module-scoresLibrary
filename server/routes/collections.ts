import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import z from 'zod'

const list = forgeController
  .query()
  .description({
    en: 'Get all score collections',
    ms: 'Dapatkan semua koleksi skor',
    'zh-CN': '获取所有乐谱集',
    'zh-TW': '獲取所有樂譜集'
  })
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('scores_library__collections_aggregated')
      .sort(['name'])
      .execute()
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new score collection',
    ms: 'Cipta koleksi skor baharu',
    'zh-CN': '创建新乐谱集',
    'zh-TW': '創建新樂譜集'
  })
  .input({
    body: SCHEMAS.scores_library.collections.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('scores_library__collections').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description({
    en: 'Update collection details',
    ms: 'Kemas kini butiran koleksi',
    'zh-CN': '更新集合详情',
    'zh-TW': '更新集合詳情'
  })
  .input({
    query: z.object({ id: z.string() }),
    body: SCHEMAS.scores_library.collections.schema
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update
      .collection('scores_library__collections')
      .id(id)
      .data(body)
      .execute()
  )

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete a score collection',
    ms: 'Padam koleksi skor',
    'zh-CN': '删除乐谱集',
    'zh-TW': '刪除樂譜集'
  })
  .input({
    query: z.object({ id: z.string() })
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('scores_library__collections').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
