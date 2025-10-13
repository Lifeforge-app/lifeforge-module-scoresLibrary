import useFilter from '@/hooks/useFilter'
import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  EmptyStateScreen,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useMemo } from 'react'

import ModifyCollectionModal from '../modals/ModifyCollectionModal'
import ModifyCategoryModal from '../modals/ModifyTypeModal'
import SidebarAuthorItem from './components/SidebarAuthorItem'
import SidebarTypeItem from './components/SidebarCategoryItem'
import SidebarCollectionItem from './components/SidebarCollectionItem'

function Sidebar() {
  const open = useModalStore(state => state.open)

  const dataQuery = useQuery(
    forgeAPI.scoresLibrary.entries.sidebarData.queryOptions()
  )

  const {
    author,
    starred,
    category: type,
    collection,
    updateFilter
  } = useFilter()

  const collectionsQuery = useQuery(
    forgeAPI.scoresLibrary.collections.list.queryOptions()
  )

  const sortedAuthors = useMemo(
    () =>
      Object.entries(dataQuery.data?.authors ?? {}).sort((a, b) => {
        if (a[1] === b[1]) return a[0].localeCompare(b[0])

        return b[1] - a[1]
      }),
    [dataQuery]
  )

  return (
    <SidebarWrapper>
      <WithQuery query={dataQuery}>
        {sidebarData => (
          <>
            <SidebarItem
              active={[type, author, starred, collection].every(v => !v)}
              icon="tabler:list"
              label="All scores"
              namespace="apps.scoresLibrary"
              number={sidebarData.total}
              onClick={() => {
                updateFilter('category', null)
                updateFilter('collection', null)
                updateFilter('author', null)
                updateFilter('starred', false)
              }}
            />
            <SidebarItem
              active={starred}
              icon="tabler:star-filled"
              label="Starred"
              namespace="apps.scoresLibrary"
              number={sidebarData.favourites}
              onClick={() => {
                updateFilter('starred', true)
              }}
            />
            <SidebarDivider />
            <SidebarTitle
              actionButtonIcon="tabler:plus"
              actionButtonOnClick={() => {
                open(ModifyCollectionModal, {
                  type: 'create'
                })
              }}
              label="collections"
              namespace="apps.scoresLibrary"
            />
            <WithQuery query={collectionsQuery}>
              {collections =>
                collections.length > 0 ? (
                  <>
                    {collections.map(c => (
                      <SidebarCollectionItem
                        key={c.id}
                        data={c}
                        isActive={collection === c.id}
                        onSelect={(collection: string | null) => {
                          updateFilter('collection', collection)
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <EmptyStateScreen
                    smaller
                    className="h-min"
                    icon="tabler:folder-off"
                    name="collections"
                    namespace="apps.scoresLibrary"
                  />
                )
              }
            </WithQuery>
            <SidebarDivider />
            <SidebarTitle
              actionButtonIcon="tabler:plus"
              actionButtonOnClick={() => {
                open(ModifyCategoryModal, {
                  openType: 'create'
                })
              }}
              label="categories"
              namespace="apps.scoresLibrary"
            />
            {sidebarData.types.length > 0 ? (
              sidebarData.types.map(t => (
                <SidebarTypeItem key={t.id} data={t} isActive={type === t.id} />
              ))
            ) : (
              <EmptyStateScreen
                smaller
                className="h-min"
                icon="tabler:apps-off"
                name="categories"
                namespace="apps.scoresLibrary"
              />
            )}
            <SidebarDivider />
            <SidebarTitle label="authors" namespace="apps.scoresLibrary" />
            {sortedAuthors.length > 0 ? (
              sortedAuthors.map(([auth, count]) => (
                <SidebarAuthorItem
                  key={auth}
                  author={auth}
                  count={count}
                  isActive={(auth || '[na]') === author}
                />
              ))
            ) : (
              <EmptyStateScreen
                smaller
                className="h-min"
                icon="tabler:user-off"
                name="authors"
                namespace="apps.scoresLibrary"
              />
            )}
          </>
        )}
      </WithQuery>
    </SidebarWrapper>
  )
}

export default Sidebar
