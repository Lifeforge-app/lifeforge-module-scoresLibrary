import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import type { InferOutput } from '@lifeforge/api'
import {
  Button,
  ConfirmationModal,
  ModalHeader,
  TextInput,
  WithQuery,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ScoreList from './components/ScoreList'

export type ScoreLibraryGuitarWorldResponse = InferOutput<
  typeof forgeAPI.guitarWorld.list
>

function GuitarWorldModal({ onClose }: { onClose: () => void }) {
  const { open } = useModalStore()

  const [cookie, setCookie] = useState(
    localStorage.getItem('guitarWorldCookie') || ''
  )

  const [finalCookie, setFinalCookie] = useState(
    localStorage.getItem('guitarWorldCookie') || ''
  )

  const [page, setPage] = useState(1)

  const dataQuery = useQuery(
    forgeAPI.guitarWorld.list
      .input({ cookie: finalCookie, page: page.toString() })
      .queryOptions({
        enabled: !!finalCookie
      })
  )

  useEffect(() => {
    if (!dataQuery.data) return
    if (localStorage.getItem('guitarWorldCookie') === finalCookie) return

    localStorage.setItem('guitarWorldCookie', finalCookie)

    toast.info('Guitar World session cookie saved')
  }, [finalCookie, dataQuery.data])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        actionButtonProps={
          finalCookie
            ? {
                dangerous: true,
                icon: 'tabler:cookie-off',
                onClick: () => {
                  open(ConfirmationModal, {
                    title: 'Remove session cookie',
                    description:
                      'Are you sure you want to remove the Guitar World session cookie? You will have to re-enter it.',
                    onConfirm: async () => {
                      setFinalCookie('')
                      setCookie('')
                      localStorage.removeItem('guitarWorldCookie')
                    }
                  })
                }
              }
            : undefined
        }
        icon="mingcute:guitar-line"
        title="Guitar World"
        onClose={onClose}
      />
      {!finalCookie ? (
        <>
          <TextInput
            icon="tabler:cookie"
            label="cookie"
            placeholder="Cookie from Guitar World"
            value={cookie}
            onChange={setCookie}
          />
          <Button
            className="mt-4 w-full"
            icon="tabler:arrow-right"
            iconPosition="end"
            onClick={() => {
              setFinalCookie(cookie)
            }}
          >
            Proceed
          </Button>
        </>
      ) : (
        <WithQuery query={dataQuery}>
          {data => (
            <ScoreList
              cookie={cookie}
              data={data}
              page={page}
              setPage={setPage}
            />
          )}
        </WithQuery>
      )}
    </div>
  )
}

export default GuitarWorldModal
