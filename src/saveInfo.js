const puppeteer = require('puppeteer');
const salvaCsv = require('./salvaCsv');


async function saveInfo(links) {
  const browser = await puppeteer.launch();
  for (let i = 0; i < links.length; i++) {
    const dados = [];
    const link = links[i];
    const page = await browser.newPage();
    await page.goto(link);
    await page.waitForSelector('.fontHeadlineLarge')
    try {
      const titulo = await page.evaluate(x => {
        return document.querySelector(x).innerText;
      }, '.fontHeadlineLarge');
      dados.push(titulo);
    } catch (error) {
      const titulo = 'Não possui!';
      dados.push(titulo)
    }
    try {
      const endereco = await page.evaluate(x => {
        return document.querySelector('button[data-item-id="address"]').children[0].children[1].innerText;
      });
      dados.push(endereco);
    } catch (error) {
      const endereco = 'Não possui!';
      dados.push(endereco)
    }
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
    await page.close();
  }
  await browser.close()
}

module.exports=saveInfo;
