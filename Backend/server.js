const express = require('express');
const cors = require('cors');

require('dotenv').config();

// IMPORTANDO A CONEXÃO COM O BANCO DE DADOS
require('./config/db');

// IMPORTANDO AS ROTAS
const produtoRoutes = require('./routes/produtoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const estoqueRoutes = require('./routes/estoqueRoutes');

// CRIANDO A APLICAÇÃO EXPRESS
const app = express();

// CONFIGURANDO OS MIDDLEWARES
app.use(cors());

app.use(express.json());

// CONFIGURANDO AS ROTAS
app.use('/produtos', produtoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/estoque', estoqueRoutes);

// DEFININDO A PORTA DO SERVIDOR
const PORT = process.env.PORT || 3000;

// INICIANDO O SERVIDOR
app.listen(PORT, () => {

    console.log(`Servidor rodando na porta ${PORT}`);

});