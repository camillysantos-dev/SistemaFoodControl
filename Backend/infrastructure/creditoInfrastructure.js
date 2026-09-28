const { pool } = require('../config/db');
const CreditoAluno = require('../models/entidades/creditoAluno');

class CreditoInfrastructure {

    async listarCreditos() {
        const [resultado] = await pool.query(
            `SELECT *
             FROM Conta_credito
             ORDER BY id_conta_credito`
        );

        return resultado.map(credito => new CreditoAluno(
            credito.id_conta_credito,
            credito.id_aluno,
            credito.saldo
        ));
    }

    async buscarCreditoPorId(id) {
        const [resultado] = await pool.query(
            `SELECT *
             FROM Conta_credito
             WHERE id_conta_credito = ?`,
            [id]
        );

        if (resultado.length === 0) {
            return null;
        }

        const credito = resultado[0];

        return new CreditoAluno(
            credito.id_conta_credito,
            credito.id_aluno,
            credito.saldo
        );
    }

    async buscarCreditoPorAluno(idAluno) {
        const [resultado] = await pool.query(
            `SELECT *
             FROM Conta_credito
             WHERE id_aluno = ?`,
            [idAluno]
        );

        if (resultado.length === 0) {
            return null;
        }

        const credito = resultado[0];

        return new CreditoAluno(
            credito.id_conta_credito,
            credito.id_aluno,
            credito.saldo
        );
    }

    async cadastrarCredito(credito) {
        const [resultado] = await pool.query(
            `INSERT INTO Conta_credito
                (id_aluno, saldo)
             VALUES (?, ?)`,
            [
                credito.id_aluno,
                credito.saldo
            ]
        );

        return resultado.insertId;
    }

    async adicionarCredito(idAluno, valor) {
        const [resultado] = await pool.query(
            `UPDATE Conta_credito
             SET saldo = saldo + ?
             WHERE id_aluno = ?`,
            [valor, idAluno]
        );

        return resultado.affectedRows > 0;
    }

    async removerCredito(idAluno, valor) {
        const [resultado] = await pool.query(
            `UPDATE Conta_credito
             SET saldo = saldo - ?
             WHERE id_aluno = ?
             AND saldo >= ?`,
            [valor, idAluno, valor]
        );

        return resultado.affectedRows > 0;
    }

    async atualizarSaldo(idAluno, saldo) {
        const [resultado] = await pool.query(
            `UPDATE Conta_credito
             SET saldo = ?
             WHERE id_aluno = ?`,
            [saldo, idAluno]
        );

        return resultado.affectedRows > 0;
    }

    async excluirCredito(id) {
        const [resultado] = await pool.query(
            `DELETE FROM Conta_credito
             WHERE id_conta_credito = ?`,
            [id]
        );

        return resultado.affectedRows > 0;
    }
}

module.exports = CreditoInfrastructure;

async function testar() {

    const infrastructure = new CreditoInfrastructure();

    try {

        // IMPORTANTE:
        // Coloque aqui um id_aluno que exista
        // na tabela Aluno do seu banco.
        const idAlunoTeste = 1;


        // ==========================================
        // 1 - CADASTRAR CONTA DE CRÉDITO
        // ==========================================

        console.log("\n--- CADASTRAR CRÉDITO ---");

        const novoCredito = new CreditoAluno(
            null,
            idAlunoTeste,
            100.00
        );

        const idCredito =
            await infrastructure.cadastrarCredito(novoCredito);

        console.log("Conta de crédito cadastrada!");
        console.log("ID da conta:", idCredito);


        // ==========================================
        // 2 - BUSCAR CRÉDITO PELO ID
        // ==========================================

        console.log("\n--- BUSCAR CRÉDITO POR ID ---");

        const credito =
            await infrastructure.buscarCreditoPorId(idCredito);

        console.log(credito);


        // ==========================================
        // 3 - BUSCAR CRÉDITO PELO ALUNO
        // ==========================================

        console.log("\n--- BUSCAR CRÉDITO POR ALUNO ---");

        const creditoAluno =
            await infrastructure.buscarCreditoPorAluno(idAlunoTeste);

        console.log(creditoAluno);


        // ==========================================
        // 4 - LISTAR CONTAS DE CRÉDITO
        // ==========================================

        console.log("\n--- LISTAR CRÉDITOS ---");

        const creditos =
            await infrastructure.listarCreditos();

        console.log(creditos);


        // ==========================================
        // 5 - ADICIONAR CRÉDITO
        // ==========================================

        console.log("\n--- ADICIONAR CRÉDITO ---");

        const adicionado =
            await infrastructure.adicionarCredito(
                idAlunoTeste,
                50.00
            );

        console.log("Crédito adicionado:", adicionado);


        // Verifica o novo saldo
        const aposAdicionar =
            await infrastructure.buscarCreditoPorAluno(idAlunoTeste);

        console.log("Saldo após adicionar:");
        console.log(aposAdicionar);


        // ==========================================
        // 6 - REMOVER CRÉDITO
        // ==========================================

        console.log("\n--- REMOVER CRÉDITO ---");

        const removido =
            await infrastructure.removerCredito(
                idAlunoTeste,
                30.00
            );

        console.log("Crédito removido:", removido);


        // Verifica o novo saldo
        const aposRemover =
            await infrastructure.buscarCreditoPorAluno(idAlunoTeste);

        console.log("Saldo após remover:");
        console.log(aposRemover);


        // ==========================================
        // 7 - TESTAR SALDO INSUFICIENTE
        // ==========================================

        console.log("\n--- TESTAR SALDO INSUFICIENTE ---");

        const saldoInsuficiente =
            await infrastructure.removerCredito(
                idAlunoTeste,
                10000.00
            );

        console.log(
            "Conseguiu remover valor maior que o saldo:",
            saldoInsuficiente
        );

        if (!saldoInsuficiente) {
            console.log("Teste correto: saldo insuficiente.");
        }


        // ==========================================
        // 8 - ATUALIZAR SALDO
        // ==========================================

        console.log("\n--- ATUALIZAR SALDO ---");

        const atualizado =
            await infrastructure.atualizarSaldo(
                idAlunoTeste,
                200.00
            );

        console.log("Saldo atualizado:", atualizado);


        const saldoAtualizado =
            await infrastructure.buscarCreditoPorAluno(idAlunoTeste);

        console.log("Novo saldo:");
        console.log(saldoAtualizado);


        // ==========================================
        // 9 - EXCLUIR CONTA DE CRÉDITO
        // ==========================================

        console.log("\n--- EXCLUIR CRÉDITO ---");

        const excluido =
            await infrastructure.excluirCredito(idCredito);

        console.log("Conta excluída:", excluido);


        // ==========================================
        // 10 - VERIFICAR EXCLUSÃO
        // ==========================================

        console.log("\n--- VERIFICAR EXCLUSÃO ---");

        const verificarExclusao =
            await infrastructure.buscarCreditoPorId(idCredito);

        console.log(verificarExclusao);

        if (verificarExclusao === null) {
            console.log("Conta de crédito excluída corretamente.");
        }


        console.log("\n--- TESTES FINALIZADOS ---");


    } catch (erro) {

        console.error("\nErro no teste:");
        console.error(erro);

    } finally {

        await pool.end();

    }
}


// Executa os testes apenas quando este arquivo
// for executado diretamente
if (require.main === module) {
    testar();
}