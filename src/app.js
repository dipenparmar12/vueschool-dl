
const puppeteer = require('puppeteer')
const appRoot = require('app-root-path');
const { writeJsonSync, readJson, writeJson, readJsonSync } = require('fs-extra');
const browser = require('./browser');
const logger = require('./utils/logger');
const website = require('./website');
const isDirExitsOrCreate = require('./utils/isDirExitsOrCreate');
const getFilesOfDir = require('./utils/getFilesInDir');

const test = async () => {
  // console.log('app.js::[8] var', var)
  // const files = getFilesOfDir('course-videos')
  // console.log('app.js::[14] files', files)
}

async function wait(data = [], milliSecond = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliSecond, data);
  });
}

const run = async (_courses) => {
  // return test()

  const courseVideos = await readJsonSync('course-videos/test.json')
  const test = await courseVideos.chapters.map(course => wait(course))
  return console.log('app.js::[42] test', test)

  console.log('index.js::[6] Application running......')
  const instance = await puppeteer.launch({ headless: true });
  // await website.login(instance)

  const allCourses = await readJson(`${appRoot}/all-courses-list.json`)
  // const allCourses = await website.scrapAllCourses(instance)
  // writeJson(`${appRoot}/all-courses-list.json`, allCourses)
  // logger.info(allCourses)

  const courses = await allCourses.map(async (course, i) => {
    // const courseVideos = await website.scrapCourseVideoList(instance, course?.src)

    // const data = await courseVideos.chapters.map(course => {
    //   course.videos.map((vid, i) => {
    //     return website
    //       .scrapVideoVariants(instance, vid.src)
    //       .then(res => {
    //         console.log('app.js::[39] res', res)
    //       })
    //     return {
    //       ...vid,
    //       test: vid.i + vid.title,
    //     }
    //   })
    //   return course
    // })

    // const chapterVideosWithVariants = await courseVideos?.chapters.map(async chapter =>
    //   await chapter?.videos.map(async video => {
    //     console.log('app.js::[35] video', video)
    //     const videoVariants = await website.scrapVideoVariants(instance, video?.src)
    //     return Object.assign(video, { videoVariants })
    //   }))
    // console.log('app.js::[43]', chapterVideosWithVariants)

    await writeJson(`${appRoot}/course-videos/${courseVideos?.course}.json`, courseVideos)
  });

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