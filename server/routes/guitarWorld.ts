import { inArray } from 'drizzle-orm'
import fs from 'fs'
import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import z from 'zod'

import forge from '../forge'
import { scoreEntries } from '../schema.drizzle'

const GuitarWorldTabSchema = z.object({
  id: z.number(),
  name: z.string(),
  subtitle: z.string(),
  category: z.string(),
  mainArtist: z.string(),
  uploader: z.string(),
  audioUrl: z.string(),
  existed: z.boolean()
})

export const list = forge
  .query({
    description: 'Get tabs from Guitar World',
    input: {
      query: z.object({
        cookie: z.string(),
        page: z.string().optional().default('1')
      })
    },
    output: {
      OK: z.object({
        data: z.array(GuitarWorldTabSchema),
        totalItems: z.number(),
        perPage: z.number()
      })
    }
  })
  .callback(async ({ db, query: { cookie, page }, response }) => {
    const parsedPage = parseInt(page ?? '1', 10) || 1

    const data: {
      data: {
        list: {
          qupu: {
            id: number
            name: string
            sub_title: string
            category_txt: string
            main_artist: string
            creator_name: string
            audio: string
          }
        }[]
        total: number
        page_size: number
      }
    } = await fetch(
      `https://user.guitarworld.com.cn/user/pu/my/pu_list?page=${parsedPage}`,
      {
        headers: {
          cookie
        }
      }
    )
      .then(res => res.json())
      .catch(() => ({
        data: {
          data: {
            list: []
          }
        }
      }))

    const finalData = {
      data: data.data.list
        .map(item => item.qupu)
        .map(item => ({
          id: item.id,
          name: item.name,
          subtitle: item.sub_title,
          category: item.category_txt,
          mainArtist: item.main_artist,
          uploader: item.creator_name,
          audioUrl: item.audio,
          existed: false
        })),
      totalItems: data.data.total,
      perPage: data.data.page_size
    }

    const allIds = finalData.data.map(item => item.id)

    const existingEntries = await db
      .select({ guitar_world_id: scoreEntries.guitar_world_id })
      .from(scoreEntries)
      .where(inArray(scoreEntries.guitar_world_id, allIds))

    for (const entry of existingEntries) {
      const index = finalData.data.findIndex(
        e => e.id === entry.guitar_world_id
      )

      if (index !== -1) {
        finalData.data[index].existed = true
      }
    }

    return response.ok(finalData)
  })

export const download = forge
  .mutation({
    description: 'Download tab from Guitar World',
    input: {
      body: z.object({
        cookie: z.string(),
        id: z.number(),
        name: z.string(),
        category: z.string(),
        mainArtist: z.string(),
        audioUrl: z.string()
      })
    },
    output: {
      OK: z.string()
    }
  })
  .callback(
    async ({
      db,
      body: { cookie, id, name, mainArtist, audioUrl },
      io,
      core: { tasks, storage },
      response
    }) => {
      if (!cookie) {
        return response.badRequest('Cookie is required')
      }

      const taskId = tasks.add(io, {
        module: 'scoresLibrary',
        description: `Downloading tab ${name} (${id}) from Guitar World`,
        status: 'pending'
      })

      ;(async () => {
        try {
          tasks.update(io, taskId, {
            status: 'running',
            progress: 0
          })

          const rawHTML = await fetch(
            'https://user.guitarworld.com.cn/user/pu/my/' + id,
            {
              method: 'GET',
              headers: {
                cookie
              }
            }
          ).then(res => res.text())

          const picObject = JSON.parse(
            rawHTML.match(/window\.(?:picList|picObj) = (.*?);/)?.[1] || '[]'
          )

          const pics = Array.isArray(picObject[0]) ? picObject[0] : picObject

          if (pics.length === 0) {
            tasks.update(io, taskId, {
              status: 'failed',
              error: 'No pictures found for this tab'
            })

            return
          }

          const folder = `./medium/${id}`

          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
          }

          for (let i = 0; i < pics.length; i++) {
            const arrayBuffer = await fetch(pics[i], {
              method: 'GET',
              headers: {
                cookie
              }
            }).then(res => res.arrayBuffer())

            fs.writeFileSync(
              `./medium/${id}/${i}.jpg`,
              Buffer.from(arrayBuffer)
            )
          }

          const doc = new PDFDocument({ autoFirstPage: false })

          const writeStream = fs.createWriteStream('./medium/' + id + '.pdf')

          doc.pipe(writeStream)

          const images = fs
            .readdirSync(folder)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(e => folder + '/' + e)

          for (const image of images) {
            const imageBuffer = await sharp(image).png().toBuffer()

            const { width, height } = await sharp(imageBuffer).metadata()

            doc.addPage({ size: [width!, height!] })
            doc.image(imageBuffer, 0, 0, { width, height })
          }

          doc.end()

          writeStream.on('finish', async () => {
            let audioBuffer = null

            if (audioUrl) {
              try {
                audioBuffer = await fetch(audioUrl).then(res =>
                  res.arrayBuffer()
                )
              } catch {
                // Failed to download audio
              }
            }

            if (!fs.existsSync(`./medium/${id}.pdf`)) {
              tasks.update(io, taskId, {
                status: 'failed',
                error: 'PDF file not found'
              })

              return
            }

            const pdfRef = await storage.save({
              file: {
                buffer: fs.readFileSync(`./medium/${id}.pdf`),
                originalName: `${id}.pdf`,
                mimeType: 'application/pdf'
              }
            })

            const thumbnailRef = await storage.save({
              file: {
                buffer: fs.readFileSync(`./medium/${id}/0.jpg`),
                originalName: `${id}.jpeg`,
                mimeType: 'image/jpeg'
              },
              thumbs: ['0x512']
            })

            const audioRef = audioBuffer
              ? await storage.save({
                  file: {
                    buffer: Buffer.from(audioBuffer),
                    originalName: `${id}.mp3`,
                    mimeType: 'audio/mpeg'
                  }
                })
              : null

            const [newEntry] = await db
              .insert(scoreEntries)
              .values({
                name,
                author: mainArtist,
                page_count: String(images.length),
                audio: audioRef?.key ?? '',
                pdf: pdfRef?.key ?? '',
                type: null,
                thumbnail: thumbnailRef?.key ?? '',
                guitar_world_id: id
              })
              .returning()

            fs.rmSync(folder, { recursive: true })
            fs.unlinkSync(`./medium/${id}.pdf`)

            tasks.update(io, taskId, {
              status: 'completed',
              data: newEntry
            })
          })
        } catch (error) {
          tasks.update(io, taskId, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })()

      return response.ok(taskId)
    }
  )
