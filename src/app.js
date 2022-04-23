
const puppeteer = require('puppeteer')
const appRoot = require('app-root-path');
const { writeJson } = require('fs-extra');
const browser = require('./browser');
const logger = require('./utils/logger');
const website = require('./website');
const isDirExitsOrCreate = require('./utils/isDirExitsOrCreate');

const test = async () => {
  // console.log('app.js::[8] var', var)
}


const run = async (_courses) => {
  // return test()
  console.log('index.js::[6] Application running......')
  const instance = await puppeteer.launch({ headless: true });
  // await website.login(instance)
  const allCourses = await website.getAllCourses(instance)
  writeJson(`${appRoot}/all-courses-list.json`, allCourses)

  // allCourses.forEach(async (courseURL, i) => {
  //   const page = await browser.page(instance)
  //   const courseVideos = await website.getVideoList(browser, courseURL)
  //   writeJson(`${path}/${courseVideos.course}.json`, courseVideos)
  //   // logger.info(courseVideos)
  //   page.close()
  // });
  // await instance.close()
}


module.exports = {
  run
}