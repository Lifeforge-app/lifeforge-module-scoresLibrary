import { useQuery } from '@tanstack/react-query'
import {
  ContentWrapperWithSidebar,
  LayoutWithSidebar,
  Pagination,
  Scrollbar,
  TagsFilter,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useEffect } from 'react'
import { type InferInput, type InferOutput } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import Header from './components/Header'
import InnerHeader from './components/InnerHeader'
import Searchbar from './components/Searchbar'
import Sidebar from './components/Sidebar'
import GuitarWorldModal from './components/modals/GuitarWorldModal'
import useFilter from './hooks/useFilter'
import './index.css'
import Views from './views'

export type ScoreLibraryEntry = InferOutput<
  typeof forgeAPI.scoresLibrary.entries.list
>['items'][number]

export type ScoreLibraryType = InferOutput<
  typeof forgeAPI.scoresLibrary.types.list
>[number]

export type ScoreLibrarySidebarData = InferOutput<
  typeof forgeAPI.scoresLibrary.entries.sidebarData
>

export type ScoreLibrarySortType = NonNullable<
  InferInput<typeof forgeAPI.scoresLibrary.entries.list>['query']['sort']
> | null

export type ScoreLibraryCollection = InferOutput<
  typeof forgeAPI.scoresLibrary.collections.list
>[number]

function ScoresLibrary() {
  const {
    searchQuery,
    category,
    collection,
    starred,
    author,
    sort,
    page,
    updateFilter
  } = useFilter()

  const entriesQuery = useQuery(
    forgeAPI.scoresLibrary.entries.list
      .input({
        page: page.toString(),
        query: searchQuery.trim(),
        category: category ? category : undefined,
        collection: collection ? collection : undefined,
        starred: starred ? 'true' : 'false',
        author: author ? author : undefined,
        sort
      })
      .queryOptions()
  )

  const sidebarDataQuery = useQuery(
    forgeAPI.scoresLibrary.entries.sidebarData.queryOptions()
  )

  const typesQuery = useQuery(forgeAPI.scoresLibrary.types.list.queryOptions())

  const collectionsQuery = useQuery(
    forgeAPI.scoresLibrary.collections.list.queryOptions()
  )

  const { open } = useModalStore()

  useEffect(() => {
    updateFilter('page', 1)
  }, [searchQuery, category, collection, starred, author, sort])

  return (
    <>
      <Header
        setGuitarWorldModalOpen={() => open(GuitarWorldModal, null)}
        totalItems={entriesQuery.data?.totalItems}
      />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader totalItemsCount={entriesQuery.data?.totalItems ?? 0} />
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
                  Object.keys(sidebarDataQuery.data?.authors ?? {}).map(
                    author => ({
                      id: author,
                      label: author,
                      icon: 'tabler:user'
                    })
                  ) ?? []
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
          <Searchbar />
          <WithQuery query={entriesQuery}>
            {entries => (
              <Scrollbar className="mt-6">
                <Pagination
                  className="mb-3"
                  page={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={page => updateFilter('page', page)}
                />
                <Views
                  entries={entries.items}
                  totalItems={entries.totalItems}
                />
                <Pagination
                  className="mt-3 mb-6"
                  page={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={page => updateFilter('page', page)}
                />
              </Scrollbar>
            )}
          </WithQuery>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </>
  )
}

export default ScoresLibrary
