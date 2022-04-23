const puppeteer = require('puppeteer')
const appRoot = require('app-root-path');
const isDirExitsOrCreate = require('./utils/isDirExitsOrCreate');

module.exports.test = async () =>{
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const filepath = isDirExitsOrCreate(`${appRoot}/src/temp`)

  await page.goto('https://example.com');
  await page.screenshot({ path: `${filepath}/example.png`  });
  await browser.close();
}

module.exports.launch = async ()=>{
    const browser =  await puppeteer.launch({ headless: true });
    // await delay(500);
    return browser
}

module.exports.page = async (browser)=>{
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  return page
}

module.exports.screenshot = async (page, name = `page` )=>{
  return page // TODO:::REMOVE 
  if(process.env.SCREENSHOTS){
    const filepath = isDirExitsOrCreate(`${appRoot}/src/screenshots`)
    await page.screenshot({ path: `${filepath}/${name}.png`  });
  }
  return page
}