const puppeteer = require('puppeteer')
const logger = require('../src_bk/utils/logger')
const headless = true

async function startBrowser() {
  let browser
  try {
    console.log('browser.js::[7] Opening the browser......')
    browser = await puppeteer.launch({
      headless: headless,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    })
    return browser
  } catch (error) {
    logger.error(error)
    console.log('Could not create a browser instance => : ', error)
  }
}

module.exports = {
  startBrowser,
}
