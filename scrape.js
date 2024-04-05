const { chromium } = require('playwright');
const fs = require('fs');

// Your search term must be specific to get results
const searchTerm = 'smithsonian national museum of natural history';

async function scrape() {
  const browser = await chromium.launch({
    headless: false // comment out to run without browserload
  });

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

  let scrapedReviewData = [];

  const xpathMoreButton = "//a[@class='review-more-link']";
  // Uncomment the line below and run the application
  // await page.pause()

  // Inspect HTML in browser to find replacement values for the following
  const xpathAllReviews = '//div[@jscontroller="fIQYlf"]';  // Adjust here 
  const xpathTitle = "//div[@class='TSUbDb']/a";            // Adjust here 
  const xpathReviews = '//span[@jscontroller="MZnM8e"]';    // Adjust here 

  await page.waitForTimeout(2500);

  const allReviews = page.locator(xpathAllReviews);
  const allReviewsCount = await allReviews.count();

  for (var index = 0; index < allReviewsCount; index += 1) {
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
    console.log(rawDataToSave)

    scrapedReviewData.push(rawDataToSave)
  }

  return scrapedReviewData;
}

function saveData(data) {
  let dataStr = JSON.stringify(data, null, 2)
  let spececialCharacterRegEx = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  let searchNameFormatted = searchTerm.replace(spececialCharacterRegEx, '').replace(/\s/g, '-').toLowerCase();

  fs.writeFile(`googreviews/googreview-for-${searchNameFormatted}.json`, dataStr, 'utf8', (error) => {
    if (error) {
      console.log("Nope. Your file didn't save. Here's the error:");
      return console.log(error);
    }

    console.log("Congratulations! Your googreview is saved in the googreview folder.");
  });
}

scrape();
