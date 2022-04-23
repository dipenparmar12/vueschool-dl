const { writeJson } = require('fs-extra');
const appRoot = require('app-root-path');
const browser = require('./browser');
const logger = require('./utils/logger');
const website = require('./website');
const isDirExitsOrCreate = require('./utils/isDirExitsOrCreate');


const test = async () => {
  // console.log('app.js::[8] var', var)
}


const run = async (courses) => {
  // return test()
  console.log('index.js::[6] Application running......')
  const instance = await browser.launch()
  // await website.login(page)

  courses.forEach(async (courseURL, i) => {
    const page = await browser.page(instance)
    const courseVideos = await website.getVideoList(page, courseURL)
    const path = isDirExitsOrCreate(`${appRoot}/course-videos/`)
    writeJson(`${path}/${courseVideos.course}.json`, courseVideos)
    // logger.info(courseVideos)
    page.close()
  });

  // await instance.close()
  // console.log('index.js::[21] Application Closed...')
}


module.exports = {
  run
}