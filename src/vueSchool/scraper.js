const fse = require('fs-extra')
const rootPath = require('app-root-path')
const { interception, screenshot } = require('../browserObj')
const logger = require('../utils/logger')
const { sensitize } = require('../utils/str')
const { downloadVideo } = require('./downloadVideo')

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

  // await screenshot(page, '2 redirect-profile')
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
  console.log(new Date(), 'loading browser...')
  try {
    browser = await browserInstance
    const page = await interception(await browser.newPage())
    page.setDefaultNavigationTimeout(0)

    console.log(new Date(), 'browser, Page loaded')

    let scrapedCourses = []
    for (const courseURL of courses) {
      const courseContent = await this.courseScraper(page, courseURL, browser)
      // logger.info(courseContent.title)

      await fse.outputFile(
        `${rootPath}/courses-json/${courseContent?.title}.json`,
        JSON.stringify(courseContent, null, 2)
      )
      // logger.info(courseContent)
      scrapedCourses.push(courseContent)
      logger.info(`Meta-Data Scraped:: ${courseContent?.title}`)
    }

    logger.info(`Meta-Data stored at: "./courses-json" `)

    await page.close()
    return scrapedCourses
  } catch (error) {
    console.log('Error:::', error)
    logger.error(`${error.toString()}`)
  }
}

module.exports.courseScraper = async function courseScraper(
  page,
  courseURL,
  browser
) {
  const quality = process.env.VIDEO_QUALITY || '360p'

  // await page.goto(courseURL, { waitUntil: 'networkidle0' })
  logger.info(`Navigating to ${courseURL}...`)
  await page.goto(courseURL)
  const courseTitle = await page.$eval('h1[title]', (h1) => h1?.textContent)

  const chapters = await page.$$eval('div.chapter', (_DivChapter) =>
    [..._DivChapter].map((_Chapter) => {
      const chapterTitle = _Chapter.querySelector('h2').textContent
      // return { title: 'test-title', videos: [] }
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
    title: sensitize(courseTitle),
    chapters: [],
  }

  for (const [chapterIdx, _chapter] of chapters?.entries()) {
    const chapter = {
      title: _chapter?.title,
      videos: [],
    }

    for (const [videoIdx, video] of _chapter?.videos?.entries()) {
      try {
        console.log(
          'Found video::',
          `Course-> ${courseTitle}, Vid: ${video?.title}`
        )

        const variants = await this.videoVariantsScrap(page, video?.src)

        // // Download video on by one
        await downloadVideo({
          videoUrl: variants?.find((item) => item?.quality === quality)?.url,
          courseTitle: courseTitle,
          chapterTitle: _chapter?.title,
          videoTitle: video?.title,
          chapterIdx,
          videoIdx,
          quality,
        })

        chapter.videos.push({
          title: video?.title,
          src: video?.src,
          variants: variants,
        })
      } catch (err) {
        console.log('Error:::', video?.title, err)
        logger.error(`Course-> ${courseTitle} -> ${video?.title}`)
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

module.exports.videoVariantsScrap = async (page, _url, info) => {
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
  } catch (error) {
    console.log('scraper.js::[191] error::', error, _url)
  }
  return videoVariants
}
