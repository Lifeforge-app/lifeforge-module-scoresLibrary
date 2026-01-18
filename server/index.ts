import { forgeRouter } from '@lifeforge/server-utils'

import * as collectionsRouter from './routes/collections'
import * as entriesRouter from './routes/entries'
import * as guitarWorldRouter from './routes/guitarWorld'
import * as typesRouter from './routes/types'

export default forgeRouter({
  entries: entriesRouter,
  guitarWorld: guitarWorldRouter,
  types: typesRouter,
  collections: collectionsRouter
})
