import { type RelationsBuilder } from 'drizzle-orm'
import {
  boolean,
  integer,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

const pgTable = createModuleTable()

export const scoreTypes = pgTable('types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().default(''),
  icon: text('icon').notNull().default('')
})

export const scoreCollections = pgTable('collections', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().default('')
})

export const scoreEntries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().default(''),
  type: uuid('type').references(() => scoreTypes.id, { onDelete: 'set null' }),
  page_count: text('page_count').notNull().default(''),
  thumbnail: text('thumbnail').notNull().default(''),
  author: text('author').notNull().default(''),
  pdf: text('pdf').notNull().default(''),
  audio: text('audio').notNull().default(''),
  musescore: text('musescore').notNull().default(''),
  is_favourite: boolean('is_favourite').notNull().default(false),
  collection: uuid('collection').references(() => scoreCollections.id, {
    onDelete: 'set null'
  }),
  guitar_world_id: integer('guitar_world_id'),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const tables = {
  entries: scoreEntries,
  types: scoreTypes,
  collections: scoreCollections
}

export const relations = (r: RelationsBuilder<typeof tables>) => ({
  entries: {
    type_info: r.one.types({ from: r.entries.type, to: r.types.id }),
    collection_info: r.one.collections({
      from: r.entries.collection,
      to: r.collections.id
    })
  },
  types: {
    entries: r.many.entries()
  },
  collections: {
    entries: r.many.entries()
  }
})
