const fs = require('fs');
const path = require('path');



function salvaCsv(dados){
  const caminho = path.resolve(__dirname, '..','leads', 'leads.csv')
  fs.appendFile(caminho, dados, (err)=> {
    if (err) throw err;
    console.log('Salvando');
  })
}


module.exports=salvaCsv;
