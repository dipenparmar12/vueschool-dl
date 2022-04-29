const appRoot = require('app-root-path')
const browserObject = require('./browser')
const scraperController = require('./site/pageController')

let browserInstance = browserObject.startBrowser()

const run = async () => {
  await scraperController(browserInstance)
}

module.exports = {
  run,
}
