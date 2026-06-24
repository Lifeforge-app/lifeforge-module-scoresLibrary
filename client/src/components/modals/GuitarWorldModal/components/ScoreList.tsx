import { ErrorScreen, LoadingScreen, Pagination, Stack } from '@lifeforge/ui'

import type { ScoreLibraryGuitarWorldResponse } from '..'
import ScoreItem from './ScoreItem'

function ScoreList({
  data,
  page,
  setPage,
  cookie
}: {
  data: ScoreLibraryGuitarWorldResponse | 'loading' | 'error'
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  cookie: string
}) {
  if (data === 'loading') {
    return <LoadingScreen />
  }

  if (data === 'error') {
    return <ErrorScreen message="Failed to fetch data" />
  }

  return (
    <>
      <Pagination
        page={page}
        totalPages={Math.ceil(data.totalItems / data.perPage)}
        onPageChange={setPage}
      />
      <Stack my="md">
        {data.data.map(entry => (
          <ScoreItem key={entry.id} cookie={cookie} entry={entry} />
        ))}
      </Stack>
      <Pagination
        page={page}
        totalPages={Math.ceil(data.totalItems / data.perPage)}
        onPageChange={setPage}
      />
    </>
  )
}

export default ScoreList
