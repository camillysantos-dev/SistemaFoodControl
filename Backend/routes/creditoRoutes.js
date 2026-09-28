const express = require('express');
const router = express.Router();

const CreditoService = require('../services/creditoService');

const creditoService = new CreditoService();


// LISTAR TODAS AS CONTAS DE CRÉDITO
router.get('/', async (req, res) => {
    try {
        const creditos = await creditoService.listarCreditos();

        res.status(200).json(creditos);

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao listar créditos',
            erro: erro.message
        });
    }
});


// BUSCAR CRÉDITO PELO ALUNO
router.get('/aluno/:idAluno', async (req, res) => {
    try {
        const { idAluno } = req.params;

        const credito =
            await creditoService.buscarCreditoPorAluno(idAluno);

        if (!credito) {
            return res.status(404).json({
                mensagem: 'Conta de crédito não encontrada'
            });
        }

        res.status(200).json(credito);

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar crédito do aluno',
            erro: erro.message
        });
    }
});


// BUSCAR CRÉDITO PELO ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const credito =
            await creditoService.buscarCreditoPorId(id);

        if (!credito) {
            return res.status(404).json({
                mensagem: 'Conta de crédito não encontrada'
            });
        }

        res.status(200).json(credito);

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar crédito',
            erro: erro.message
        });
    }
});


// CADASTRAR CONTA DE CRÉDITO
router.post('/', async (req, res) => {
    try {
        const credito =
            await creditoService.cadastrarCredito(req.body);

        res.status(201).json({
            mensagem: 'Conta de crédito cadastrada com sucesso',
            credito
        });

    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao cadastrar crédito',
            erro: erro.message
        });
    }
});


// ADICIONAR CRÉDITO
router.patch('/aluno/:idAluno/adicionar', async (req, res) => {
    try {
        const { idAluno } = req.params;
        const { valor } = req.body;

        const resultado =
            await creditoService.adicionarCredito(
                idAluno,
                valor
            );

        if (!resultado) {
            return res.status(404).json({
                mensagem: 'Conta de crédito não encontrada'
            });
        }

        res.status(200).json({
            mensagem: 'Crédito adicionado com sucesso'
        });

    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao adicionar crédito',
            erro: erro.message
        });
    }
});


// REMOVER CRÉDITO
router.patch('/aluno/:idAluno/remover', async (req, res) => {
    try {
        const { idAluno } = req.params;
        const { valor } = req.body;

        const resultado =
            await creditoService.removerCredito(
                idAluno,
                valor
            );

        if (!resultado) {
            return res.status(400).json({
                mensagem: 'Saldo insuficiente ou conta não encontrada'
            });
        }

        res.status(200).json({
            mensagem: 'Crédito removido com sucesso'
        });

    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao remover crédito',
            erro: erro.message
        });
    }
});


// ATUALIZAR SALDO
router.put('/aluno/:idAluno/saldo', async (req, res) => {
    try {
        const { idAluno } = req.params;
        const { saldo } = req.body;

        const atualizado =
            await creditoService.atualizarSaldo(
                idAluno,
                saldo
            );

        if (!atualizado) {
            return res.status(404).json({
                mensagem: 'Conta de crédito não encontrada'
            });
        }

        res.status(200).json({
            mensagem: 'Saldo atualizado com sucesso'
        });

    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao atualizar saldo',
            erro: erro.message
        });
    }
});


// EXCLUIR CONTA DE CRÉDITO
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const excluido =
            await creditoService.excluirCredito(id);

        if (!excluido) {
            return res.status(404).json({
                mensagem: 'Conta de crédito não encontrada'
            });
        }

        res.status(200).json({
            mensagem: 'Conta de crédito excluída com sucesso'
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir conta de crédito',
            erro: erro.message
        });
    }
});


module.exports = router;