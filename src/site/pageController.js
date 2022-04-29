const logger = require('../../src_bk/utils/logger')
const pageScraper = require('./pageScraper')

async function scrapeAll(browserInstance) {
  let browser
  console.log('pageController.js::[5] loading browser...')
  try {
    browser = await browserInstance
    console.log('pageController.js::[5] browser loaded')
    await pageScraper.scraper(browser)
  } catch (error) {
    logger.error(error)
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)
