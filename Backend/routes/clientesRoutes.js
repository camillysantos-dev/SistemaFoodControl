const express = require('express');
const router = express.Router();

const ClienteService = require('../services/clientesService');

const clienteService = new ClienteService();


router.post("/", async (req, res) => {
  try {
    const cliente = await clienteService.cadastrarCliente(req.body);

    res.status(201).json({
      mensagem: "Cliente cadastrado com sucesso",
      cliente,
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: "Erro ao cadastrar cliente",
      erro: erro.message,
    });
  }
});

// LISTAR TODOS OS CLIENTES
router.get('/', async (req, res) => {
    try {
        const clientes = await clienteService.listarClientes();

        res.status(200).json(clientes);

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao listar clientes',
            erro: erro.message
        });
    }
});


// BUSCAR CLIENTE POR ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await clienteService.buscarClientePorId(id);

        if (!cliente) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado'
            });
        }

        res.status(200).json(cliente);

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar cliente',
            erro: erro.message
        });
    }
});


// BUSCAR CLIENTES POR TIPO
router.get('/tipo/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;

        const clientes =
            await clienteService.buscarClientePorTipo(tipo);

        res.status(200).json(clientes);

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar clientes por tipo',
            erro: erro.message
        });
    }
});


// CADASTRAR CLIENTE
router.post('/', async (req, res) => {
    try {
        const cliente = await clienteService.cadastrarCliente(req.body);

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso',
            cliente
        });

    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao cadastrar cliente',
            erro: erro.message
        });
    }
});


// ATUALIZAR CLIENTE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const atualizado =
            await clienteService.atualizarCliente(id, req.body);

        if (!atualizado) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Cliente atualizado com sucesso'
        });

    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao atualizar cliente',
            erro: erro.message
        });
    }
});


// EXCLUIR / DESATIVAR CLIENTE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const excluido =
            await clienteService.excluirCliente(id);

        if (!excluido) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado'
            });
        }

        res.status(200).json({
            mensagem: 'Cliente desativado com sucesso'
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir cliente',
            erro: erro.message
        });
    }
});


module.exports = router;