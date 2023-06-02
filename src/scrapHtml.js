const puppeteer = require('puppeteer');
const {lerArquivoJson} = require('./jsonCrud')
const path = require('path');




function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}

async function scrapHtml() {
  const caminhoArquivo = path.resolve(__dirname,'..','config.json');

  const json = lerArquivoJson(caminhoArquivo);
  //console.log(json);

  const busca = json.negocio;
  const bairro = json.bairro;
  const cidade = json.cidade;
  const estado = json.estado

  const urlAlvo = `https://www.google.com.br/maps/search/${busca}+perto+de+${bairro}+${cidade}+${estado}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(urlAlvo);
  await page.waitForSelector('.hfpxzc');
  await page.focus('.hfpxzc');
  await page.keyboard.press('End');
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('End');
    await delay(1000);
  }
  let html = await page.content();
  await browser.close();

  return html;
}

module.exports = scrapHtml;
