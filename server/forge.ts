import { createForgeContractBuilder } from '@lifeforge/server-utils'

import * as schema from './schema.drizzle'

export type ScoresLibrarySchema = typeof schema

const forge = createForgeContractBuilder({ schema })

export default forge
