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
        modelo: modelo,
        marca: marca,
        ano: ano,
        cor: cor,
        preco: preco,
    }

    carros.push(novoCarro);

    proxCarro++;

    response.status(201).send('Carro adicionado com sucesso');

    response.status(201).send({mensagem: 'Recurso criado com sucesso!'});
});

// GET - READ
app.get('/carro', (request, response) => {

    if(carros.length === 0){
        response.status(400).send('Não existe nenhum carro cadastrado!')
    }

    const dados = carros.map((carro)=> `Os carros cadastrados são: ID: ${carro.proxCarro} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Ano: ${carro.ano} | Cor: ${carro.cor} | Preço: ${carro.preco}`)

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
        response.status(404).send('Nenhum carro cadastrado!' );
    }
    if(carroFiltrado != marca){
        response.status(404).send('Esta marca não foi encontrada!');
    }
    
    response.status(201).send(carroFiltrado);
});

// VERIFICAR A PORTA
app.listen(8080, () => console.log('Servidor iniciado'));