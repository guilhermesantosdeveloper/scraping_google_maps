const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const salvaCsv = require('./salvaCsv');
const { Cluster } = require('puppeteer-cluster');
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

async function scrapHtml(){
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  

  await page.goto(urlAlvo);
  //HlvSq
  await page.waitForSelector('.hfpxzc');
  await page.focus('.hfpxzc');
  await page.keyboard.press('End');

  for (let i = 0; i < 5; i++) {
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



async function raspaLinks(){
  const links = [];
  const html = await scrapHtml()

  const $ = await cheerio.load(html);
  
  const tagAhref = $('.hfpxzc');
  tagAhref.each((i,e)=>{
    link = $(e).attr('href');
    links.push(link);
  })

  return links;
}



async function main(link){
  const dados = [];
  const browser = await puppeteer.launch({
    // headless:false,
    // defaultViewport: null
  });
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
  
  let [ titulo , endereco, telefone ] = dados;
  
  
  const csvString = `${titulo.replace(/,/g, '')};${endereco.replace(/,/g, '')};${telefone.replace(/,/g, '')}\n`
  salvaCsv(csvString);
  // append dados in csv file
  await browser.close()

}

const links = [
  'https://www.google.com.br/maps/place/Restaurante+Bangalo/data=!4m7!3m6!1s0xa6c21c730cbb7b:0xf3b661d75e245e1!8m2!3d-19.9276438!4d-44.1807551!16s%2Fg%2F11cn0y60p3!19sChIJe7sMcxzCpgAR4UXidR1mOw8?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+da+Nina/data=!4m7!3m6!1s0xa6c358da88016d:0xb16b721183fcd742!8m2!3d-19.9307355!4d-44.1803592!16s%2Fg%2F11hzwc5x_r!19sChIJbQGI2ljDpgARQtf8gxFya7E?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Tempero+%26+Sabor/data=!4m7!3m6!1s0xa6c22886a9fbcb:0x78a3c5be1406e10b!8m2!3d-19.9409895!4d-44.1746944!16s%2Fg%2F11hz8z0kbp!19sChIJy_uphijCpgARC-EGFL7Fo3g?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Da+Cecilia/data=!4m7!3m6!1s0xa6c23dd6288a2b:0xa82ff7ba62577d9e!8m2!3d-19.9296129!4d-44.1862696!16s%2Fg%2F11j1j6k6gb!19sChIJK4oo1j3CpgARnn1XYrr3L6g?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Alecrim/data=!4m7!3m6!1s0xa6c1631a3a953b:0xcb56a70711ebe938!8m2!3d-19.9448907!4d-44.1785131!16s%2Fg%2F11h2p8hr1l!19sChIJO5U6GmPBpgAROOnrEQenVss?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Kisabor/data=!4m7!3m6!1s0xa6c3fe70f74ca7:0xb0536c322a5a30c3!8m2!3d-19.9371833!4d-44.1956863!16s%2Fg%2F11hytn7x0_!19sChIJp0z3cP7DpgARwzBaKjJsU7A?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Sabor+Caseiro/data=!4m7!3m6!1s0xa6c23451b3d745:0x9da8ff56e35ecff6!8m2!3d-19.9462351!4d-44.1888472!16s%2Fg%2F11c1rsvxyw!19sChIJRdezUTTCpgAR9s9e41b_qJ0?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+e+frango+assado+TOCONFOME/data=!4m7!3m6!1s0xa6c158ed29695d:0xbd3ead76dca79355!8m2!3d-19.9394965!4d-44.1687093!16s%2Fg%2F11gnrg1tl2!19sChIJXWkp7VjBpgARVZOn3HatPr0?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante/data=!4m7!3m6!1s0xa6c13a6bdf38c7:0x790fdb03e0d9213f!8m2!3d-19.9449073!4d-44.1715612!16s%2Fg%2F11qg4xs_gt!19sChIJxzjfazrBpgARPyHZ4APbD3k?authuser=0&hl=pt-BR&rclk=1',
  "https://www.google.com.br/maps/place/Restaurante+D'La+Pra%C3%A7a/data=!4m7!3m6!1s0xa6c30a2231b55d:0xe6780745855c293!8m2!3d-19.944645!4d-44.1790912!16s%2Fg%2F11ghfpc6_3!19sChIJXbUxIgrDpgARk8JVWHSAZw4?authuser=0&hl=pt-BR&rclk=1",
  'https://www.google.com.br/maps/place/Ponto+certo+restaurante+e+churrascaria/data=!4m7!3m6!1s0xa6c323280f19d1:0xf02bb3993f5a97fc!8m2!3d-19.9420549!4d-44.1825379!16s%2Fg%2F11rc779q1s!19sChIJ0RkPKCPDpgAR_JdaP5mzK_A?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Casa+Nossa/data=!4m7!3m6!1s0xa6c38126611135:0x66d6f6d0bb152ece!8m2!3d-19.9485936!4d-44.1895233!16s%2Fg%2F11r2m0h7lk!19sChIJNRFhJoHDpgARzi4Vu9D21mY?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+do+Marc%C3%A3o+-+Betim+MG/data=!4m7!3m6!1s0xa6c3fd54e9b891:0x4aeca72817d366b2!8m2!3d-19.9489224!4d-44.1918072!16s%2Fg%2F11k747lwr4!19sChIJkbjpVP3DpgARsmbTFyin7Eo?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Espetinho+das+meninas+e+Restaurante/data=!4m7!3m6!1s0xa6c24be8bfa4b5:0x2618e96251fef99b!8m2!3d-19.9397231!4d-44.1949376!16s%2Fg%2F11gb3r12k_!19sChIJtaS_6EvCpgARm_n-UWLpGCY?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/RESTAURANTE+BOM+PALADAR/data=!4m7!3m6!1s0xa6c32f18ddfecb:0x1a256f16cf6f55f7!8m2!3d-19.9304467!4d-44.1901042!16s%2Fg%2F11rxj1l2tr!19sChIJy_7dGC_DpgAR91VvzxZvJRo?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Gide%C3%A3o/data=!4m7!3m6!1s0xa6c22dac6ee6d7:0x243420653d074d29!8m2!3d-19.9459972!4d-44.1792136!16s%2Fg%2F11c2jk6cyv!19sChIJ1-ZurC3CpgARKU0HPWUgNCQ?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Ponto+Do+Tropeiro+Bar+E+Restaurante/data=!4m7!3m6!1s0xa6c22cedd50227:0xb7fe9916cbf2202b!8m2!3d-19.9472977!4d-44.1783109!16s%2Fg%2F11gcdcv_36!19sChIJJwLV7SzCpgARKyDyyxaZ_rc?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+e+Pizzaria+do+Luiz%C3%A3o/data=!4m7!3m6!1s0xa6c23924377b03:0xe603635690e5b8f1!8m2!3d-19.9329088!4d-44.188031!16s%2Fg%2F11g72g1vnj!19sChIJA3s3JDnCpgAR8bjlkFZjA-Y?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+do+Paulista/data=!4m7!3m6!1s0xa6c37de531e68d:0xdbffd43452971a8b!8m2!3d-19.9490716!4d-44.1917584!16s%2Fg%2F11jmwt4r8x!19sChIJjeYx5X3DpgARixqXUjTU_9s?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Sabor+de+Portugal/data=!4m7!3m6!1s0xa6c3b3ed32c4a9:0xb477e892a892b0af!8m2!3d-19.9467515!4d-44.1964648!16s%2Fg%2F11bccjq2ny!19sChIJqcQy7bPDpgARr7CSqJLod7Q?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Casa+Nossa/data=!4m7!3m6!1s0xa6c38126611135:0x66d6f6d0bb152ece!8m2!3d-19.9485936!4d-44.1895233!16s%2Fg%2F11r2m0h7lk!19sChIJNRFhJoHDpgARzi4Vu9D21mY?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/RESTAURANTE+BOM+PALADAR/data=!4m7!3m6!1s0xa6c32f18ddfecb:0x1a256f16cf6f55f7!8m2!3d-19.9304467!4d-44.1901042!16s%2Fg%2F11rxj1l2tr!19sChIJy_7dGC_DpgAR91VvzxZvJRo?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Espetinho+das+meninas+e+Restaurante/data=!4m7!3m6!1s0xa6c24be8bfa4b5:0x2618e96251fef99b!8m2!3d-19.9397231!4d-44.1949376!16s%2Fg%2F11gb3r12k_!19sChIJtaS_6EvCpgARm_n-UWLpGCY?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Restaurante+Gide%C3%A3o/data=!4m7!3m6!1s0xa6c22dac6ee6d7:0x243420653d074d29!8m2!3d-19.9459972!4d-44.1792136!16s%2Fg%2F11c2jk6cyv!19sChIJ1-ZurC3CpgARKU0HPWUgNCQ?authuser=0&hl=pt-BR&rclk=1',
  'https://www.google.com.br/maps/place/Neia+Restaurante/data=!4m7!3m6!1s0xa6c2456a07b699:0x85848917beae0579!8m2!3d-19.9330253!4d-44.2001388!16s%2Fg%2F11c45p1wj0!19sChIJmbYHakXCpgAReQWuvheJhIU?authuser=0&hl=pt-BR&rclk=1'
]


async function scraping(){
  for (let i = 0; i < 10; i++) {
    const link = links[i];
    main(link);
  }
}



scraping()
