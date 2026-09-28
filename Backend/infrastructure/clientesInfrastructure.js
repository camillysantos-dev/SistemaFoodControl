const { pool } = require('../config/db');
const Cliente = require('../models/entidades/cliente');

class ClienteInfrastructure {

    async listarClientes() {
        const [resultado] = await pool.query(
            `SELECT *
             FROM Cliente
             WHERE ativo = TRUE
             ORDER BY nome`
        );

        return resultado.map(cliente => new Cliente(
            cliente.id_cliente,
            cliente.nome,
            cliente.tipo_cliente,
            cliente.telefone,
            cliente.observacoes,
            cliente.ativo,
            cliente.data_cadastro
        ));
    }

    async buscarClientePorId(id) {
        const [resultado] = await pool.query(
            `SELECT *
             FROM Cliente
             WHERE id_cliente = ?`,
            [id]
        );

        if (resultado.length === 0) {
            return null;
        }

        const cliente = resultado[0];

        return new Cliente(
            cliente.id_cliente,
            cliente.nome,
            cliente.tipo_cliente,
            cliente.telefone,
            cliente.observacoes,
            cliente.ativo,
            cliente.data_cadastro
        );
    }

    async buscarClientePorTipo(tipo) {
        const [resultado] = await pool.query(
            `SELECT *
             FROM Cliente
             WHERE tipo_cliente = ?
             AND ativo = TRUE
             ORDER BY nome`,
            [tipo]
        );

        return resultado.map(cliente => new Cliente(
            cliente.id_cliente,
            cliente.nome,
            cliente.tipo_cliente,
            cliente.telefone,
            cliente.observacoes,
            cliente.ativo,
            cliente.data_cadastro
        ));
    }

    async cadastrarCliente(cliente) {
        const [resultado] = await pool.query(
            `INSERT INTO Cliente
                (nome, tipo_cliente, telefone, observacoes)
             VALUES (?, ?, ?, ?)`,
            [
                cliente.nome,
                cliente.tipo_cliente,
                cliente.telefone,
                cliente.observacoes
            ]
        );

        return resultado.insertId;
    }

    async atualizarCliente(cliente) {
        const [resultado] = await pool.query(
            `UPDATE Cliente
             SET nome = ?,
                 tipo_cliente = ?,
                 telefone = ?,
                 observacoes = ?,
                 ativo = ?
             WHERE id_cliente = ?`,
            [
                cliente.nome,
                cliente.tipo_cliente,
                cliente.telefone,
                cliente.observacoes,
                cliente.ativo,
                cliente.id_cliente
            ]
        );

        return resultado.affectedRows > 0;
    }

    async excluirCliente(id) {
        const [resultado] = await pool.query(
            `UPDATE Cliente
             SET ativo = FALSE
             WHERE id_cliente = ?`,
            [id]
        );

        return resultado.affectedRows > 0;
    }

}
module.exports = ClienteInfrastructure;

// async function testar() {

//     const infrastructure = new ClienteInfrastructure();

//     try {

//         // 1. CADASTRAR
//         console.log("\n--- CADASTRAR CLIENTE ---");

//         const cliente = new Cliente(
//             null,
//             "Camilly Teste",
//             "Aluno",
//             "11999999999",
//             "Teste do Infrastructure",
//             true,
//             null
//         );

//         const id = await infrastructure.cadastrarCliente(cliente);

//         console.log("Cliente cadastrado!");
//         console.log("ID:", id);


//         // 2. BUSCAR PELO ID
//         console.log("\n--- BUSCAR POR ID ---");

//         const clienteEncontrado =
//             await infrastructure.buscarClientePorId(id);

//         console.log(clienteEncontrado);


//         // 3. BUSCAR PELO TIPO
//         console.log("\n--- BUSCAR POR TIPO ---");

//         const alunos =
//             await infrastructure.buscarClientePorTipo("Aluno");

//         console.log(alunos);


//         // 4. LISTAR
//         console.log("\n--- LISTAR CLIENTES ---");

//         const clientes =
//             await infrastructure.listarClientes();

//         console.log(clientes);


//         // 5. ATUALIZAR
//         console.log("\n--- ATUALIZAR CLIENTE ---");

//         clienteEncontrado.nome = "Camilly Atualizada";
//         clienteEncontrado.telefone = "11888888888";

//         const atualizado =
//             await infrastructure.atualizarCliente(clienteEncontrado);

//         console.log("Atualizado:", atualizado);


//         // 6. VERIFICAR ATUALIZAÇÃO
//         console.log("\n--- CLIENTE ATUALIZADO ---");

//         const atualizadoBanco =
//             await infrastructure.buscarClientePorId(id);

//         console.log(atualizadoBanco);


//         // 7. EXCLUIR
//         console.log("\n--- EXCLUIR CLIENTE ---");

//         const excluido =
//             await infrastructure.excluirCliente(id);

//         console.log("Excluído/desativado:", excluido);


//         // 8. VERIFICAR SE FOI DESATIVADO
//         console.log("\n--- VERIFICAR EXCLUSÃO ---");

//         const clienteDesativado =
//             await infrastructure.buscarClientePorId(id);

//         console.log(clienteDesativado);

//     } catch (erro) {

//         console.error("Erro no teste:");
//         console.error(erro);

//     } finally {

//         await pool.end();

//     }
// }


// // Executa os testes somente quando rodar este arquivo diretamente
// if (require.main === module) {
//     testar();
// }


