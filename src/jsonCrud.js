const fs = require('fs');
// Ler o arquivo JSON
const lerArquivoJson = (caminhoArquivo) => {
  try {
    const conteudoArquivo = fs.readFileSync(caminhoArquivo, 'utf8');
    const json = JSON.parse(conteudoArquivo);
    return json;
  } catch (erro) {
    //console.error('Erro ao ler o arquivo JSON:', erro);
    return null;
  }
};

// Editar o arquivo JSON
const editarArquivoJson = (caminhoArquivo, novoJson) => {
  try {
    const json = JSON.stringify(novoJson, null, 2);
    fs.writeFileSync(caminhoArquivo, json);
    //console.log('Arquivo JSON editado com sucesso!');
  } catch (erro) {
    //console.error('Erro ao editar o arquivo JSON:', erro);
  }
};


module.exports={
    lerArquivoJson,
    editarArquivoJson
}