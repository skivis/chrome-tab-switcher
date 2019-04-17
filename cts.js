const puppeteer = require('puppeteer');
const request = require('request-promise');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const wait = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const loop = async (pages, sleep) => {
  tabsCount = pages.length - 1;
  let index = 0;
  while (true) {
    await pages[index].bringToFront();
    await wait(sleep);
    index = index === tabsCount ? 0 : (index += 1);
  }
};

const run = async (file, sleep) => {
  const response = await request({
    uri: 'http://localhost:9222/json/version',
    json: true
  });

  const browser = await puppeteer.connect({
    browserWSEndpoint: response.webSocketDebuggerUrl,
    defaultViewport: null
  });

  await asyncForEach(require(file), async url => {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
  });

  const pages = await browser.pages();
  pages.shift();

  await loop(pages, sleep);
};

(async () => {
  const {
    file = './urls.json',
    sleep = 10000
  } = require('minimist')(process.argv.slice(2))

  try {
    await run(file, sleep);
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
})();
