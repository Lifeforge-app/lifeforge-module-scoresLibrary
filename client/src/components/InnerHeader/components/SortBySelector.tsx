import { useModuleTranslation } from '@lifeforge/localization'
import { Flex, Icon, Listbox, ListboxOption, Text } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function SortBySelector() {
  const { t } = useModuleTranslation()
  const { sort, updateFilter } = useFilter()

  return (
    <Listbox
      minWidth="14em"
      renderContent={() => (
        <Flex align="center" gap="sm" minWidth="0">
          <Icon
            icon={
              SORT_TYPE.find(([, value]) => value === sort)?.[0] ??
              'tabler:clock'
            }
          />
          <Text truncate weight="medium">
            {t(
              `sortTypes.${
                SORT_TYPE.find(([, value]) => value === sort)?.[1] ?? 'newest'
              }`
            )}
          </Text>
        </Flex>
      )}
      value={sort}
      onChange={value => updateFilter('sort', value)}
    >
      {SORT_TYPE.map(([icon, value]) => (
        <ListboxOption
          key={value}
          icon={icon}
          label={t(`sortTypes.${value}`)}
          value={value}
        />
      ))}
    </Listbox>
  )
}

export default SortBySelector
