const { ipcRenderer } = require('electron');

const path = require('path');
const {lerArquivoTxt,editarArquivoTxt} = require('../src/rftCrud.js')




const caminho = path.resolve('rft.txt')
const token = lerArquivoTxt(caminho);


async function validLogin(token) {
  const data = {
    key: token
  }
  const response = await fetch("https://api.seunegocioautomatico.com/keylead",{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const jsonData = await response.json();

  if(jsonData.error || jsonData.erro){

    return false
  }else{

    return true
  }

}

async function criarLead(data, caminho) {
  let key;
  try {
    const response = await fetch("https://api.seunegocioautomatico.com/criarlead", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const jsonData = await response.json();

    key = jsonData.key
    editarArquivoTxt(caminho,key)
    return true

  } catch (error) {
    return false;
  }


}

const nome = document.getElementById('nome')
const email = document.getElementById('email')
const whatsapp = document.getElementById('whatsapp')
const btnCriar = document.getElementById('criar')
const texto = document.getElementById('texto')


window.onload=async ()=>{
  const login = await validLogin(token)
  if(login){
    ipcRenderer.send('logado');
    return null
  }
  texto.innerText = 'Você precisa ter uma conta para acessar o programa'

  
}

btnCriar.addEventListener('click', async (e)=>{
  const data = {
    name: nome.value,
    email: email.value,
    whatsapp: whatsapp.value
  }

  const res = await criarLead(data, caminho);
  console.log(res);
  if (res){
    ipcRenderer.send('logado');
  }else{
    texto.innerText = 'Error em criar sua conta'
  }
})