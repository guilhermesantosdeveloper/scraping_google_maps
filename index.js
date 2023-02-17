const raspaLinks = require('./src/raspaLinks');
const saveInfo = require('./src/saveInfo');

async function scraping(){
  const links = await raspaLinks();
  await saveInfo(links);
}

scraping();
