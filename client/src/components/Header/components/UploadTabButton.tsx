import { memo, useCallback, useMemo } from 'react'
import { useModuleTranslation } from '@lifeforge/localization'

import { Button, ContextMenu, ContextMenuItem } from '@lifeforge/ui'

function UploadTabButton({
  uploadFiles,
  setGuitarWorldModalOpen
}: {
  uploadFiles: () => void
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useModuleTranslation()

  const handleOpenGuitarWorldModal = useCallback(() => {
    setGuitarWorldModalOpen(true)
  }, [])

  const tProps = useMemo(
    () => ({
      item: t('items.score')
    }),
    [t]
  )

  return (
    <ContextMenu
      buttonComponent={
        <Button className="hidden md:flex" icon="tabler:plus" tProps={tProps}>
          new
        </Button>
      }
      classNames={{ wrapper: 'hidden md:block' }}
    >
      <ContextMenuItem
        icon="tabler:upload"
        label="Upload from local"
        namespace="apps.scoresLibrary"
        onClick={uploadFiles}
      />
      <ContextMenuItem
        icon="mingcute:guitar-line"
        label="Download from Guitar World"
        namespace="apps.scoresLibrary"
        onClick={handleOpenGuitarWorldModal}
      />
    </ContextMenu>
  )
}

export default memo(UploadTabButton)
