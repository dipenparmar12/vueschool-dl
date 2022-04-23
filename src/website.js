const cliProgress = require('cli-progress');
const delay = require('delay');
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

  console.log("Login success!");

}



module.exports.getAllCourses = async (browserInstance, courseURL = 'https://vueschool.io/courses') => {
  const page = await browserInstance.newPage();
  await page.goto(courseURL, { waitUntil: 'networkidle0' }); // wait until page load
  await delay(500)

  const courses = await page.evaluate(
    () => Array.from(document.querySelectorAll("h3"))
      .map(h3 => {
        return {
          href: h3.closest("a").href,
          title: h3?.textContent?.replaceAll('\n', '')
        }
      })
  );

  return courses
}

module.exports.getVideoList = async (browser, courseURL) => {
  const page = await browser.page(instance)
  await page.goto(courseURL, { waitUntil: 'networkidle0' }); // wait until page load
  await delay(1000)

  const courseTitle = await page.evaluate(
    () => document.querySelector("h1[title]").textContent
  );

  console.log('website.js::[60]', `Fetching ${courseTitle} course videos links.`)
  // const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const videos = await page.evaluate(() => {
    let chaptersN = Array.from(document.querySelectorAll('div.chapter'))
    const chapterTitles = chaptersN.map(el => el.querySelector('h2').innerHTML)
    chaptersN = chaptersN.map(el => Array.from(el.querySelectorAll("a[class='title']")))
    // return chaptersN[0][0].href || chaptersN[0][0].innerHTML;
    return chaptersN.map((links, index) => {
      return {
        chapter: chapterTitles[index],
        videos: links.map(el => ({
          href: el.href,
          title: el.innerHTML,
        }))
      }
    })
  })

  return {
    course: courseTitle,
    chapters: videos
  }

}