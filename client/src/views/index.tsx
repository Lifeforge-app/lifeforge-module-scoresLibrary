import { EmptyStateScreen, createViewMode } from '@lifeforge/ui'

import type { ScoreLibraryEntry } from '..'
import GridView from './GridView'
import ListView from './ListView'

const VIEWS = {
  grid: {
    icon: 'uil:apps',
    component: GridView
  },
  list: {
    icon: 'tabler:list',
    component: ListView
  }
} as const

export const ScoreView = createViewMode({
  modes: (Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map(m => ({
    value: m,
    icon: VIEWS[m].icon
  })),
  selectorProps: {
    display: { base: 'none', md: 'flex' }
  }
})

function Views({
  entries,
  totalItems
}: {
  entries: ScoreLibraryEntry[]
  totalItems: number
}) {
  if (totalItems === 0) {
    return (
      <EmptyStateScreen
        icon="tabler:music-off"
        message={{
          id: 'score'
        }}
      />
    )
  }

  return Object.entries(VIEWS).map(([mode, { component: Component }]) => (
    <ScoreView.When key={mode} mode={mode as keyof typeof VIEWS}>
      <Component entries={entries} />
    </ScoreView.When>
  ))
}

export default Views
