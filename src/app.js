
const browser = require('./browser');
const website = require('./website');
const logger = require('./utils/logger');
const delay = require('delay');


const run = async ()=> {
  console.log('index.js::[6] Application running......')

  const instance = await browser.launch()
  const page = await browser.page(instance)
  await website.login(page)

  // await delay(500)
  // await instance.close()

  console.log('index.js::[21] Application Closed...' )
}


module.exports = {
  run
}