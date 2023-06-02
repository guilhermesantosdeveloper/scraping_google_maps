function convertJsonToCsvString(jsonData) {
    const csvData = [];

    // Obter as chaves únicas do JSON como o cabeçalho do CSV
    const header = Object.keys(jsonData[0]);
    csvData.push(header);

    // Converter cada objeto do JSON em uma linha no CSV
    for (const obj of jsonData) {
        const row = header.map((key) => obj[key]);
        csvData.push(row);
    }



    let str = ``;
    for (let i = 0; i < csvData.length; i++) {
        const arr = csvData[i];
        let nome = arr[0];
        let endereco = arr[1]
        let telefone = arr[2]
        nome = nome.replace(/,/g, '')
        nome = nome.replace(/;/g, '')

        endereco = endereco.replace(/,/g, '')
        endereco = endereco.replace(/;/g, '')

        telefone = telefone.replace(/,/g, '')
        telefone = telefone.replace(/;/g, '')

        str = str + `${nome}; ${endereco}; ${telefone}` + '\n'

    }
    return str
}

module.exports=convertJsonToCsvString;