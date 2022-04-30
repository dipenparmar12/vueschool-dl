const { readJson } = require('fs-extra')
const rootPath = require('app-root-path')
const fileSystem = require('../utils/fileSystem')
const logger = require('../utils/logger')
const request = require('../utils/request')
const str = require('../utils/str')

module.exports.downloadCourses = async function (_courses) {
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

      // Courses have many Chapters (1:M), [ title, videos[Obj] ]
      for (const chapter of course.chapters) {
        // Chapter has many videos (1:M), [ title, src, variants[{url,quality}] ]
        for (const vidObj of chapter.videos) {
          const quality = process.env.VIDEO_QUALITY || '360p'

          // Get user specified quality. (.env->VIDEO_QUALITY)
          const videoUrl = vidObj?.variants?.find((info) => {
            return info?.quality === quality
          })?.url

          // // downloads/course-title/chapter/video-title-[quality].mp3

          try {
            console.log(
              'downloadCourses.js::[30] Downloading......',
              vidObj?.title
            )
            const downloadPath = `${rootPath}/downloads/${course?.title}/${chapter?.title}`
            const fileName = str.sensitize(vidObj?.title)

            await fileSystem.isDirExitsOrCreate(downloadPath)
            await request.download_stream(
              videoUrl,
              `${downloadPath}/${fileName}-${quality}.mp4`
            )

            console.info('downloadCourses.js::[30] downloaded:', vidObj?.title)

            index++
          } catch (error) {
            console.log('downloadCourses.js::[49] error', error)
          }
        }
      }
    }
  } catch (error) {
    console.log('downloadCourses.js::[36] error', error) //  error.toString()
    logger.error(error.toString())
  }
}
