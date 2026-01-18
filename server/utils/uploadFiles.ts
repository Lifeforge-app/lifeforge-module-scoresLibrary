import fs from 'fs'
// @ts-expect-error - No types available
import pdfPageCounter from 'pdf-page-counter'
import pdfThumbnail from 'pdf-thumbnail'
import { Server } from 'socket.io'

let left = 0

export function setLeft(value: number) {
  left = value
}

export const processFiles = async (
  pb: any,
  groups: Record<
    string,
    {
      pdf: any | null
      mscz: any | null
      mp3: any | null
    }
  >,
  io: Server,
  taskId: string,
  tasks: any
) => {
  for (let groupIdx = 0; groupIdx < Object.keys(groups).length; groupIdx++) {
    try {
      const group = groups[Object.keys(groups)[groupIdx]]

      const file = group.pdf!

      const decodedName = decodeURIComponent(file.originalname)

      const name = decodedName.split('.').slice(0, -1).join('.')

      const path = file.path

      const buffer = fs.readFileSync(path)

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

          const otherFiles: {
            audio: File | null
            musescore: File | null
          } = {
            audio: null,
            musescore: null
          }

          if (group.mscz) {
            otherFiles.musescore = new File(
              [fs.readFileSync(group.mscz.path)],
              group.mscz.originalname
            )
          }

          if (group.mp3) {
            otherFiles.audio = new File(
              [fs.readFileSync(group.mp3.path)],
              group.mp3.originalname
            )
          }

          await pb.create
            .collection('entries')
            .data({
              name,
              thumbnail: new File([thumbnailBuffer], `${decodedName}.jpeg`),
              author: '',
              pdf: new File([buffer], decodedName),
              pageCount: numpages,
              ...otherFiles
            })
            .execute()

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
