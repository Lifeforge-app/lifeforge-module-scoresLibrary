import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  ContextMenuGroup,
  ContextMenuItem,
  SidebarDivider
} from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { ScoreView } from '@/views'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
] as const

function ActionMenu() {
  const { t } = useModuleTranslation()
  const { sort, updateFilter } = useFilter()

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
      <ScoreView.ContextMenuSelector />
    </Box>
  )
}

export default ActionMenu
