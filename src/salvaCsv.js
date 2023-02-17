const fs = require('fs');

function salvaCsv(dados){
  fs.appendFile('leads/leads.csv', dados, (err)=> {
    if (err) throw err;
    console.log('Salvando');
  })
}


module.exports=salvaCsv;
