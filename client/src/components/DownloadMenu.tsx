import { ContextMenu, ContextMenuItem } from '@lifeforge/ui'

import type { ScoreLibraryEntry } from '..'

function DownloadMenu({ entry }: { entry: ScoreLibraryEntry }) {
  return (
    <ContextMenu customIcon="tabler:download">
      <ContextMenuItem
        icon="tabler:file-text"
        label="PDF"
        namespace={false}
        onClick={() => {
          const a = document.createElement('a')

          a.href = `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
            entry.id
          }/${entry.pdf}`
          a.download = entry.pdf
          a.click()
        }}
      />
      {entry.audio !== '' && (
        <ContextMenuItem
          icon="tabler:music"
          label="Audio"
          namespace={false}
          onClick={() => {
            const a = document.createElement('a')

            a.href = `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
              entry.id
            }/${entry.audio}`
            a.download = entry.audio
            a.click()
          }}
        />
      )}
      {entry.musescore !== '' && (
        <ContextMenuItem
          icon="simple-icons:musescore"
          label="Musescore"
          namespace={false}
          onClick={() => {
            const a = document.createElement('a')

            a.href = `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
              entry.id
            }/${entry.musescore}`
            a.download = entry.musescore
            a.click()
          }}
        />
      )}
    </ContextMenu>
  )
}

export default DownloadMenu
