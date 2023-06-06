const fs = require('fs');

const lerArquivoTxt = (caminhoArquivo) => {
  try {
    const conteudoArquivo = fs.readFileSync(caminhoArquivo, 'utf8');
    return conteudoArquivo;
  } catch (erro) {
    return null;
  }
};


const editarArquivoTxt = (caminhoArquivo, novoTxt) => {
  try {

    fs.writeFileSync(caminhoArquivo, novoTxt);
  } catch (erro) {
  }
};







module.exports={
    lerArquivoTxt,
    editarArquivoTxt,
}
