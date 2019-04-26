const util = require('util');
const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require('request-promise');
const { setIntervalAsync } = require('set-interval-async/dynamic');
const readFile = util.promisify(fs.readFile);

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  const delay = (options.delay ? options.delay : 10) * 1000;
  const file = options.file ? options.file : './urls.json';

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
