import { asc, count, eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { scoreCollections, scoreEntries } from '../schema.drizzle'

const collectionDto = createSelectSchema(scoreCollections)

const collectionAggregateDto = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number()
})

const collectionInputDto = z.object({
  name: z.string()
})

export const list = forge
  .query({
    description: 'Get all score collections',
    output: {
      OK: z.array(collectionAggregateDto)
    }
  })
  .callback(async ({ db, response }) => {
    const rows = await db
      .select({
        id: scoreCollections.id,
        name: scoreCollections.name,
        amount: count(scoreEntries.id)
      })
      .from(scoreCollections)
      .leftJoin(scoreEntries, eq(scoreEntries.collection, scoreCollections.id))
      .groupBy(scoreCollections.id)
      .orderBy(asc(scoreCollections.name))

    return response.ok(rows)
  })

export const create = forge
  .mutation({
    description: 'Create a new score collection',
    input: {
      body: collectionInputDto
    },
    output: {
      CREATED: collectionDto
    }
  })
  .callback(async ({ db, body, response }) => {
    const [created] = await db
      .insert(scoreCollections)
      .values(body)
      .returning()

    return response.created(created)
  })

export const update = forge
  .mutation({
    description: 'Update collection details',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), scoreCollections)
      }),
      body: collectionInputDto
    },
    output: {
      OK: collectionDto
    }
  })
  .callback(async ({ db, query: { id }, body, response }) => {
    const [updated] = await db
      .update(scoreCollections)
      .set(body)
      .where(eq(scoreCollections.id, id))
      .returning()

    return response.ok(updated)
  })

export const remove = forge
  .mutation({
    description: 'Delete a score collection',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), scoreCollections)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(scoreCollections).where(eq(scoreCollections.id, id))

    return response.noContent()
  })
