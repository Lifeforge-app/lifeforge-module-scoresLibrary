import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'

import { type SocketEvent, useSocketContext } from '@lifeforge/api'
import { ContextMenu, FAB, ModuleHeader, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ActionMenu from './components/ActionMenu'
import UploadTabButton from './components/UploadTabButton'

function Header({
  setGuitarWorldModalOpen
}: {
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const socket = useSocketContext()
  const queryClient = useQueryClient()
  const toastId = useRef<string | number | null>(null)

  const uploadFiles = useCallback(async () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.mp3,.mscz'

    input.onchange = async e => {
      const files = (e.target as HTMLInputElement).files

      if (files === null) {
        return
      }

      if (files.length > 100) {
        toast.error('You can only upload 100 files at a time!')

        return
      }

      if (
        Array.from(files).some(
          f => !['pdf', 'mp3', 'mscz'].includes(f.name.split('.').pop()!)
        )
      ) {
        toast.error('Only PDF, MP3, and MSCZ files are allowed!')

        return
      }

      try {
        const taskId = await forgeAPI.entries.upload.mutate({
          files: Array.from(files)
        })

        socket.on(
          'taskPoolUpdate',
          (
            data: SocketEvent<
              undefined,
              {
                left: number
                total: number
              }
            >
          ) => {
            if (!data || data.taskId !== taskId) return

            if (data.status === 'failed') {
              toast.done(toastId.current!)
              console.error(data.error)
              toastId.current = null
              setTimeout(() => toast.error('Failed to upload scores!'), 100)

              return
            }

            if (data.status === 'running') {
              if (toastId.current === null) {
                toastId.current = toast('Upload in Progress', {
                  progress: 0,
                  autoClose: false
                })
              }

              toast.update(toastId.current, {
                progress:
                  (data.progress!.total - data.progress!.left) /
                  data.progress!.total
              })
            }

            if (data.status === 'completed') {
              toast.done(toastId.current!)
              toastId.current = null
              queryClient.invalidateQueries({
                queryKey: forgeAPI.key
              })
            }
          }
        )
      } catch (error) {
        console.error(error)
        toast.done(toastId.current!)
        setTimeout(() => toast.error('Failed to upload scores'), 100)
      }
    }
    input.click()
  }, [socket, queryClient])

  return (
    <>
      <ModuleHeader
        trailing={
          <>
            <UploadTabButton
              setGuitarWorldModalOpen={setGuitarWorldModalOpen}
              uploadFiles={uploadFiles}
            />
            <ContextMenu display={{ base: 'block', md: 'none' }}>
              <ActionMenu />
            </ContextMenu>
          </>
        }
      />
      <FAB icon="tabler:plus" onClick={uploadFiles} />
    </>
  )
}

export default Header
