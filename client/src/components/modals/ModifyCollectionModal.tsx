import type { ScoreLibraryCollection } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { FormModal, TextField, createDefaultValues, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Required')
})

function ModifyCollectionModal({
  onClose,
  data: { type, initialData }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    initialData?: ScoreLibraryCollection
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.collections.create
      : forgeAPI.collections.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.collections.key
        })
      },
      onError: () => {
        toast.error('Failed to modify collection')
      }
    })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: mutation.mutateAsync
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `collections.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:folder"
        label="modifyCollection.name"
        name="name"
        placeholder="My Score Collection"
      />
    </FormModal>
  )
}

export default ModifyCollectionModal
