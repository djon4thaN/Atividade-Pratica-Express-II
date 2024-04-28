import express from 'express'; 
import bcrypt from 'bcrypt';

const app = express(); 

app.use(express.json()); 

let carros = [];
let proxCarro = 1;
let usuario = [];
let proxUsuario = 1;

// POST - CREATE
app.post('/carro', (request, response) => {
    
    const modelo = request.body.modelo;
    const marca = request.body.marca;
    const ano = Number(request.body.ano);
    const cor = request.body.cor;
    const preco = Number(request.body.preco);

    if (!modelo){
        response.status(400).send('Digite um modelo válido!');
        return;
    }
    if (!marca){
        response.status(400).send('Digite uma marca válida!');
        return;
    }
    if (!ano){
        response.status(400).send('Digite um ano válido!');
        return;
    }
    if (!cor){
        response.status(400).send('Digite uma cor válida!');
        return;
    }
    if (!preco){
        response.status(400).send('Digite um preço válido!');
        return;
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
        return;
    }

    const dados = carros.map((carro)=> `ID: ${carro.id} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Ano: ${carro.ano} | Cor: ${carro.cor} | Preço: ${carro.preco}`)

    response.status(200).send(dados)
});

// GET - FILTER
app.get('/filtro', (request, response) => {
    const marca = request.body.marca;
    
    if (!marca) {
        response.status(400).send('Forneça uma marca válida para filtrar!');
        return;
    }
    
    const carroFiltrado = carros.filter(carro => carro.marca === marca);

    if (carros.length === 0) {
        response.status(404).send('Nenhum carro cadastrado!');
        return;
    }
    if(carroFiltrado.length === 0){
        response.status(404).send('Nenhum carro com esta marca cadastrada!' );
        return;
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
        return;
    }

    const idVerificado = carros.findIndex(carro => carro.id === idBuscado)

    if(idVerificado === -1){
        response.status(400).send(JSON.stringify({Mensagem: 'ID não encontrado.'}))
        return;
    }
    if (!cor){
        response.status(400).send(JSON.stringify({Mensagem: 'Digite uma cor válida!'}))
        return;
    }
    if (!preco){
        response.status(400).send(JSON.stringify({Mensagem: 'Digite um preço válido!'}))
        return;
    }
    if(idVerificado !== -1){
        const veiculo = carros[idVerificado]
        veiculo.cor = cor;
        veiculo.preco = preco;

        response.status(200).send(JSON.stringify({Mensagem: 'Carro atualizado com sucesso!', 
        data: veiculo}))
        return;
    }
})

// DELETE
app.delete('/deletar/:idBuscado', (request, response) => {
    const idBuscado = Number(request.params.idBuscado)

    if(!idBuscado){
        response
        .status(400)
        .send(JSON.stringify({Mensagem: 'Por favor, insira um ID válido!'}))
        return;
    }

    const IndexPorID = carros.findIndex(carro => carro.id === idBuscado)

    if(IndexPorID === -1){
        response
        .status(400)
        .send(JSON.stringify({Mensagem: 'ID não encontrado!'}))
        return;
    }else {
        carros.splice(IndexPorID, 1)
        response
        .status(200)
        .send(JSON.stringify({Mensagem: 'Veículo deletado com sucesso!'}))
    }
})

// SIGNUP - CRIAR USUARIO
app.post('/signup', async(request, response)=>{
    const data = request.body

    const email = data.email
    const senha = data.senha

    if(!email){
        response
        .status(400)
        .send(JSON.stringify({ Mensagem: 'Insira um email válido!'}))
        return;
    }
    if(!senha){
        response
        .status(400)
        .send(JSON.stringify({ Mensagem: 'Insira uma senha válida!'}))
        return;
    }

    const verificarEmail = usuario.find((user)=> user.email === email)

    if(verificarEmail){
        response.status(400).send(JSON.stringify({ Mensagem: 'Este email já foi cadastrado!'}))
        return;
    }

    const senhaCript = await bcrypt.hash(senha, 10)

    let novoUsuario = {
        id: proxUsuario,
        email: data.email,
        senha: senhaCript
    }

    usuario.push(novoUsuario);
    proxUsuario++;

    response.status(201).send(JSON.stringify({ Mensagem: 'Usuário cadastrado com sucesso!'}))
})

// LOGIN
app.post('/login', async(request, response)=> {
    const data = request.body;

    const email = data.email;
    const senha = data.senha;

    if(!email){
        response.status(404).send(JSON.stringify({Mensagem: 'Insira um email válido!'}))
        return;
    }
    if(!senha){
        response.status(404).send(JSON.stringify({Mensagem: 'Insira uma senha válida!'}))
        return;
    }

    const user = usuario.find((usuarios) => usuarios.email === email);

    if(!user){
        response.status(404).send(JSON.stringify({Mensagem: 'Email inválido!'}))
        return;
    }

    const senhas = await bcrypt.compare(senha, user.senha);

    if(!senhas){
        response.status(404).send(JSON.stringify({Mensagem: 'Senha inválida!'}))
        return;
    }

    response.status(200).send(JSON.stringify({Mensagem: 'Usuário logado com sucesso!'}))
})

// VERIFICAR A PORTA
app.listen(8080, () => console.log('Servidor iniciado'));