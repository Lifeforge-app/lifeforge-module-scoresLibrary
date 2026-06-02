import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as collectionsRouter from './routes/collections'
import * as entriesRouter from './routes/entries'
import * as guitarWorldRouter from './routes/guitarWorld'
import * as typesRouter from './routes/types'

const routes = forgeRouter({
  entries: entriesRouter,
  guitarWorld: guitarWorldRouter,
  types: typesRouter,
  collections: collectionsRouter
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
