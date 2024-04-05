const { chromium } = require('playwright');
const fs = require('fs');

// Your search term must be specific to get results
const searchTerm = 'Dans Cafe Adams Morgan';

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

  const selectorMoreBtn = ".review-more-link:visible";
  // Uncomment the line below and run the application
  // await page.pause()

  // Inspect HTML in browser to find replacement values for the following
  const reviewDialogScrollClass = 'review-dialog-list';
  const xpathAllReviews = '//div[@jscontroller="fIQYlf"]';  // Adjust here 
  const xpathTitle = "//div[@class='TSUbDb']/a";            // Adjust here 
  const xpathReviews = '//span[@jscontroller="MZnM8e"]';    // Adjust here 

  await page.waitForTimeout(2500);

 
  await scrollToBottom(page, reviewDialogScrollClass)
  await page.waitForTimeout(1000);
  

  const allReviews = await page.locator(xpathAllReviews);
  const allReviewsCount = await allReviews.count();

  for (var index = 0; index < allReviewsCount; index += 1) {
    const element = await allReviews.nth(index);
    const moreBtns = await element.locator(selectorMoreBtn).all()

    if (moreBtns.length > 0) {
      for await (const moreBtn of moreBtns) {
        await moreBtn.click();
      }
    }

    const review = await element.locator(xpathReviews).first().innerText();

    const title = await element.locator(xpathTitle).innerText();

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

  fs.writeFile(`googreviews/googreview-${searchNameFormatted}.json`, dataStr, 'utf8', (error) => {
    if (error) {
      console.log("Nope. Your file didn't save. Here's the error:");
      return console.log(error);
    }

    console.log("Congratulations! Your googreview is saved in the googreview folder.");
  });
}

async function scrollToBottom(page, elementSelector, numScrolls = 30) {
  await page.evaluate(async (args) => {
    const element = document.getElementsByClassName(args.className)[0];
    for (let i = 0; i < args.scrollCount; i++) {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
      element.scrollTo(0, element.scrollHeight);
      await delay(250);
    }
  }, {className: elementSelector, scrollCount: numScrolls});
}

scrape();
