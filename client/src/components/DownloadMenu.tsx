import { ContextMenu, ContextMenuItem } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { ScoreLibraryEntry } from '..'

function DownloadMenu({ entry }: { entry: ScoreLibraryEntry }) {
  const download = (key: string) => {
    const a = document.createElement('a')

    a.href = forgeAPI.getMedia({ key, download: 'true' })
    a.download = entry.name
    a.click()
  }

  return (
    <ContextMenu customIcon="tabler:download">
      <ContextMenuItem
        icon="tabler:file-text"
        label="PDF"
        namespace={false}
        onClick={() => download(entry.pdf)}
      />
      {entry.audio !== '' && (
        <ContextMenuItem
          icon="tabler:music"
          label="Audio"
          namespace={false}
          onClick={() => download(entry.audio)}
        />
      )}
      {entry.musescore !== '' && (
        <ContextMenuItem
          icon="simple-icons:musescore"
          label="Musescore"
          namespace={false}
          onClick={() => download(entry.musescore)}
        />
      )}
    </ContextMenu>
  )
}

export default DownloadMenu
