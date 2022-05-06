const { readJson } = require('fs-extra')
const rootPath = require('app-root-path')
const fileSystem = require('../utils/fileSystem')
const logger = require('../utils/logger')
const request = require('../utils/request')
const str = require('../utils/str')

module.exports.downloadVideo = async function ({
  courseTitle,
  chapterTitle,
  videoTitle,
  chapterIdx,
  videoIdx,
  videoUrl,
  quality = '',
}) {
  try {
    // // downloads/course-title/chapter/video-title-[quality].mp3
    try {
      console.log(`Downloading.... ${chapterIdx}.${videoIdx} ${videoTitle}`)
      const downloadPath = `${rootPath}/downloads/${courseTitle}/${chapterIdx}-${chapterTitle}`
      const fileName = str.sensitize(videoTitle)

      await fileSystem.isDirExitsOrCreate(downloadPath)
      await request.download_stream(
        videoUrl,
        `${downloadPath}/${chapterIdx}.${videoIdx} ${fileName}-${quality}.mp4`
      )

      logger.info(
        `downloaded: ${chapterIdx}.${videoIdx} ${videoTitle} Quality:${quality}`
      )
    } catch (error) {
      console.log(
        'downloadVideo.js::[34]',
        error,
        courseTitle,
        chapterTitle,
        videoTitle,
        chapterIdx,
        videoIdx,
        videoUrl
      )
      logger.error(
        `${error.toString()} Course:: ${courseTitle}  Vid:: ${chapterIdx}.${videoIdx} ${videoTitle}`
      )
      console.log(error, ` Vid:: ${chapterIdx}.${videoIdx} ${videoTitle}`)
    }
  } catch (error) {
    console.log('downloadCourses.js::[36] error', error) //  error.toString()
    logger.error(error.toString())
  }
}
