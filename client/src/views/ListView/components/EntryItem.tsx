import type { ScoreLibraryEntry } from '@'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { Card, Flex, Icon, Text } from '@lifeforge/ui'

import { useEntryDrag } from '@/hooks/useEntryDrag'
import { forgeAPI } from '@/manifest'

import AudioPlayer from '../../../components/AudioPlayer'
import DownloadMenu from '../../../components/DownloadMenu'
import EntryContextMenu from '../../../components/EntryContextMenu'

function EntryItem({ entry }: { entry: ScoreLibraryEntry }) {
  const typesQuery = useQuery(forgeAPI.types.list.queryOptions())
  const collectionsQuery = useQuery(forgeAPI.collections.list.queryOptions())
  const [{ opacity, isDragging }, dragRef] = useEntryDrag(entry)

  const type = useMemo(() => {
    return typesQuery.data?.find(type => type.id === entry.type)
  }, [typesQuery.data, entry.type])

  const collection = useMemo(() => {
    return collectionsQuery.data?.find(
      collection => collection.id === entry.collection
    )
  }, [collectionsQuery.data, entry.collection])

  return (
    <Card
      key={entry.id}
      ref={node => {
        dragRef(node)
      }}
      align="center"
      as="a"
      className={isDragging ? 'cursor-move' : ''}
      direction="row"
      gap="md"
      href={forgeAPI.getMedia({
        collectionId: entry.collectionId,
        recordId: entry.id,
        fieldId: entry.pdf
      })}
      minWidth="0"
      rel="noreferrer"
      style={{ opacity }}
      target="_blank"
      width="100%"
    >
      <Flex
        centered
        bg={{ base: 'bg-200', dark: 'bg-800' }}
        r="sm"
        style={{ width: '4rem', overflow: 'hidden' }}
      >
        <img
          alt=""
          src={forgeAPI.getMedia({
            collectionId: entry.collectionId,
            recordId: entry.id,
            fieldId: entry.thumbnail,
            thumb: '0x512'
          })}
          style={{ height: '100%' }}
        />
      </Flex>
      <Flex direction="column" flex="1" minWidth="0" width="100%">
        {type && (
          <Flex align="center" gap="xs" mb="xs">
            <Icon color="muted" icon={type.icon} size="1em" />
            <Text truncate color="muted" size="sm">
              {type.name}
            </Text>
          </Flex>
        )}
        <Flex align="center" gap="xs" width="100%">
          <Text truncate as="h3" size="lg" weight="semibold">
            {entry.name}
          </Text>
          {entry.isFavourite && (
            <Icon color="yellow-500" icon="tabler:star-filled" size="1em" />
          )}
        </Flex>
        <Flex align="center" gap="xs" minWidth="0" mt="xs" width="100%">
          <Text truncate color="muted" size="sm" weight="medium">
            {entry.author !== '' ? entry.author : 'Unknown'}
          </Text>
          <Icon color="muted" icon="tabler:circle-filled" size="0.25em" />
          <Text color="muted" size="sm" weight="medium">
            {entry.pageCount} pages
          </Text>
          {collection && (
            <>
              <Icon color="muted" icon="tabler:circle-filled" size="0.25em" />
              <Flex align="center" gap="xs">
                <Icon color="muted" icon="tabler:folder" size="1em" />
                <Text color="muted" size="sm" weight="medium">
                  {collection.name}
                </Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
      {entry.audio && (
        <AudioPlayer
          url={forgeAPI.getMedia({
            collectionId: entry.collectionId,
            recordId: entry.id,
            fieldId: entry.audio
          })}
        />
      )}
      <DownloadMenu entry={entry} />
      <EntryContextMenu entry={entry} />
    </Card>
  )
}

export default EntryItem
