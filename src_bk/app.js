
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
  // Create a new page
  const page = await instance.newPage();
  // Configure the navigation timeout
  page.setDefaultNavigationTimeout(0);


  // await website.login(page)

  // const courseList = await readJson(`${appRoot}/all-courses-list.json`)
  // const allCourses = await website.scrapAllCourses(page)
  const allCourses = _courses
  console.log('app.js::[26] var', allCourses)

  const courses = await allCourses.map(async (_course, i) => {
    try {
      // const courseVideos = await website.scrapCourseVideoList(page, _course?.src)
      // console.log('app.js::[29] course vid', courseVideos)

      // const chapters = await courseVideos.chapters.map(async _chapter => {
      //   const chapterVideos = _chapter.videos.map(async (vid, i) => {
      //     const videoVariantsRes = await website.scrapVideoVariants(page, vid.src)
      //     return {
      //       ...vid,
      //       variants: videoVariantsRes,
      //     }
      //   })
      //   const chapterResolved = await Promise.all(chapterVideos).then(res => res)
      //   return {
      //     ..._chapter,
      //     videos: chapterResolved
      //   }
      // })

      // const chaptersResolved = await Promise.all(chapters).then(res => res)
      // const course = { ..._course, chapters: chaptersResolved }
      // await writeJson(`${appRoot}/course-videos/${courseVideos?.course}.json`, course)

      // return course

    } catch (error) {
      console.log('app.js::[54] error', error)
      logger.error(error)
      throw error
    }
  });

  const test = await Promise.all(courses).then(res => res)
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