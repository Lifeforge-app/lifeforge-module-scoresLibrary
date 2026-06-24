import { useState } from 'react'

import { Flex, SearchInput, ViewModeSelector, toast } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { forgeAPI } from '@/manifest'

import SortBySelector from './SortBySelector'

function Searchbar() {
  const { searchQuery, setSearchQuery, view, updateFilter } = useFilter()
  const [requestRandomLoading, setRequestRandomLoading] = useState(false)

  async function requestRandomEntry() {
    setRequestRandomLoading(true)

    try {
      const entry = await forgeAPI.entries.random.query()

      const url = forgeAPI.getMedia({
        collectionId: entry.collectionId,
        recordId: entry.id,
        fieldId: entry.pdf
      })

      window.open(url, '_blank')
      setRequestRandomLoading(false)
    } catch {
      toast.error('Failed to fetch random entry')
    } finally {
      setRequestRandomLoading(false)
    }
  }

  return (
    <Flex direction={{ base: 'column', md: 'row' }} gap="sm" mt="md">
      <SortBySelector />
      <SearchInput
        actionButtonProps={{
          icon: 'tabler:dice',
          onClick: requestRandomEntry,
          loading: requestRandomLoading,
          variant: 'plain'
        }}
        debounceMs={300}
        searchTarget="score"
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <ViewModeSelector
        currentMode={view}
        display={{ base: 'none', md: 'flex' }}
        options={[
          { value: 'list', icon: 'uil:list-ul' },
          { value: 'grid', icon: 'uil:apps' }
        ]}
        onModeChange={mode => updateFilter('view', mode)}
      />
    </Flex>
  )
}

export default Searchbar
