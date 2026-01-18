import type { ScoreLibraryCollection } from '@'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { type InferInput } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

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
          queryKey: ['scoresLibrary', 'collections']
        })
      },
      onError: () => {
        toast.error('Failed to modify collection')
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.collections)[typeof type]>['body']
  >({
    namespace: 'apps.scoresLibrary',
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `collections.${type}`,
    onClose,
    submitButton: type
  })
    .typesMap({
      name: 'text'
    })
    .setupFields({
      name: {
        label: 'Collection Name',
        placeholder: 'My Score Collection',
        required: true,
        icon: 'tabler:folder'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyCollectionModal
