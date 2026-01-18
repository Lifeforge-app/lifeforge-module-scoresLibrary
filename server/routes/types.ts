import z from 'zod'

import forge from '../forge'
import scoresLibrarySchemas from '../schema'

export const list = forge
  .query()
  .description('Get all music score types')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('types_aggregated').sort(['name']).execute()
  )

export const create = forge
  .mutation()
  .description('Create a new score type')
  .input({
    body: scoresLibrarySchemas.types
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('types').data(body).execute()
  )

export const update = forge
  .mutation()
  .description('Update score type details')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: scoresLibrarySchemas.types
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('types').id(id).data(body).execute()
  )

export const remove = forge
  .mutation()
  .description('Delete a score type')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('types').id(id).execute()
  )
