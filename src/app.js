const appRoot = require('app-root-path')
const browserObj = require('./browserObj')
const vueSchool = require('./vueSchool/pageScraper')
const courses = require('../courses')

let browserInstance = browserObj.startBrowser()

const run = async () => {
  await vueSchool.scrapeAll(browserInstance, courses)
}

module.exports = {
  run,
}
