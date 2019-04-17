const puppeteer = require('puppeteer');
const request = require('request-promise');
const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const wait = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const loop = async pages => {
  tabsCount = pages.length - 1;
  let index = 0;
  while (true) {
    await pages[index].bringToFront();
    await wait(10000);
    index = index === tabsCount ? 0 : (index += 1);
  }
};

const run = async () => {
  const response = await request({
    uri: 'http://localhost:9222/json/version',
    json: true
  });
  const browser = await puppeteer.connect({
    browserWSEndpoint: response.webSocketDebuggerUrl,
    defaultViewport: null
  });

  const urls = await readFile('./urls.txt', 'utf-8');

  await asyncForEach(urls.split('\n'), async url => {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
  });

  const pages = await browser.pages();
  pages.shift();

  await loop(pages);
};

run();
