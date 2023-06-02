const puppeteer = require('puppeteer');
const raspaLinks = require('./raspaLinks');


async function saveInfo(mainWindow) {
  const links = await raspaLinks();
  const browser = await puppeteer.launch();
  let arr = [];
  for (let i = 0; i < links.length; i++) {
    const dados = {nome:'',endereco:'',telefone:''};
    const link = links[i];
    const page = await browser.newPage();
    await page.goto(link);
    await page.waitForSelector('.fontHeadlineLarge')
    try {
      const titulo = await page.evaluate(x => {
        return document.querySelector(x).innerText;
      }, '.fontHeadlineLarge');
      dados.nome = titulo;
    } catch (error) {
      //console.log(error);
      const titulo = '';
      dados.nome = titulo;
    }
    try {
      const endereco = await page.evaluate(x => {
        return document.querySelector('button[data-item-id="address"]').innerText;
      });
      dados.endereco = endereco;
    } catch (error) {
      //console.log(error);
      const endereco = '';
      dados.endereco = endereco;
    }
    try {
      const telefone = await page.evaluate(x => {
        return document.querySelector('button[data-tooltip="Copiar número de telefone"]').innerText;
      });
      dados.telefone = telefone;
    } catch (error) {
      //console.log(error);
      const telefone = '';
      dados.telefone = telefone;
    }
    arr.push(dados);
    mainWindow.send('restaurante', dados);
    
    await page.close();
  }
  await browser.close()
  console.log(arr);
  return arr
}



module.exports = saveInfo;
