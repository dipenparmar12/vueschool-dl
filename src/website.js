const delay = require('delay');
const { screenshot } = require('./browser');
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
  try {

    const email =  process.env.EMAIL
    const password = process.env.PASSWORD
    console.log('Login using EMAIL.....', email)


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
  
  } catch (error) {
    console.log('website.js::[28] Login...Something went wrong...', error) 
  }
}