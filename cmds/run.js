const util = require('util');
const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require('request-promise');
const { setIntervalAsync } = require('set-interval-async/dynamic');
const readFile = util.promisify(fs.readFile);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

async function loop(pages, delay) {
  const tabsCount = pages.length - 1;
  let index = 0;

  setIntervalAsync(async () => {
    await pages[index].bringToFront();
    if (index === tabsCount) {
      index = 0;
    } else {
      index++;
    }
  }, delay);
}

async function run(options = {}) {
  const file = options.file || './urls.json';
  const delay = (options.delay || 10) * 1000

  const response = await request({
    uri: 'http://localhost:9222/json/version',
    json: true
  });

  const browser = await puppeteer.connect({
    browserWSEndpoint: response.webSocketDebuggerUrl,
    defaultViewport: null
  });

  const data = await readFile(file, 'utf8');

  await asyncForEach(JSON.parse(data), async url => {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await wait(delay);
  });

  const pages = await browser.pages();
  pages.shift();

  await loop(pages, delay);
}

module.exports = async args => {
  try {
    await run({
      file: args.file || args.f,
      delay: args.delay || args.d
    });
  } catch (error) {
    console.error(error);
  }
};
