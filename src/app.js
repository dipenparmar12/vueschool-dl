const browserObj = require('./browserObj')
const vueSchool = require('./vueSchool/scraper')
const { downloadCourses } = require('./vueSchool/downloadCourses')
const courses = require('../courses')

let browserInstance = browserObj.startBrowser()

const run = async () => {
  // await vueSchool.scrapeCourseJson(browserInstance)
  await vueSchool.login(browserInstance)
  await vueSchool.scrapeCourseMetaData(browserInstance, courses)
  await downloadCourses()
  process.exit()
}

module.exports = {
  run,
}
