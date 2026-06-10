import { useModuleTranslation } from '@lifeforge/localization'

import { SidebarItem } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

function SidebarAuthorItem({
  author,
  count,
  isActive
}: {
  author: string | null
  count: number
  isActive: boolean
}) {
  const { t } = useModuleTranslation()
  const { updateFilter } = useFilter()

  return (
    <SidebarItem
      active={isActive}
      icon="tabler:user"
      label={author || t('unknownAuthor')}
      number={count}
      onCancelButtonClick={() => updateFilter('author', null)}
      onClick={() => updateFilter('author', author || '[na]')}
    />
  )
}

export default SidebarAuthorItem
