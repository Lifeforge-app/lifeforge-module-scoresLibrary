import { useModuleTranslation } from '@lifeforge/localization'
import { Button, Flex, Text, useModuleSidebarState } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

import FilterTags from './components/FilterTags'
import Searchbar from './components/Searchbar'

function InnerHeader({ totalItemsCount }: { totalItemsCount: number }) {
  const { t } = useModuleTranslation()
  const { setIsSidebarOpen } = useModuleSidebarState()
  const { starred, author, category, collection } = useFilter()

  return (
    <>
      <Flex as="header" justify="between" width="100%">
        <Flex align="end" minWidth="0">
          <Text truncate as="h1" size="3xl" weight="semibold">
            {[
              starred && t('header.starred'),
              author || category || collection
                ? t('header.filteredScores')
                : t('header.allScores')
            ]
              .filter(Boolean)
              .join(' ')}
          </Text>
          <Text color="muted" ml="sm" mr="2xl" size="base">
            ({totalItemsCount})
          </Text>
        </Flex>
        <Button
          display={{ base: 'flex', lg: 'none' }}
          icon="tabler:menu"
          variant="plain"
          onClick={() => {
            setIsSidebarOpen(true)
          }}
        />
      </Flex>
      <FilterTags />
      <Searchbar />
    </>
  )
}

export default InnerHeader
