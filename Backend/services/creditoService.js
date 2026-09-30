const CreditoInfrastructure = require('../infrastructure/creditoInfrastructure');
const CreditoAluno = require('../models/entidades/creditoAluno');

class CreditoService {

    constructor() {
        this.creditoInfrastructure = new CreditoInfrastructure();
    }


    // LISTAR CONTAS DE CRÉDITO
    async listarCreditos() {
        return await this.creditoInfrastructure.listarCreditos();
    }


    // BUSCAR CRÉDITO POR ID
    async buscarCreditoPorId(id) {

        if (!id) {
            throw new Error('ID da conta de crédito é obrigatório');
        }

        return await this.creditoInfrastructure.buscarCreditoPorId(id);
    }


    // BUSCAR CRÉDITO PELO ALUNO
    async buscarCreditoPorAluno(idAluno) {

        if (!idAluno) {
            throw new Error('ID do aluno é obrigatório');
        }

        return await this.creditoInfrastructure.buscarCreditoPorAluno(
            idAluno
        );
    }


    async listarMovimentacoes(idAluno) {
        if (!idAluno) throw new Error('ID do aluno é obrigatório');
        return this.creditoInfrastructure.listarMovimentacoes(idAluno);
    }

    // CADASTRAR CONTA DE CRÉDITO
    async cadastrarCredito(dados) {

        if (!dados.id_aluno) {
            throw new Error('ID do aluno é obrigatório');
        }

        // Verifica se o aluno já possui conta
        const contaExistente =
            await this.creditoInfrastructure.buscarCreditoPorAluno(
                dados.id_aluno
            );

        if (contaExistente) {
            throw new Error(
                'Este aluno já possui uma conta de crédito'
            );
        }

        const saldo = Number(dados.saldo ?? 0);

        if (Number.isNaN(saldo) || saldo < 0) {
            throw new Error('Saldo inválido');
        }

        const credito = new CreditoAluno(
            null,
            dados.id_aluno,
            saldo
        );

        const id =
            await this.creditoInfrastructure.cadastrarCredito(
                credito
            );

        return await this.creditoInfrastructure.buscarCreditoPorId(id);
    }


    // ADICIONAR CRÉDITO
    async adicionarCredito(idAluno, valor) {

        const valorNumerico = Number(valor);

        if (!idAluno) {
            throw new Error('ID do aluno é obrigatório');
        }

        if (
            !Number.isFinite(valorNumerico) ||
            valorNumerico <= 0
        ) {
            throw new Error(
                'O valor deve ser maior que zero'
            );
        }

        const conta =
            await this.creditoInfrastructure.buscarCreditoPorAluno(
                idAluno
            );

        if (!conta) {
            return false;
        }

        return await this.credititoAdicionar(
            idAluno,
            valorNumerico
        );
    }


    async credititoAdicionar(idAluno, valor) {
        return await this.creditoInfrastructure.adicionarCredito(
            idAluno,
            valor
        );
    }


    // REMOVER CRÉDITO
    async removerCredito(idAluno, valor) {

        const valorNumerico = Number(valor);

        if (!idAluno) {
            throw new Error('ID do aluno é obrigatório');
        }

        if (
            !Number.isFinite(valorNumerico) ||
            valorNumerico <= 0
        ) {
            throw new Error(
                'O valor deve ser maior que zero'
            );
        }

        const conta =
            await this.creditoInfrastructure.buscarCreditoPorAluno(
                idAluno
            );

        if (!conta) {
            return false;
        }

        if (Number(conta.saldo) < valorNumerico) {
            throw new Error('Saldo insuficiente');
        }

        return await this.creditoInfrastructure.removerCredito(
            idAluno,
            valorNumerico
        );
    }


    // ATUALIZAR SALDO
    async atualizarSaldo(idAluno, saldo) {

        const saldoNumerico = Number(saldo);

        if (!idAluno) {
            throw new Error('ID do aluno é obrigatório');
        }

        if (
            !Number.isFinite(saldoNumerico) ||
            saldoNumerico < 0
        ) {
            throw new Error(
                'O saldo não pode ser negativo'
            );
        }

        return await this.creditoInfrastructure.atualizarSaldo(
            idAluno,
            saldoNumerico
        );
    }


    // EXCLUIR CONTA DE CRÉDITO
    async excluirCredito(id) {

        if (!id) {
            throw new Error(
                'ID da conta de crédito é obrigatório'
            );
        }

        const credito =
            await this.creditoInfrastructure.buscarCreditoPorId(id);

        if (!credito) {
            return false;
        }

        return await this.creditoInfrastructure.excluirCredito(id);
    }
}

module.exports = CreditoService;