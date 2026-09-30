const ClienteInfrastructure = require('../infrastructure/clientesInfrastructure');
const Cliente = require('../models/entidades/cliente');


class ClienteService {

    constructor() {
        this.clienteInfrastructure = new ClienteInfrastructure();
    }


    // LISTAR CLIENTES
    async listarClientes() {
        return await this.clienteInfrastructure.listarClientes();
    }


    // BUSCAR CLIENTE POR ID
    async buscarClientePorId(id) {

        if (!id) {
            throw new Error('ID do cliente é obrigatório');
        }

        return await this.clienteInfrastructure.buscarClientePorId(id);
    }


    // BUSCAR CLIENTE POR TIPO
    async buscarClientePorTipo(tipo) {

        if (!tipo) {
            throw new Error('Tipo do cliente é obrigatório');
        }

        const tiposPermitidos = [
            'Aluno',
            'Professor',
            'Funcionário',
            'Visitante'
        ];

        if (!tiposPermitidos.includes(tipo)) {
            throw new Error('Tipo de cliente inválido');
        }

        return await this.clienteInfrastructure.buscarClientePorTipo(tipo);
    }


    // CADASTRAR CLIENTE
    async cadastrarCliente(dados) {

        if (!dados.nome) {
            throw new Error('Nome do cliente é obrigatório');
        }

        if (!dados.tipo_cliente) {
            throw new Error('Tipo do cliente é obrigatório');
        }

        const tiposPermitidos = [
            'Aluno',
            'Professor',
            'Funcionário',
            'Visitante'
        ];

        if (!tiposPermitidos.includes(dados.tipo_cliente)) {
            throw new Error('Tipo de cliente inválido');
        }

        if (dados.tipo_cliente === 'Aluno' && (!dados.ra?.trim() || !dados.responsavel?.trim() || !dados.telefone_responsavel?.trim())) {
            throw new Error('RA, responsável e telefone do responsável são obrigatórios para alunos');
        }

        const cliente = new Cliente(
            null,
            dados.nome,
            dados.tipo_cliente,
            dados.telefone || null,
            dados.observacoes || null,
            true,
            null
        );

        const id =
            await this.clienteInfrastructure.cadastrarCliente(cliente, dados);

        return await this.clienteInfrastructure.buscarClientePorId(id);
    }


    // ATUALIZAR CLIENTE
    async atualizarCliente(id, dados) {

        if (!id) {
            throw new Error('ID do cliente é obrigatório');
        }

        const cliente =
            await this.clienteInfrastructure.buscarClientePorId(id);

        if (!cliente) {
            return false;
        }

        if (dados.tipo_cliente) {

            const tiposPermitidos = [
                'Aluno',
                'Professor',
                'Funcionário',
                'Visitante'
            ];

            if (!tiposPermitidos.includes(dados.tipo_cliente)) {
                throw new Error('Tipo de cliente inválido');
            }
        }

        cliente.nome =
            dados.nome ?? cliente.nome;

        cliente.tipo_cliente =
            dados.tipo_cliente ?? cliente.tipo_cliente;

        cliente.telefone =
            dados.telefone ?? cliente.telefone;

        cliente.observacoes =
            dados.observacoes ?? cliente.observacoes;

        cliente.ativo =
            dados.ativo ?? cliente.ativo;

        return await this.clienteInfrastructure.atualizarCliente(cliente);
    }


    // EXCLUIR / DESATIVAR CLIENTE
    async excluirCliente(id) {

        if (!id) {
            throw new Error('ID do cliente é obrigatório');
        }

        const cliente =
            await this.clienteInfrastructure.buscarClientePorId(id);

        if (!cliente) {
            return false;
        }

        return await this.clienteInfrastructure.excluirCliente(id);
    }
}

module.exports = ClienteService;