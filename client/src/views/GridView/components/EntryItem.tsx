import type { ScoreLibraryEntry } from '@'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { Box, Card, Flex, Icon, Text, colorWithOpacity } from '@lifeforge/ui'

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
      as="a"
      className={isDragging ? 'cursor-move' : ''}
      href={forgeAPI.getMedia({
        collectionId: entry.collectionId,
        recordId: entry.id,
        fieldId: entry.pdf
      })}
      rel="noreferrer"
      style={{ opacity }}
      target="_blank"
    >
      <Box position="relative">
        <Flex
          centered
          aspectRatio="1 / 1.4142"
          bg={{ base: 'bg-100', dark: 'bg-800' }}
          overflow="hidden"
          position="relative"
          r="md"
          width="100%"
        >
          <Box
            asChild
            left="50%"
            position="absolute"
            style={{ transform: 'translate(-50%, -50%)' }}
            top="50%"
          >
            <Icon
              color={{ base: 'bg-300', dark: 'bg-700' }}
              icon="tabler:file-music"
              size="4em"
            />
          </Box>
          <Box
            asChild
            height="100%"
            position="relative"
            style={{
              objectFit: 'cover',
              objectPosition: 'top'
            }}
          >
            <img
              key={entry.id}
              alt=""
              src={forgeAPI.getMedia({
                collectionId: entry.collectionId,
                recordId: entry.id,
                fieldId: entry.thumbnail,
                thumb: '0x512'
              })}
            />
          </Box>
        </Flex>
        <Box
          bg={colorWithOpacity('bg-500', '80%')}
          bottom="0"
          position="absolute"
          px="sm"
          py="xs"
          rbr="sm"
          right="0"
          rtl="md"
        >
          <Text color="bg-50" size="xs" weight="medium">
            {entry.pageCount} pages
          </Text>
        </Box>
        <Box flexShrink="0" position="absolute" right="0" top="0">
          <EntryContextMenu entry={entry} />
        </Box>
      </Box>
      <Flex
        align="center"
        gap="2xl"
        justify="between"
        minWidth="0"
        mt="md"
        width="100%"
      >
        <Flex direction="column" minWidth="0" width="100%">
          {collection && (
            <Flex align="center" gap="xs" mb="xs">
              <Icon color="muted" icon="tabler:folder" size="1em" />
              <Text truncate color="muted" size="sm">
                {collection.name}
              </Text>
            </Flex>
          )}
          {type && (
            <Flex align="center" gap="xs" mb="xs">
              <Icon color="muted" icon={type.icon} size="1em" />
              <Text truncate color="muted" size="sm">
                {type.name}
              </Text>
            </Flex>
          )}
          <Flex align="center" gap="xs">
            <Text truncate as="h3" size="lg" weight="medium">
              {entry.name}
            </Text>
            {entry.isFavourite && (
              <Icon color="yellow-500" icon="tabler:star-filled" size="1em" />
            )}
          </Flex>
          <Text truncate color="custom-500" mt="xs" size="sm">
            {entry.author || 'Unknown'}
          </Text>
        </Flex>
        <Flex align="center" display={{ base: 'none', sm: 'flex' }} gap="xs">
          <DownloadMenu entry={entry} />
          {entry.audio && (
            <AudioPlayer
              url={forgeAPI.getMedia({
                collectionId: entry.collectionId,
                recordId: entry.id,
                fieldId: entry.audio
              })}
            />
          )}
        </Flex>
      </Flex>
    </Card>
  )
}

export default EntryItem
