import z from 'zod'

import forge from '../forge'
import scoresLibrarySchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all music score types',
    output: {
      OK: z.array(scoresLibrarySchemas.types_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList.collection('types_aggregated').sort(['name']).execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new score type',
    input: {
      body: scoresLibrarySchemas.types
    },
    output: {
      CREATED: scoresLibrarySchemas.types
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(await pb.create.collection('types').data(body).execute())
  )

export const update = forge
  .mutation({
    description: 'Update score type details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: scoresLibrarySchemas.types
    },
    existenceCheck: {
      query: { id: 'types' }
    },
    output: {
      OK: scoresLibrarySchemas.types,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(await pb.update.collection('types').id(id).data(body).execute())
  )

export const remove = forge
  .mutation({
    description: 'Delete a score type',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'types' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('types').id(id).execute()

    return response.noContent()
  })
