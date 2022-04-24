const appRootPath = require('app-root-path');
const cliProgress = require('cli-progress');
const delay = require('delay');
const { writeJson } = require('fs-extra');
const { screenshot } = require('./browser');
const logger = require('./utils/logger')

module.exports.login = async (browserInstance) => {
  const email = process.env.EMAIL
  const password = process.env.PASSWORD
  console.log('Login using EMAIL.....', email)

  const page = await browserInstance.newPage();
  await page.goto('https://vueschool.io/login', { waitUntil: 'networkidle0' }); // wait until page load
  await page.type("input[type=text]", email);
  await page.type("input[type=password]", password);
  screenshot(page, '1 LoginPage')

  // // click and wait for navigation
  await Promise.all([
    page.click(`button.btn[tabindex]`),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
  ]);

  screenshot(page, '2 redirect-profile')
  await page.close()
  console.log("Login success!");
}

module.exports.scrapAllCourses = async (browserInstance, courseURL = 'https://vueschool.io/courses') => {
  const page = await browserInstance.newPage();
  await page.goto(courseURL, { waitUntil: 'networkidle0' }); // wait until page load
  await delay(500)

  const allCourses = await page.evaluate(
    () => Array.from(document.querySelectorAll("h3"))
      .map(h3 => {
        return {
          src: h3.closest("a").href,
          title: h3?.textContent?.replaceAll('\n', '')
        }
      })
  );
  await page.close()
  writeJson(`${appRootPath}/all-courses-list.json`, allCourses)
  return allCourses
}

module.exports.scrapCourseVideoList = async (browserInstance, courseURL) => {
  try {
    const page = await browserInstance.newPage();
    await page.goto(courseURL, { waitUntil: 'networkidle0' }); // wait until page load
    await delay(500)
    const courseTitle = await page.evaluate(
      () => document.querySelector("h1[title]").textContent
    );

    console.log('website.js::[60]', `Fetching ${courseTitle} course videos links.`)
    // const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    const chapterVideos = await page.evaluate(() => {
      let chaptersN = Array.from(document.querySelectorAll('div.chapter'))
      const chapterTitles = chaptersN.map(el => el.querySelector('h2').innerHTML)
      chaptersN = chaptersN.map(el => Array.from(el.querySelectorAll("a[class='title']")))
      // return chaptersN[0][0].href || chaptersN[0][0].innerHTML;
      return chaptersN.map((links, index) => {
        const videos = links.map(el => ({ src: el.href, title: el.innerHTML }))
        return {
          chapter: chapterTitles[index],
          videos: videos
        }
      })
    })

    await page.close()

    return {
      course: courseTitle,
      chapters: chapterVideos,
    }

  } catch (error) {
    logger.error(error)
    throw error
  }
}

module.exports.scrapVideoVariants = async (browserInstance, pageUrl) => {
  try {

    let data = null
    const page = await browserInstance.newPage();
    await page.goto(pageUrl, { waitUntil: ["networkidle0", "domcontentloaded"] }); // wait until page load
    // await page.waitForSelector("iframe", { timeout: 5000 });
    await delay(500)

    const elementHandle = await page.$('iframe[src]');
    data = await elementHandle.contentFrame();

    const content = await data.content()
    let videoVariants = []

    let startJson = content?.split(`progressive":[`)?.[1]; // Start-String 
    let endJson = startJson?.split(']},"lang":"en","sentry":')?.[0]; // End-String
    videoVariants = await eval(`[${endJson}]`); // splitted json in content(html) string

    await page.close()
    return videoVariants
  } catch (error) {
    logger.error(error)
    throw error
  }
}