import type { ScoreLibraryType } from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useDrop } from 'react-dnd'

import {
  Box,
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  colorWithOpacity,
  toast,
  useModalStore
} from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { forgeAPI } from '@/manifest'

import ModifyCategoryModal from '../../modals/ModifyTypeModal'

function SidebarTypeItem({
  data,
  isActive
}: {
  data: ScoreLibraryType
  isActive: boolean
}) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const { updateFilter } = useFilter()

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'ENTRY',
      drop: async (item: {
        entryId: string
        entryName: string
        entryAuthor: string
      }) => {
        try {
          await forgeAPI.entries.update.input({ id: item.entryId }).mutate({
            name: item.entryName,
            author: item.entryAuthor,
            type: data.id
          })
          queryClient.invalidateQueries({
            queryKey: forgeAPI.key
          })
        } catch {
          toast.error('Failed to assign category')
        }
      },
      collect: monitor => ({
        isOver: !!monitor.isOver()
      })
    }),
    [data.id]
  )

  const handleUpdate = useCallback(() => {
    open(ModifyCategoryModal, {
      openType: 'update',
      initialData: data
    })
  }, [data])

  const deleteMutation = useMutation(
    forgeAPI.types.remove.input({ id: data.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.key
        })
        toast.success('Successfully updated category for the score')
      },
      onError: () => {
        toast.error('Failed to delete type')
      }
    })
  )

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Type',
      description: 'Are you sure you want to delete this type?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [])

  return (
    <Box
      key={data.id}
      ref={node => {
        dropRef(node)
      }}
      bg={isOver ? { base: colorWithOpacity('custom-500', '20%') } : undefined}
      r="lg"
    >
      <SidebarItem
        active={isActive}
        contextMenuItems={
          <>
            <ContextMenuItem
              icon="tabler:pencil"
              label="update"
              onClick={handleUpdate}
            />
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="delete"
              onClick={handleDelete}
            />
          </>
        }
        icon={data.icon}
        label={data.name}
        namespace={false}
        number={data.amount}
        onCancelButtonClick={() => updateFilter('category', null)}
        onClick={() => updateFilter('category', data.id)}
      />
    </Box>
  )
}

export default SidebarTypeItem
