const appRoot = require('app-root-path')
const browserObj = require('./browserObj')
const vueSchool = require('./vueSchool/pageScraper')
const courses = require('../courses')
const { download } = require('./utils/stream_download')

let browserInstance = browserObj.startBrowser()

const url =
  'https://vod-progressive.akamaized.net/exp=1651306827~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F354%2F10%2F251774866%2F915591203.mp4~hmac=06d3b46596d03b76f7465ad8d64aeebd20435e836d210d3182619d24cc688638/vimeo-prod-skyfire-std-us/01/354/10/251774866/915591203.mp4'

const run = async () => {
  // await vueSchool.scrapeAll(browserInstance, courses)

  download(url, `${appRoot}/test.mp4`, (res) => {
    console.log('app.js::[16] res', res)
  })
}

module.exports = {
  run,
}
