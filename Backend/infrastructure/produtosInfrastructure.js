const { pool } = require('../config/db');

class ProdutosInfrastructure {

    async listarProdutos() {

        const [produtos] = await pool.query(`
            SELECT
                p.id_produto,
                p.id_categoria,
                p.nome_produto,
                p.valor_unitario,
                p.ativo,
                e.quantidade,
                e.estoque_minimo
            FROM produto p
            LEFT JOIN estoque e
                ON p.id_produto = e.id_produto
        `);
    
        return produtos;
    
    }

    async cadastrarProduto(produto) {

        const {
            id_categoria,
            nome_produto,
            valor_unitario,
            ativo,
            quantidade,
            estoque_minimo
        } = produto;

        const connection = await pool.getConnection();

        try {

            await connection.beginTransaction();

            // CADASTRANDO O PRODUTO
            const [result] = await connection.query(
                `INSERT INTO produto
                (id_categoria, nome_produto, valor_unitario, ativo)
                VALUES (?, ?, ?, ?)`,
                [
                    id_categoria,
                    nome_produto,
                    valor_unitario,
                    ativo
                ]
            );

            // PEGANDO O ID DO PRODUTO CADASTRADO
            const id_produto = result.insertId;

            // CADASTRANDO O ESTOQUE DO PRODUTO
            await connection.query(
                `INSERT INTO estoque
                (id_produto, quantidade, estoque_minimo)
                VALUES (?, ?, ?)`,
                [
                    id_produto,
                    quantidade,
                    estoque_minimo
                ]
            );

            // CONFIRMANDO AS DUAS OPERAÇÕES
            await connection.commit();

            return id_produto;

        } catch (error) {

            // DESFAZENDO AS OPERAÇÕES EM CASO DE ERRO
            await connection.rollback();

            throw error;

        } finally {

            // LIBERANDO A CONEXÃO COM O BANCO
            connection.release();

        }
    }

    async deletarProduto(id_produto) {
        const [result] = await pool.query(
            'DELETE FROM produto WHERE id_produto = ?',
            [id_produto]
        );

        return result.affectedRows;
    }

    async buscarPorID(id_produto) {
        const [rows] = await pool.query(
            'SELECT * FROM produto WHERE id_produto = ?',
            [id_produto]
        );

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
    }

    async atualizarProduto(id, produto) {

        const {
            id_categoria,
            nome_produto,
            valor_unitario,
            ativo,
            quantidade,
            estoque_minimo
        } = produto;
    
        const connection = await pool.getConnection();
    
        try {
            await connection.beginTransaction();
    
            const [produtos] = await connection.query(
                'SELECT id_produto FROM produto WHERE id_produto = ?',
                [id]
            );
    
            if (produtos.length === 0) {
                throw new Error(`Produto com ID ${id} não encontrado.`);
            }
    
            // ATUALIZANDO O PRODUTO
            const [resultadoProduto] = await connection.query(
                `UPDATE produto
                 SET id_categoria = ?,
                     nome_produto = ?,
                     valor_unitario = ?,
                     ativo = ?
                 WHERE id_produto = ?`,
                [
                    id_categoria,
                    nome_produto,
                    valor_unitario,
                    ativo,
                    id
                ]
            );
    
            // ATUALIZANDO O ESTOQUE
            const [resultadoEstoque] = await connection.query(
                `UPDATE estoque
                 SET quantidade = ?,
                     estoque_minimo = ?
                 WHERE id_produto = ?`,
                [
                    quantidade,
                    estoque_minimo,
                    id
                ]
            );
    
            if (resultadoEstoque.affectedRows === 0) {
                throw new Error(
                    `Estoque do produto com ID ${id} não encontrado.`
                );
            }
    
            await connection.commit();
    
            return resultadoProduto.affectedRows;
    
        } catch (error) {
    
            await connection.rollback();
            throw error;
    
        } finally {
    
            connection.release();
    
        }
    }
}

const produtosInfrastructure = new ProdutosInfrastructure();

module.exports = produtosInfrastructure;