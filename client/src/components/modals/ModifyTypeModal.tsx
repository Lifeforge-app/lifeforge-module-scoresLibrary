import type { ScoreLibraryType } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import type { InferInput } from 'shared'

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
      ? forgeAPI.scoresLibrary.types.create
      : forgeAPI.scoresLibrary.types.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
        onClose()
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.scoresLibrary.types)[typeof openType]>['body']
  >({
    icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `categories.${openType}`,
    namespace: 'apps.scoresLibrary',
    onClose,
    submitButton: openType
  })
    .typesMap({
      name: 'text',
      icon: 'icon'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Category Name',
        icon: 'tabler:category',
        placeholder: 'New Category'
      },
      icon: {
        required: true,
        label: 'Category Icon'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyCategoryModal
