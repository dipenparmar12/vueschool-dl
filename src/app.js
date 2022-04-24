
const puppeteer = require('puppeteer')
const appRoot = require('app-root-path');
const { writeJsonSync, readJson, writeJson, readJsonSync } = require('fs-extra');
const browser = require('./browser');
const logger = require('./utils/logger');
const website = require('./website');
const isDirExitsOrCreate = require('./utils/isDirExitsOrCreate');
const getFilesOfDir = require('./utils/getFilesInDir');

const run = async (_courses) => {
  // return test()
  console.log('index.js::[6] Application running......')
  const instance = await puppeteer.launch({ headless: true });
  // await website.login(instance)

  // const allCourses = await readJson(`${appRoot}/all-courses-list.json`)
  const allCourses = await website.scrapAllCourses(instance)

  const courses = await allCourses.map(async (_course, i) => {
    const courseVideos = await website.scrapCourseVideoList(instance, _course?.src)
    const chapters = await courseVideos.chapters.map(async _chapter => {
      const chapterVideos = _chapter.videos.map(async (vid, i) => {
        const videoVariantsRes = await website.scrapVideoVariants(instance, vid.src)
        return {
          ...vid,
          variants: videoVariantsRes,
        }
      })
      const chapterResolved = await Promise.all(chapterVideos).then(res => res)
      return {
        ..._chapter,
        videos: chapterResolved
      }
    })

    const chaptersResolved = await Promise.all(chapters).then(res => res)
    const course = { ..._course, chapters: chaptersResolved }
    await writeJson(`${appRoot}/course-videos/${courseVideos?.course}.json`, course)

    return course

    // const chapterVideosWithVariants = await courseVideos?.chapters.map(async chapter =>
    //   await chapter?.videos.map(async video => {
    //     console.log('app.js::[35] video', video)
    //     const videoVariants = await website.scrapVideoVariants(instance, video?.src)
    //     return Object.assign(video, { videoVariants })
    //   }))
    // console.log('app.js::[43]', chapterVideosWithVariants)
    // await writeJson(`${appRoot}/course-videos/${courseVideos?.course}.json`, courseVideos)
  });

  const test = await Promise.all(courses).then(res => res)
  console.log('app.js::[54] test', test)
  return test

  // const courses = getFilesOfDir('course-videos')
  // const course = await readJson(`course-videos/${courses[1]}`)
  // const video = await website.video(instance)
  // writeJson(`${appRoot}/video.json`, video)
  // logger.htmlLog.info(video)
  // await instance.close()

}


module.exports = {
  run
}