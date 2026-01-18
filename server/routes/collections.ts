import z from 'zod'

import forge from '../forge'
import scoresLibrarySchemas from '../schema'

export const list = forge
  .query()
  .description('Get all score collections')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('collections_aggregated').sort(['name']).execute()
  )

export const create = forge
  .mutation()
  .description('Create a new score collection')
  .input({
    body: scoresLibrarySchemas.collections
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('collections').data(body).execute()
  )

export const update = forge
  .mutation()
  .description('Update collection details')
  .input({
    query: z.object({ id: z.string() }),
    body: scoresLibrarySchemas.collections
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('collections').id(id).data(body).execute()
  )

export const remove = forge
  .mutation()
  .description('Delete a score collection')
  .input({
    query: z.object({ id: z.string() })
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('collections').id(id).execute()
  )
