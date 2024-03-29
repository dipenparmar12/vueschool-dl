### CAUTION: This script was a weekend project created solely for entertainment purposes, with no intention to alter videos or engage in any illegal activities related to Vue School content. Usage of downloaded videos is strictly prohibited. Please note that future regular updates should not be expected. For viewing, please visit the official site at vue-school.io!

### Vue School downloader 

## HOW TO USE:
1. clone this repository `git clone git@github.com:dipenparmar12/vueschool-dl.git`
2. `cd vueschool-dl` && `yarn install`
3. Change variables in `.env.example` & rename it `.env` 
4. add/uncomment URL's of course you want to download to `courses.js` list array
5. `yarn download` or `npm run download` 
   

### TODO 

- [x] Simple Documentation.
- [ ] Download ETA or Process bar,
- [ ] Use direct Login using **Cookie** file to access video files.
- [ ] CLI Option to Overwrite existing downloaded videos.
- [ ] Force download courses-json data or skip if exits.

### MISC

1. `Tutorial` https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer#step-6-mdash-scraping-data-from-multiple-categories-and-saving-the-data-as-json
2. `Eslint & Prettier` 
   1. https://blog.bitsrc.io/how-to-set-up-node-js-application-with-eslint-and-prettier-b1b7994db69f
   2. https://dev.to/siddiqus/nodejs-eslint-prettier-simplest-setup-ever-1p7j
3. `Request interceptor`: https://www.scrapehero.com/how-to-increase-web-scraping-speed-using-puppeteer/
4. `String Start/End regex`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions
5. `Download file streams`: https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
6. `String to slug`: https://gist.github.com/codeguy/6684588?permalink_comment_id=3243980#gistcomment-3243980
