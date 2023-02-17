const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const salvaCsv = require('./salvaCsv');
const { Cluster } = require('puppeteer-cluster');
// https://restaurantguru.com.br/ 

const busca = 'Restaurantes'
const urlAlvo = `https://www.google.com.br/maps/search/${busca}`;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}


// $x("//a[contains(@href, 'https://www.google.com.br/maps/place/')]") xpath com links de restaurantes
// $('button[class="CsEnBe"]').attributes  posso pegar o value dos atributos para distinguir qual e qual

async function scrapHtml() {

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



async function main(links) {
  const browser = await puppeteer.launch();
  for (let i = 0; i < links.length; i++) {
    const dados = [];
    const link = links[i];
    const page = await browser.newPage();
    await page.goto(link);
    await page.waitForSelector('.fontHeadlineLarge')


    // titulo

    try {
      const titulo = await page.evaluate(x => {
        return document.querySelector(x).innerText;
      }, '.fontHeadlineLarge');
      dados.push(titulo);
    } catch (error) {
      const titulo = 'Não possui!';
      dados.push(titulo)
    }


    // endereco
    try {
      const endereco = await page.evaluate(x => {
        return document.querySelector('button[data-item-id="address"]').children[0].children[1].innerText;
      });
      dados.push(endereco);
    } catch (error) {
      const endereco = 'Não possui!';
      dados.push(endereco)
    }



    // telefone
    try {
      const telefone = await page.evaluate(x => {
        return document.querySelector('button[data-tooltip="Copiar número de telefone"]').children[0].children[1].innerText;
      });
      dados.push(telefone);
    } catch (error) {
      const telefone = 'Não possui!';
      dados.push(telefone)
    }

    let [titulo, endereco, telefone] = dados;


    const csvString = `${titulo.replace(/,/g, '')};${endereco.replace(/,/g, '')};${telefone.replace(/,/g, '')}\n`
    salvaCsv(csvString);
    // append dados in csv file
    await page.close();
    
  }
  await browser.close()

}



async function scraping(){
  const links = await raspaLinks();
  await main(links);
}

scraping();


// async function scraping(){
//   for (let i = 0; i < 10; i++) {
//     const link = links[i];
//     main(link);
//   }
// }



// scraping()
