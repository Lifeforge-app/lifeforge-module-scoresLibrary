import { lazy } from 'react'
import type { ModuleConfig } from 'shared'

export default {
  name: 'Scores Library',
  icon: 'tabler:file-music',
  routes: {
    'scores-library': lazy(() => import('./src'))
  },
  category: 'Storage'
} satisfies ModuleConfig
