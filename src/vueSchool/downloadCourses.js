const { readJson } = require('fs-extra')
const rootPath = require('app-root-path')
const fileSystem = require('../utils/fileSystem')
const logger = require('../utils/logger')
const request = require('../utils/request')
const str = require('../utils/str')

module.exports.downloadCourses = async function () {
  try {
    const courseDir = `${rootPath}\\courses-json`
    const courses = await fileSystem.getFiles(courseDir)

    // Courses loop
    for (const file of courses) {
      let index = 1
      const course = await readJson(`${courseDir}/${file}`) // [ title, chapters[] ]
      if (!course) {
        continue
      }

      let cIdx = 1
      // Courses have many Chapters (1:M), [ title, videos[Obj] ]
      for (const chapter of course.chapters) {
        let vId = 1
        // Chapter has many videos (1:M), [ title, src, variants[{url,quality}] ]
        for (const vidObj of chapter.videos) {
          const quality = process.env.VIDEO_QUALITY || '360p'

          // Get user specified quality. (.env->VIDEO_QUALITY)
          const videoUrl = vidObj?.variants?.find((info) => {
            return info?.quality === quality
          })?.url

          // // downloads/course-title/chapter/video-title-[quality].mp3

          try {
            console.log(`Downloading......${cIdx}.${vId} ${vidObj?.title}`)
            const downloadPath = `${rootPath}/downloads/${course?.title}/${cIdx}-${chapter?.title}`
            const fileName = str.sensitize(vidObj?.title)

            await fileSystem.isDirExitsOrCreate(downloadPath)
            await request.download_stream(
              videoUrl,
              `${downloadPath}/${cIdx}.${vId} ${fileName}-${quality}.mp4`
            )

            logger.info(
              `downloaded: ${cIdx}.${vId} ${vidObj?.title} Quality:${quality}`
            )

            index++
          } catch (error) {
            logger.error(
              `${error.toString()} Course:: ${
                course?.title
              }  Vid:: ${cIdx}.${vId} ${vidObj?.title}`
            )
            console.log(error, ` Vid:: ${cIdx}.${vId} ${vidObj?.title}`)
          }

          vId++
        }

        cIdx++
      }
    }

    logger.info('Process Completed.......')
  } catch (error) {
    console.log('downloadCourses.js::[36] error', error) //  error.toString()
    logger.error(error.toString())
  }
}
