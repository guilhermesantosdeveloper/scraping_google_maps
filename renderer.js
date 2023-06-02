const { ipcRenderer } = require('electron');

const path = require('path');
const {lerArquivoJson,editarArquivoJson,criarArquivoJson} = require('../src/jsonCrud')




const caminho = path.resolve('config.json')

function salvaModelo(content) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  element.href = URL.createObjectURL(file);
  element.download = "contatos.csv";
  element.click();
}


const arquivoJson = lerArquivoJson(caminho);


const inputNegocio = document.getElementById('negocio');
const inputBairro = document.getElementById('bairro');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');
const btnSalvar = document.getElementById('salvar');
const btnPesquisar = document.getElementById('pesquisar');
const divSpinner = document.getElementById('caixa-spinner');
const texto = document.getElementById('texto');
const textoSalvar = document.getElementById('texto-salvar')

window.onload=()=>{
    criarArquivoJson(caminho)
    inputNegocio.value = arquivoJson.negocio;
    inputBairro.value = arquivoJson.bairro;
    inputCidade.value = arquivoJson.cidade;
    inputEstado.value = arquivoJson.estado;
  }


btnSalvar.addEventListener('click',(e)=>{
    const json = {
        negocio: inputNegocio.value,
        bairro: inputBairro.value,
        cidade: inputCidade.value,
        estado: inputEstado.value
      }

    editarArquivoJson(caminho, json);
    const arquivoJson = lerArquivoJson(caminho);
    inputNegocio.value = arquivoJson.negocio;
    inputBairro.value = arquivoJson.bairro;
    inputCidade.value = arquivoJson.cidade;
    inputEstado.value = arquivoJson.estado;
    textoSalvar.innerText = 'Salvo com sucesso'
})


btnPesquisar.addEventListener('click', (e)=>{
  btnPesquisar.hidden = true;
  divSpinner.classList.add('spinner-border');
  ipcRenderer.send('pesquisa');
})

//{nome:'',endereco:'',telefone:''}

ipcRenderer.on('restaurante',(e,dados)=>{
  const nome = dados.nome;
  const endereco = dados.endereco;
  const telefone = dados.telefone;
  texto.innerText = `Dados capturados:
Nome do Estabelecimento: ${nome}
Endereço do Estabelecimento: ${endereco}
Telefone do Estabelecimento: ${telefone}`

})

ipcRenderer.on('salvar', (e, csv)=>{
  btnPesquisar.hidden = false;
  divSpinner.classList.remove('spinner-border');
  texto.innerText = '';
  salvaModelo(csv)
})
