import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { ScoreLibraryEntry } from '..'
import ModifyEntryModal from './modals/ModifyEntryModal'

function EntryContextMenu({
  entry,
  children
}: {
  entry: ScoreLibraryEntry
  children?: React.ReactNode
}) {
  const { open } = useModalStore()
  const queryClient = useQueryClient()

  const toggleFavouriteStatusMutation = useMutation(
    forgeAPI.entries.toggleFavourite.input({ id: entry.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.key })
      },
      onError: () => {
        toast.error('Failed to toggle favourite status')
      }
    })
  )

  const deleteMutation = useMutation(
    forgeAPI.entries.remove.input({ id: entry.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.key })
      },
      onError: () => {
        toast.error('Failed to delete entry')
      }
    })
  )

  const handleUpdateEntry = useCallback(() => {
    open(ModifyEntryModal, { initialData: entry })
  }, [entry])

  const handleDeleteEntry = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Entry',
      description: `Are you sure you want to delete this score for song "${entry.name}"?`,
      confirmationPrompt: entry.name,
      onConfirm: () => deleteMutation.mutateAsync(undefined)
    })
  }, [entry])

  return (
    <ContextMenu>
      {children}
      <ContextMenuItem
        icon={entry.isFavourite ? 'tabler:star-off' : 'tabler:star'}
        label={entry.isFavourite ? 'Unfavourite' : 'Favourite'}
        shouldCloseMenuOnClick={false}
        onClick={() => {
          toggleFavouriteStatusMutation.mutateAsync(undefined)
        }}
      />
      <ContextMenuItem
        icon="tabler:pencil"
        label="Edit"
        onClick={handleUpdateEntry}
      />
      <ContextMenuItem
        dangerous
        icon="tabler:trash"
        label="Delete"
        onClick={handleDeleteEntry}
      />
    </ContextMenu>
  )
}

export default EntryContextMenu
