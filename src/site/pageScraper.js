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

    const pagePromise = (link) =>
      new Promise(async (resolve, reject) => {
        let data = {}
        await page.goto(link)

        data['title'] = await page.$eval(
          '.product_main > h1',
          (h1) => h1.textContent
        )

        data['price'] = await page.$eval('.price_color', (p) => p.textContent)

        data['available'] = await page.$eval('.instock.availability', (p) => {
          const text = p.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, '') // remove tab, new_line
          let stockAvailable = /^.*\((.*)\).*$/i.exec(text)[1].split(' ')[0] // get data between brackets i.e: In stock (22 available) -> [22, available]
          return stockAvailable
        })

        data['imageUrl'] = await page.$eval(
          '#product_gallery img',
          (img) => img.src
        )

        data['description'] = await page.$eval(
          '#product_description',
          (div) => div.nextSibling.nextSibling.textContent
        )

        data['upc'] = await page.$eval(
          '.table.table-striped > tbody > tr > td',
          (table) => table.textContent
        )

        resolve(data)
        console.log('pageScraper.js::[37] data', data)
      })

    // logger.info(urls)

    for (link of urls) {
      let currentPageData = await pagePromise(link)
      logger.info(currentPageData)
    }

    logger.info(':: Scrap completed.....')
    await page.close()
  },
}

module.exports = scraperObject
