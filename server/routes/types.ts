import { asc, count, eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { scoreEntries, scoreTypes } from '../schema.drizzle'

const typeDto = createSelectSchema(scoreTypes)

const typeAggregateDto = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  amount: z.number()
})

const typeInputDto = z.object({
  name: z.string(),
  icon: z.string()
})

export const list = forge
  .query({
    description: 'Get all music score types',
    output: {
      OK: z.array(typeAggregateDto)
    }
  })
  .callback(async ({ db, response }) => {
    const rows = await db
      .select({
        id: scoreTypes.id,
        name: scoreTypes.name,
        icon: scoreTypes.icon,
        amount: count(scoreEntries.id)
      })
      .from(scoreTypes)
      .leftJoin(scoreEntries, eq(scoreEntries.type, scoreTypes.id))
      .groupBy(scoreTypes.id)
      .orderBy(asc(scoreTypes.name))

    return response.ok(rows)
  })

export const create = forge
  .mutation({
    description: 'Create a new score type',
    input: {
      body: typeInputDto
    },
    output: {
      CREATED: typeDto
    }
  })
  .callback(async ({ db, body, response }) => {
    const [created] = await db.insert(scoreTypes).values(body).returning()

    return response.created(created)
  })

export const update = forge
  .mutation({
    description: 'Update score type details',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), scoreTypes)
      }),
      body: typeInputDto
    },
    output: {
      OK: typeDto
    }
  })
  .callback(async ({ db, query: { id }, body, response }) => {
    const [updated] = await db
      .update(scoreTypes)
      .set(body)
      .where(eq(scoreTypes.id, id))
      .returning()

    return response.ok(updated)
  })

export const remove = forge
  .mutation({
    description: 'Delete a score type',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), scoreTypes)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(scoreTypes).where(eq(scoreTypes.id, id))

    return response.noContent()
  })
