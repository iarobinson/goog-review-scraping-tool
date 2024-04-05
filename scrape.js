const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({
    headless: false
  });
  const searchTerm = 'Dans\'s cafe washinton DC';

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.google.com/');

  await page.getByRole('combobox', { name: 'Search' }).click();
  await page.getByRole('combobox', { name: 'Search' }).type(searchTerm);
  await page.getByRole('combobox', { name: 'Search' }).press('Enter');

  await page.locator('xpath=(//a[@data-async-trigger="reviewDialog"])[1]').click();

  let data = await extractData(page);
  saveData(data);

  await context.close();
  await browser.close();
}

async function extractData(page) {

  let dataToSave = [];

  const xpathAllReviews = '//div[@jscontroller="fIQYlf"]';
  const xpathMoreButton = "//a[@class='review-more-link']";
  const xpathTitle = "//div[@class='TSUbDb']/a";
  const xpathReviews = '//span[@jscontroller="MZnM8e"]';
  await page.waitForTimeout(2500);
  const allReviews = page.locator(xpathAllReviews);
  const allReviewsCount = await allReviews.count();
  
  for (var index= 0; index < allReviewsCount; index += 1) {
    const element = await allReviews.nth(index);
    const moreBtn = element.locator(xpathMoreButton)
    
    if(await moreBtn.count() > 0) {
      try {
        await moreBtn.click();
        await page.waitForTimeout(2500);
      }
      catch {}
    }

    const title = await element.locator(xpathTitle).innerText();
    const review = await element.locator(xpathReviews).first().innerText();

    let rawDataToSave = {
      "author_name": title,
      "review": review
    }

    console.log(dataToSave)
    dataToSave.push(rawDataToSave)
  }

  return dataToSave;
}

function saveData(data) {
  let dataStr = JSON.stringify(data, null, 2)
  fs.writeFile("google_reviews.json", dataStr, 'utf8', function (err) {
    if (err) {
        console.log("An error occurred while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
}

run();
