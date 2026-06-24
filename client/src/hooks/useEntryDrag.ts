import { useDrag } from 'react-dnd'

import type { ScoreLibraryEntry } from '@'

export function useEntryDrag(entry: ScoreLibraryEntry) {
  return useDrag(
    () => ({
      type: 'ENTRY',
      item: {
        entryId: entry.id,
        entryName: entry.name,
        entryAuthor: entry.author
      },
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
        isDragging: !!monitor.isDragging()
      })
    }),
    [entry.id, entry.name, entry.author]
  )
}
