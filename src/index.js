import express from 'express'; 

const app = express(); 

app.use(express.json()); 

let carros = [];
let proxCarro = 1;

// POST - CREATE
app.post('/carro', (request, response) => {
    
    const modelo = request.body.modelo;
    const marca = request.body.marca;
    const ano = Number(request.body.ano);
    const cor = request.body.cor;
    const preco = Number(request.body.preco);

    if (!modelo){
        response.status(400).send('Digite um modelo válido!')
    }
    if (!marca){
        response.status(400).send('Digite uma marca válida!')
    }
    if (!ano){
        response.status(400).send('Digite um ano válido!')
    }
    if (!cor){
        response.status(400).send('Digite uma cor válida!')
    }
    if (!preco){
        response.status(400).send('Digite um preço válido!')
    }

    let novoCarro = {
        id: proxCarro,
        modelo: modelo,
        marca: marca,
        ano: ano,
        cor: cor,
        preco: preco,
    }

    carros.push(novoCarro);
    proxCarro++;

    response.status(201).send('Carro adicionado com sucesso');
});

// GET - READ
app.get('/carro', (request, response) => {

    if(carros.length === 0){
        response.status(400).send('Não existe nenhum carro cadastrado!')
    }

    const dados = carros.map((carro)=> `ID: ${carro.id} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Ano: ${carro.ano} | Cor: ${carro.cor} | Preço: ${carro.preco}`)

    response.status(200).send(dados)
});

// GET - FILTER
app.get('/filtro', (request, response) => {
    const marca = request.body.marca;
    
    if (!marca) {
        response.status(400).send('Forneça uma marca válida para filtrar!');
    }
    
    const carroFiltrado = carros.filter(carro => carro.marca === marca);

    if (carros.length === 0) {
        response.status(404).send('Nenhum carro cadastrado!');
    }
    if(carroFiltrado.length === 0){
        response.status(404).send('Nenhum carro com esta marca cadastrada!' );
    }
    const dados = carroFiltrado.map((carro)=> `ID: ${carro.id} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Cor: ${carro.cor} | Preço: ${carro.preco}`)

    response.status(200).json({success: true, data: dados})
});

// PUT - UPDATE
app.put('/carro/:idBuscado', (request, response)=> {
    const cor = request.body.cor;
    const preco = request.body.preco;

    const idBuscado = Number(request.params.idBuscado);

    if(!idBuscado){
        response.status(400).send(JSON.stringify({Mensagem: 'Por favor, insira um ID válido!'}))
    }

    const idVerificado = carros.findIndex(carro => carro.id === idBuscado)

    if(idVerificado === -1){
        response.status(400).send(JSON.stringify({Mensagem: 'ID não encontrado.'}))
    }
    if (!cor){
        response.status(400).send(JSON.stringify({Mensagem: 'Digite uma cor válida!'}))
    }
    if (!preco){
        response.status(400).send(JSON.stringify({Mensagem: 'Digite um preço válido!'}))
    }
    if(idVerificado !== -1){
        const veiculo = carros[idVerificado]
        veiculo.cor = cor;
        veiculo.preco = preco;

        response.status(200).send(JSON.stringify({Mensagem: 'Carro atualizado com sucesso!', 
        data: veiculo}))
    }
})

// VERIFICAR A PORTA
app.listen(8080, () => console.log('Servidor iniciado'));