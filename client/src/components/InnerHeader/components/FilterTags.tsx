import { useQuery } from '@tanstack/react-query'

import { TagsFilter } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import useFilter from '../../../hooks/useFilter'

function FilterTags() {
  const {
    category,
    author,
    collection,
    updateFilter
  } = useFilter()

  const sidebarDataQuery = useQuery(forgeAPI.entries.sidebarData.queryOptions())
  const typesQuery = useQuery(forgeAPI.types.list.queryOptions())
  const collectionsQuery = useQuery(forgeAPI.collections.list.queryOptions())

  return (
    <TagsFilter
      availableFilters={{
        type: {
          data:
            typesQuery.data?.map(type => ({
              id: type.id,
              label: type.name,
              icon: type.icon
            })) ?? []
        },
        author: {
          data:
            Object.keys(sidebarDataQuery.data?.authors ?? {}).map(author => ({
              id: author,
              label: author,
              icon: 'tabler:user'
            })) ?? []
        },
        collection: {
          data:
            collectionsQuery.data?.map(collection => ({
              id: collection.id,
              label: collection.name,
              icon: 'tabler:books'
            })) ?? []
        }
      }}
      mt="md"
      values={{
        type: category,
        author,
        collection
      }}
      onChange={{
        type: value => updateFilter('category', value),
        author: value => updateFilter('author', value),
        collection: value => updateFilter('collection', value)
      }}
    />
  )
}

export default FilterTags