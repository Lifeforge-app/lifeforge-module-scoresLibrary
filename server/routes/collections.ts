import z from 'zod'

import forge from '../forge'
import scoresLibrarySchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all score collections',
    output: {
      OK: z.array(scoresLibrarySchemas.collections_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('collections_aggregated')
        .sort(['name'])
        .execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new score collection',
    input: {
      body: scoresLibrarySchemas.collections
    },
    output: {
      CREATED: scoresLibrarySchemas.collections
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(
      await pb.create.collection('collections').data(body).execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update collection details',
    input: {
      query: z.object({ id: z.string() }),
      body: scoresLibrarySchemas.collections
    },
    existenceCheck: {
      query: { id: 'collections' }
    },
    output: {
      OK: scoresLibrarySchemas.collections,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('collections').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a score collection',
    input: {
      query: z.object({ id: z.string() })
    },
    existenceCheck: {
      query: { id: 'collections' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('collections').id(id).execute()

    return response.noContent()
  })
