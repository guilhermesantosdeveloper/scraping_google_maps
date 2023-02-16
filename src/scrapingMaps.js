const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fastCsv = require('fast-csv');
// https://restaurantguru.com.br/ 

const busca = 'Restaurantes'
const urlAlvo = `https://www.google.com.br/maps/search/${busca}`;

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}


// $x("//a[contains(@href, 'https://www.google.com.br/maps/place/')]") xpath com links de restaurantes
// $('button[class="CsEnBe"]').attributes  posso pegar o value dos atributos para distinguir qual e qual

async function scrapLinks(){
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  

  await page.goto(urlAlvo);
  //HlvSq
  await page.waitForSelector('.hfpxzc');
  await page.focus('.hfpxzc');
  await page.keyboard.press('End');

  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('End');
    await delay(1000); 
  }
  
  // page.setDefaultTimeout(5000)

  // while (true) {
  //   try {
  //     const acabo = await page.waitForSelector('.HlvSq');
  //     const strAcabo = String(acabo);
      
  //     if (strAcabo === 'CDPElementHandle {}') {
  //       break;
  //     }
  //   } catch (e) {
  //     if (e instanceof puppeteer.errors.TimeoutError) {
  //       await page.keyboard.press('End');
  //     } 
  //   }
  // }
  
  

  let html = await page.content();



  

  await browser.close();
  return html;
}



async function raspa(){
  const links = [];
  const html = await scrapLinks()

  const $ = await cheerio.load(html);
  
  const tagAhref = $('.hfpxzc');
  tagAhref.each((i,e)=>{
    link = $(e).attr('href');
    links.push(link);
  })
  await console.log(links);
  await console.log(links.length);
  return links;
}

raspa()
