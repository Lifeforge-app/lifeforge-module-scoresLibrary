import type { ScoreLibraryType } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  FormModal,
  IconField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().min(1, 'Required')
})

function ModifyCategoryModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    initialData?: ScoreLibraryType
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.types.create
      : forgeAPI.types.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.key })
        onClose()
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
        template: openType,
        handler: mutation.mutateAsync
      }}
      uiConfig={{
        icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `categories.${openType}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:category"
        label="modifyType.name"
        name="name"
        placeholder="New Category"
      />
      <IconField
        required
        control={form.control}
        label="modifyType.icon"
        name="icon"
      />
    </FormModal>
  )
}

export default ModifyCategoryModal
