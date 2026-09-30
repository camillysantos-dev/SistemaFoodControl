const { pool } = require('../config/db');
const Cliente = require('../models/entidades/cliente');

class ClienteInfrastructure {

    async listarClientes() {
        const [linhas] = await pool.query(`
            SELECT c.*, a.id_aluno, a.matricula AS ra, a.turma,
                   r.nome AS responsavel, COALESCE(cc.saldo, 0) AS credito
            FROM Cliente c
            LEFT JOIN Aluno a ON a.id_cliente = c.id_cliente
            LEFT JOIN Conta_credito cc ON cc.id_aluno = a.id_aluno
            LEFT JOIN Aluno_responsavel ar ON ar.id_aluno = a.id_aluno AND ar.responsavel_principal = TRUE AND ar.status = 'Ativo'
            LEFT JOIN Responsavel r ON r.id_responsavel = ar.id_responsavel
            WHERE c.ativo = TRUE ORDER BY c.nome
        `);
        return linhas;
    }

    async buscarClientePorId(id) {
        const [linhas] = await pool.query(`
            SELECT c.*, a.id_aluno, a.matricula AS ra, a.turma,
                   r.nome AS responsavel, COALESCE(cc.saldo, 0) AS credito
            FROM Cliente c
            LEFT JOIN Aluno a ON a.id_cliente = c.id_cliente
            LEFT JOIN Conta_credito cc ON cc.id_aluno = a.id_aluno
            LEFT JOIN Aluno_responsavel ar ON ar.id_aluno = a.id_aluno AND ar.responsavel_principal = TRUE AND ar.status = 'Ativo'
            LEFT JOIN Responsavel r ON r.id_responsavel = ar.id_responsavel
            WHERE c.id_cliente = ?`, [id]);
        return linhas[0] || null;
    }

    async buscarClientePorTipo(tipo) {
        return (await this.listarClientes()).filter(cliente => cliente.tipo_cliente === tipo);
    }

    async cadastrarCliente(cliente, dados = {}) {
        const conexao = await pool.getConnection();
        try {
            await conexao.beginTransaction();
            const [resultado] = await conexao.query(
                `INSERT INTO Cliente (nome, tipo_cliente, telefone, observacoes) VALUES (?, ?, ?, ?)`,
                [cliente.nome, cliente.tipo_cliente, cliente.telefone, cliente.observacoes]
            );
            if (cliente.tipo_cliente === 'Aluno') {
                const [aluno] = await conexao.query(
                    `INSERT INTO Aluno (id_cliente, matricula, turma) VALUES (?, ?, ?)`,
                    [resultado.insertId, dados.ra, dados.turma || null]
                );
                const [responsavel] = await conexao.query(
                    `INSERT INTO Responsavel (nome, telefone) VALUES (?, ?)`,
                    [dados.responsavel, dados.telefone_responsavel]
                );
                await conexao.query(
                    `INSERT INTO Aluno_responsavel
                        (id_aluno, id_responsavel, parentesco, responsavel_principal)
                    VALUES (?, ?, ?, TRUE)`,
                    [
                        aluno.insertId,
                        responsavel.insertId,
                        dados.parentesco || null,
                    ]
                );
                await conexao.query(`INSERT INTO Conta_credito (id_aluno) VALUES (?)`, [aluno.insertId]);
            }
            await conexao.commit();
            return resultado.insertId;
        } catch (erro) {
            await conexao.rollback();
            throw erro;
        } finally {
            conexao.release();
        }
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


