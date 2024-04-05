<pre>
   _____  _____ _____            _____  ______ 
  / ____|/ ____|  __ \     /\   |  __ \|  ____|
 | (___ | |    | |__) |   /  \  | |__) | |__   
  \___ \| |    |  _  /   / /\ \ |  ___/|  __|  
  ____) | |____| | \ \  / ____ \| |    | |____ 
 |_____/ \_____|_|  \_\/_/    \_\_|    |______|
                                               
</pre>

# goog-review-scraping-tool

Scrapes Google reviews and returns .json files.

Utilizing [Playwright](https://github.com/microsoft/playwright) for web scraping.

Big thanks to [ScrapeHero](https://www.scrapehero.com/scrape-google-reviews/) for most of the code.

## Setup

- `git clone https://github.com/iarobinson/goog-review-scraping-tool` - Clone Repository 
- `cd goog-review-scraping-tool` - Change directories into the folder 
- `npm i` - Install dependencies 
- Go to scrape.js and fill in the `searchTerm` string with your search
- `node scrape.js` - Run the application
- Fetch json from `googreviews` folder

## Not Working?

You need to customize the xpaths.

Instructions found in comments in scrape.js.
