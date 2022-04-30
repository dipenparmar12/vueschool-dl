const browserObj = require('./browserObj')
const vueSchool = require('./vueSchool/pageScraper')
const { downloadCourses } = require('./vueSchool/downloadCourses')
const courses = require('../courses')

let browserInstance = browserObj.startBrowser()

const run = async () => {
  // await vueSchool.scrapeAll(browserInstance, courses)
  await downloadCourses()
}

module.exports = {
  run,
}
