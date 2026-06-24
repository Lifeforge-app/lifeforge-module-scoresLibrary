import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  ContextMenuGroup,
  ContextMenuItem,
  SidebarDivider
} from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
] as const

function ActionMenu() {
  const { t } = useModuleTranslation()
  const { view, sort, updateFilter } = useFilter()

  return (
    <Box display={{ base: 'block', md: 'none' }}>
      <SidebarDivider noMargin />
      <ContextMenuGroup
        icon="tabler:sort-ascending"
        label={t('hamburgerMenu.sortBy')}
      >
        {SORT_TYPE.map(([icon, id]) => (
          <ContextMenuItem
            key={id}
            checked={sort === id}
            icon={icon}
            label={t(`sortTypes.${id}`)}
            onClick={() => {
              updateFilter('sort', id)
            }}
          />
        ))}
      </ContextMenuGroup>
      <SidebarDivider noMargin />
      <ContextMenuGroup icon="tabler:eye" label={t('hamburgerMenu.viewAs')}>
        {['grid', 'list'].map(type => (
          <ContextMenuItem
            key={type}
            checked={view === type}
            icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
            label={t(`viewTypes.${type}`)}
            onClick={() => {
              updateFilter('view', type as 'grid' | 'list')
            }}
          />
        ))}
      </ContextMenuGroup>
    </Box>
  )
}

export default ActionMenu
