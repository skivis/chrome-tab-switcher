const puppeteer = require('puppeteer');
const request = require('request-promise');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

async function loop(pages, delay) {
  const tabsCount = pages.length - 1;
  let index = 0;

  delay = delay * 1000;

  setInterval(async () => {
    await pages[index].bringToFront();
    if (index === tabsCount) {
      index = 0;
    } else {
      index++
    }
  }, delay)
}

const run = async (file, delay) => {
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

  await loop(pages, delay);
};

(async () => {
  const {
    file = './urls.json',
    delay = 10
  } = require('minimist')(process.argv.slice(2))

  try {
    await run(file, delay);
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
})();
