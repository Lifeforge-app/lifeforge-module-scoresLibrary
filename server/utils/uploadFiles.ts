import fs from 'fs'
// @ts-expect-error - No types available
import pdfPageCounter from 'pdf-page-counter'
import pdfThumbnail from 'pdf-thumbnail'
import type { Server } from 'socket.io'

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { type BuiltModuleSchema } from '@lifeforge/drizzle'
import type { FileStorage, StagedFile } from '@lifeforge/file-storage'
import type { CoreContext } from '@lifeforge/server-utils'

import type { ScoresLibrarySchema } from '../forge'
import { scoreEntries } from '../schema.drizzle'

type ScoresDb = PostgresJsDatabase<BuiltModuleSchema<ScoresLibrarySchema>>

let left = 0

export function setLeft(value: number) {
  left = value
}

export const processFiles = async (
  db: ScoresDb,
  storage: FileStorage,
  groups: Record<
    string,
    {
      pdf: StagedFile | null
      mscz: StagedFile | null
      mp3: StagedFile | null
    }
  >,
  io: Server,
  taskId: string,
  tasks: CoreContext['tasks']
) => {
  for (let groupIdx = 0; groupIdx < Object.keys(groups).length; groupIdx++) {
    try {
      const group = groups[Object.keys(groups)[groupIdx]]

      const file = group.pdf!

      const decodedName = Buffer.from(
        file.originalName,
        'latin1'
      ).toString('utf-8')

      const name = decodedName.split('.').slice(0, -1).join('.')

      const buffer = await file.read()

      const thumbnail = await pdfThumbnail(buffer, {
        compress: {
          type: 'JPEG',
          quality: 70
        }
      })

      const { numpages } = await pdfPageCounter(buffer)

      thumbnail
        .pipe(fs.createWriteStream(`medium/${decodedName}.jpg`))
        .once('close', async () => {
          const thumbnailBuffer = fs.readFileSync(`medium/${decodedName}.jpg`)

          const pdfRef = await storage.save({ file })

          const thumbnailRef = await storage.save({
            file: {
              buffer: thumbnailBuffer,
              originalName: `${decodedName}.jpeg`,
              mimeType: 'image/jpeg'
            },
            thumbs: ['0x512']
          })

          const audioRef = group.mp3
            ? await storage.save({ file: group.mp3 })
            : null

          const musescoreRef = group.mscz
            ? await storage.save({ file: group.mscz })
            : null

          await db.insert(scoreEntries).values({
            name,
            author: '',
            page_count: String(numpages),
            pdf: pdfRef?.key ?? '',
            thumbnail: thumbnailRef?.key ?? '',
            audio: audioRef?.key ?? '',
            musescore: musescoreRef?.key ?? ''
          })

          fs.unlinkSync(`medium/${decodedName}.jpg`)

          if (!(tasks.global[taskId].progress instanceof Object)) {
            return
          }

          setLeft(left - 1)

          if (left === 0) {
            tasks.update(io, taskId, {
              status: 'completed'
            })
          } else {
            tasks.update(io, taskId, {
              status: 'running',
              progress: {
                left,
                total: Object.keys(groups).length
              }
            })
          }
        })
    } catch (err) {
      console.error('Error processing group:', err)
      tasks.update(io, taskId, {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Unknown error'
      })

      break
    }
  }
}
