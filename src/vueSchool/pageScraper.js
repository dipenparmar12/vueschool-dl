const fse = require('fs-extra')
const rootPath = require('app-root-path')
const { interception, screenshot } = require('../browserObj')
const logger = require('../utils/logger')

module.exports.login = async (browserInstance) => {
  const email = process.env.EMAIL
  const password = process.env.PASSWORD
  console.log('Login using EMAIL.....', email)
  const browser = await browserInstance
  const page = await browser.newPage()
  await page.goto('https://vueschool.io/login', { waitUntil: 'networkidle0' }) // wait until page load
  await page.type('input[type=text]', email)
  await page.type('input[type=password]', password)
  // await screenshot(page, '1 LoginPage')

  // // click and wait for navigation
  await Promise.all([
    page.click(`button.btn[tabindex]`),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ])

  await screenshot(page, '2 redirect-profile')
  await page.close()
  console.log('Login success!')
}

module.exports.scrapeCourseJson = async (
  browserInstance,
  courseURL = 'https://vueschool.io/courses'
) => {
  let browser = await browserInstance
  const page = await interception(await browser.newPage())
  page.setDefaultNavigationTimeout(0)

  // Navigate to some website e.g Our Code World
  await page.goto(courseURL, { waitUntil: 'networkidle0' })

  const allCourses = await page.evaluate(() =>
    [...document.querySelectorAll('h3')].map((h3) => {
      return {
        src: h3.closest('a').href,
        title: h3?.textContent?.replaceAll('\n', ''),
        test: h3?.querySelector('div.inline-block')?.innerText,
      }
    })
  )

  // const allCourses = await page.$$eval('h3', (_h3s) => {
  //   return [..._h3s].map((h3) => {
  //     return {
  //       src: h3.closest('a').href,
  //       title: h3?.textContent?.replaceAll('\n', ''),
  //       courseType: h3?.querySelector('div.inline-block')?.innerText || '',
  //     }
  //   })
  // })

  console.log('pageScraper.js::[57] ', allCourses[1])

  await fse.outputFile(
    `${rootPath}/all-courses-list.json`,
    JSON.stringify(allCourses, null, 2)
  )

  // await fse.writeJson(`${rootPath}/all-courses-list.json`, allCourses)
  await page.close()
  return allCourses
}

module.exports.scrapeCourseMetaData = async function (
  browserInstance,
  courses
) {
  let browser
  console.log('pageController.js::[5] loading browser...')
  try {
    browser = await browserInstance
    const page = await interception(await browser.newPage())
    page.setDefaultNavigationTimeout(0)

    console.log('pageController.js::[5] browser, Page loaded')

    let scrapedCourses = []
    for (const courseURL of courses) {
      const courseContent = await this.courseScraper(page, courseURL, browser)
      await fse.outputFile(
        `${rootPath}/courses-json/${courseContent?.title}.json`,
        JSON.stringify(courseContent, null, 2)
      )
      // logger.info(courseContent)
      scrapedCourses.push(courseContent)

      console.log(
        `pageScraper.js::[22] Meta-Data Scraped::${courseContent?.title}`
      )
    }

    console.log(
      `pageScraper.js::[27] Meta-Data stored at: "root/courses-json" `
    )

    await page.close()
    return scrapedCourses
  } catch (error) {
    console.log('pageScraper.js::[63] error', error)
    logger.error(error.toString())
  }
}

module.exports.courseScraper = async function courseScraper(
  page,
  courseURL,
  browser
) {
  // await page.goto(courseURL, { waitUntil: 'networkidle0' })
  console.log(`pageScraper.js::[33]  Navigating to ${courseURL}...`)
  await page.goto(courseURL)
  const courseTitle = await page.$eval('h1[title]', (h1) => h1?.textContent)

  const chapters = await page.$$eval('div.chapter', (_DivChapter) =>
    [..._DivChapter].map((_Chapter) => {
      const chapterTitle = _Chapter.querySelector('h2').innerHTML
      const videos = [..._Chapter.querySelectorAll("a[class='title']")].map(
        (_Video) => {
          return {
            title: _Video.innerHTML,
            src: _Video.href,
          }
        }
      )

      return {
        title: chapterTitle,
        videos: videos,
      }
    })
  )

  const courseJson = {
    title: courseTitle,
    chapters: [],
  }

  for (const [idx, _chapter] of chapters?.entries()) {
    const chapter = {
      title: _chapter?.title,
      videos: [],
    }

    for (const video of _chapter?.videos) {
      try {
        console.log('pageScraper.js::[69] video::', video?.title)
        const variants = await this.videoVariantsScrap(page, video?.src)
        chapter.videos.push({
          title: video?.title,
          src: video?.src,
          variants: variants,
        })
      } catch (err) {
        chapter.videos.push({
          title: video?.title,
          src: video?.src,
          err: err,
          variants: null,
        })
      }
    }

    courseJson.chapters.push(chapter)
  }

  // logger.info(courseJson)
  return courseJson
}

module.exports.videoVariantsScrap = async (page, _url) => {
  await page.goto(_url, { waitUntil: ['networkidle0', 'domcontentloaded'] }) // wait until page load
  // await page.waitForSelector("iframe", { timeout: 5000 });
  // await delay(200)

  const elementHandle = await page.$('iframe[src]')
  let iFrameContent = await elementHandle.contentFrame()
  const content = await iFrameContent.content()
  // logger.info(content)

  let videoVariants = []
  try {
    let startJson = content?.split(`progressive":[`)?.[1] // Start-String
    let endJson = startJson?.split(']},"lang":"en","sentry":')?.[0] // End-String
    videoVariants = await eval(`[${endJson}]`) // splitted json in content(html) string
  } catch (error) {}
  return videoVariants
}
