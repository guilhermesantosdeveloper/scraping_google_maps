const cheerio = require('cheerio');
const scrapHtml = require('./scrapHtml');


async function raspaLinks() {
  const links = [];
  const html = await scrapHtml()
  const $ = await cheerio.load(html);
  const tagAhref = $('.hfpxzc');
  tagAhref.each((i, e) => {
    link = $(e).attr('href');
    links.push(link);
  })
  return links;
}


module.exports=raspaLinks;
