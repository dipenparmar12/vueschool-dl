const puppeteer = require('puppeteer')
const rootPath = require('app-root-path')
const { isDirExitsOrCreate } = require('./utils/fileSystem')
const logger = require('./utils/logger')
const headless = true

module.exports.startBrowser = async function startBrowser() {
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

module.exports.screenshot = async (page, name = `page`) => {
  // return page // TODO:::REMOVE
  if (process.env.SCREENSHOTS) {
    const filepath = await isDirExitsOrCreate(`${rootPath}/screenshots`)
    await page.screenshot({ path: `${filepath}/${name}.png` })
  }
  return page
}

/**
 *
 * @param {*} page
 * @param {*} resourceTypes
 * @returns Object page
 * @see https://www.scrapehero.com/how-to-increase-web-scraping-speed-using-puppeteer/
 */
module.exports.interception = async (
  page,
  resourceTypes = ['image', 'stylesheet', 'font']
) => {
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (resourceTypes.indexOf(request.resourceType()) !== -1) {
      request.abort()
    } else {
      request.continue()
    }
  })
  return page
}

// module.exports = {  startBrowser }
