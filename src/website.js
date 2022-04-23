const delay = require('delay')
const logger = require('./utils/logger')


const escapeXpathString = str => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

const clickByText = async (page, text) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
  
  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};


module.exports.login = async (page) => {
  const loginUrl = process.env.LOGIN_URL
  const email =  process.env.EMAIL
  const password = process.env.PASSWORD
  console.log('Login begin URL.....', loginUrl)
  console.log('Login EMAIL.....', email)
  
  // try {


    await page.goto('https://vueschool.io/login', { waitUntil: 'networkidle0' }); // wait until page load
    await page.type("input[type='text']", email);
    await page.type("input[type='password']", password);
    await page.screenshot({ path: `page.png`  });

    // click and wait for navigation
    await Promise.all([
      page.click(`button.btn[tabindex="3"]`),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await page.waitForNavigation(); // <------------------------- Wait for Navigation
    console.log('New Page URL:', page.url());

    // page.goto("https://vueschool.io/", { waitUntil: "domcontentloaded" });
    // await page.waitForSelector(`a[href="https://vueschool.io/login"]`);

    // await clickByText(page, `Login`);
    // await page.waitForNavigation({waitUntil: 'load'});
    // // console.log("Current page:", page.url());

    // page.focus(`input[type='text']`)
    // page.keyboard.type(email)
    // page.focus(`input[type='password']`)
    // page.keyboard.type(password)
    // await page.click('button[tabindex="3"]');
    // await delay(5000);
    // // await clickByText(page, `Login`);
    // page.goto(`https://vueschool.io/profile/subscription`, { waitUntil: "domcontentloaded" });

    // await page.waitForNavigation({'waitUntil': 'networkidle0'});
    // await page.waitForSelector('img[alt="Avatar"]', { visible: true, timeout: 0 });
    // await page.waitForSelector(`a[href="/profile"]`, { visible: true, timeout: 10000 });
    // const content = await page.content()
    // logger.htmlLog.info(content)
    // logger.info(page.url())
    // console.log("Login success!");
  
  // } catch (error) {
  //   console.log('website.js::[28] Login...Something went wrong...', error) 
  // }
}