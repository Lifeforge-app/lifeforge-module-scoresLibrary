import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { type SocketEvent, useSocketContext } from '@lifeforge/api'
import { Button, Flex, Icon, TagChip, Text, WithDivide, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { ScoreLibraryGuitarWorldResponse } from '..'

const CATEGORY_COLORS: Record<string, string> = {
  弹唱吉他谱: '#22c55e',
  指弹吉他谱: '#3b82f6',
  独奏钢琴谱: '#a855f7'
}

function ScoreItem({
  entry,
  cookie
}: {
  entry: ScoreLibraryGuitarWorldResponse['data'][number]
  cookie: string
}) {
  const queryClient = useQueryClient()
  const socket = useSocketContext()

  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  )

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean | 'loading'>(
    false
  )

  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  async function toggleMusicPlay() {
    if (audioInstance !== null) {
      if (isAudioPlaying === true) {
        audioInstance.pause()
        setIsAudioPlaying(false)

        return
      }

      setIsAudioPlaying('loading')
      await audioInstance.play()
      setIsAudioPlaying(true)

      return
    }

    const audio = new Audio(entry.audioUrl)

    setAudioInstance(audio)
    setIsAudioPlaying('loading')
    await audio.play()
    setIsAudioPlaying(true)
  }

  async function downloadScore() {
    setIsDownloading(true)

    try {
      const taskId = await forgeAPI.guitarWorld.download.mutate({
        cookie,
        id: entry.id,
        name: entry.name,
        category: entry.category,
        mainArtist: entry.mainArtist,
        audioUrl: entry.audioUrl
      })

      socket.on(
        'taskPoolUpdate',
        (
          data: SocketEvent<ScoreLibraryGuitarWorldResponse['data'][number]>
        ) => {
          if (!data || data.taskId !== taskId) return

          if (data.status === 'failed') {
            toast.error(`Failed to download score: ${data.error}`)
            setIsDownloading(false)
          }

          if (data.status === 'completed') {
            toast.success('Score downloaded successfully')
            setIsDownloading(false)

            queryClient.invalidateQueries({
              queryKey: forgeAPI.key
            })
          }
        }
      )
    } catch {
      toast.error('Failed to download score')
      setIsDownloading(false)
    }
  }

  const categoryColor = CATEGORY_COLORS[entry.category] || '#6b7280'

  return (
    <WithDivide key={entry.id}>
      <Flex justify="between" p="md">
        <Flex direction="column">
          <Text size="lg" weight="medium">
            {entry.name}
            {entry.subtitle !== '' && (
              <Text as="span" color="muted" size="sm">
                {' '}
                ({entry.subtitle})
              </Text>
            )}
          </Text>
          <Flex align="center" gap="sm">
            <TagChip
              as="span"
              color={categoryColor}
              label={entry.category}
              mt="xs"
              size="sm"
            />
            <Flex align="center" mt="xs">
              <Icon color="muted" icon="tabler:user" mr="xs" size="1em" />
              <Text color="muted" size="sm">
                {entry.mainArtist}
              </Text>
            </Flex>
            <Flex align="center" mt="xs">
              <Icon color="muted" icon="tabler:upload" mr="xs" size="1em" />
              <Text color="muted" size="sm">
                {entry.uploader}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" gap="xs">
          <Button
            flexShrink="0"
            icon={isAudioPlaying === true ? 'tabler:pause' : 'tabler:play'}
            loading={isAudioPlaying === 'loading'}
            variant="plain"
            onClick={() => {
              toggleMusicPlay().catch(console.error)
            }}
          />
          <Button
            disabled={entry.existed}
            flexShrink="0"
            icon={entry.existed ? 'tabler:check' : 'tabler:download'}
            loading={isDownloading}
            variant="plain"
            onClick={() => {
              downloadScore().catch(console.error)
            }}
          />
        </Flex>
      </Flex>
    </WithDivide>
  )
}

export default ScoreItem
