import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { type InferInput, type InferOutput } from '@lifeforge/api'
import {
  Box,
  ContentWrapperWithSidebar,
  LayoutWithSidebar,
  Pagination,
  Scrollbar,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import Header from './components/Header'
import InnerHeader from './components/InnerHeader'
import Sidebar from './components/Sidebar'
import GuitarWorldModal from './components/modals/GuitarWorldModal'
import useFilter from './hooks/useFilter'
import Views from './views'

export type ScoreLibraryEntry = InferOutput<
  typeof forgeAPI.entries.list
>['items'][number]

export type ScoreLibraryType = InferOutput<typeof forgeAPI.types.list>[number]

export type ScoreLibrarySidebarData = InferOutput<
  typeof forgeAPI.entries.sidebarData
>

export type ScoreLibrarySortType = NonNullable<
  InferInput<typeof forgeAPI.entries.list>['query']['sort']
> | null

export type ScoreLibraryCollection = InferOutput<
  typeof forgeAPI.collections.list
>[number]

function ScoresLibrary() {
  const { open } = useModalStore()

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
    forgeAPI.entries.list
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

  useEffect(() => {
    updateFilter('page', 1)
  }, [searchQuery, author, category, collection, sort, starred])

  return (
    <DndProvider backend={HTML5Backend}>
      <Header
        setGuitarWorldModalOpen={() => open(GuitarWorldModal, null)}
        totalItems={entriesQuery.data?.totalItems}
      />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader totalItemsCount={entriesQuery.data?.totalItems ?? 0} />
          <WithQuery query={entriesQuery}>
            {entries => (
              <Box asChild mt="lg">
                <Scrollbar>
                  <Stack gap="md">
                    <Pagination
                      page={entries.page}
                      totalPages={entries.totalPages}
                      onPageChange={page => updateFilter('page', page)}
                    />
                    <Views
                      entries={entries.items}
                      totalItems={entries.totalItems}
                    />
                    <Pagination
                      mb="lg"
                      page={entries.page}
                      totalPages={entries.totalPages}
                      onPageChange={page => updateFilter('page', page)}
                    />
                  </Stack>
                </Scrollbar>
              </Box>
            )}
          </WithQuery>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </DndProvider>
  )
}

export default ScoresLibrary
