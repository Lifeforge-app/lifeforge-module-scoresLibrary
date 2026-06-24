import type { ScoreLibraryEntry } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  FormModal,
  ListboxField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  author: z.string().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  collection: z.string().optional().catch('')
})

function ModifyEntryModal({
  onClose,
  data: { initialData }
}: {
  onClose: () => void
  data: {
    initialData: ScoreLibraryEntry
  }
}) {
  const { t } = useModuleTranslation()
  const queryClient = useQueryClient()
  const typesQuery = useQuery(forgeAPI.types.list.queryOptions())
  const collectionsQuery = useQuery(forgeAPI.collections.list.queryOptions())

  const typeOptions = [
    {
      value: '',
      text: t('scoreTypes.uncategorized'),
      icon: 'tabler:music-off'
    },
    ...(typesQuery.data?.map(({ id, icon, name }) => ({
      value: id,
      text: name,
      icon
    })) || [])
  ]

  const collectionOptions = [
    { value: '', text: 'None', icon: 'tabler:folder-off' },
    ...(collectionsQuery.data?.map(({ id, name }) => ({
      value: id,
      text: name,
      icon: 'tabler:folder'
    })) || [])
  ]

  const mutation = useMutation(
    forgeAPI.entries.update.input({ id: initialData.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.key })
        onClose()
      }
    })
  )

  const cleanupMutation = useMutation(
    forgeAPI.entries.cleanup.mutationOptions({
      onSuccess: data => {
        form.setValue('name', data.name)
        form.setValue('author', data.author)
      },
      onError: () => {
        toast.error('Failed to clean up name')
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

  const currentName = useWatch({ control: form.control, name: 'name' })

  const handleCleanup = useCallback(async () => {
    if (!currentName?.trim()) return

    await cleanupMutation.mutateAsync({ rawName: currentName })
  }, [currentName, cleanupMutation])

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: 'update',
        handler: mutation.mutateAsync
      }}
      uiConfig={{
        icon: 'tabler:pencil',
        loading: typesQuery.isLoading,
        title: 'scoresLibrary.update',
        onClose
      }}
    >
      <TextField
        required
        actionButtonProps={{
          icon: 'mage:stars-c',
          onClick: handleCleanup,
          loading: cleanupMutation.isPending
        }}
        control={form.control}
        icon="tabler:music"
        label="modifyEntry.name"
        name="name"
        placeholder="A cool tab"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:user"
        label="modifyEntry.author"
        name="author"
        placeholder="John Doe"
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:category"
        label="modifyEntry.type"
        name="type"
        options={typeOptions}
      />
      <ListboxField
        control={form.control}
        icon="tabler:folder"
        label="modifyEntry.collection"
        name="collection"
        options={collectionOptions}
      />
    </FormModal>
  )
}

export default ModifyEntryModal
