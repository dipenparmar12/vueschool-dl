const logger = require('../../src_bk/utils/logger')

const scraperObject = {
  url: 'http://books.toscrape.com',
  async scraper(browser) {
    let page = await browser.newPage()
    logger.info(`Navigating to ${this.url}...`)
    await page.goto(this.url)
    await page.waitForSelector('.page_inner')

    let urls = await page.$$eval('section ol > li', (links) => {
      links = links.filter(
        (link) =>
          link.querySelector('.instock.availability > i').textContent !==
          'In stock'
      )
      // Extract the links from the data
      links = links.map((el) => el.querySelector('h3 > a').href)
      return links
    })

    logger.info(urls)
  },
}

module.exports = scraperObject
