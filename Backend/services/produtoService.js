const produtosInfrastructure = require('../infrastructure/produtosInfrastructure');
const Produto = require('../models/entidades/produtos');
const categoriaInfrastructure = require('../infrastructure/categoriaInfrastructure');

class ProdutosService {

    // LISTAR TODOS OS PRODUTOS
    async listarProdutos() {
        try {
            const produtos = await produtosInfrastructure.listarProdutos();

            return produtos;

        } catch (error) {
            throw new Error(`Erro ao listar produtos: ${error.message}`);
        }
    }


    // CADASTRAR PRODUTO E ESTOQUE
    async cadastrarProduto(produto) {
        try {

            // VERIFICANDO SE A CATEGORIA EXISTE
            const categoria =
                await categoriaInfrastructure.buscarCategoriaPorID(
                    produto.id_categoria
                );

            // CRIANDO O OBJETO PRODUTO
            const novoProduto = new Produto(
                null,
                categoria,
                produto.nome_produto,
                produto.valor_unitario,
                produto.ativo
            );

            // CONVERTENDO OS DADOS DO ESTOQUE
            const quantidade = Number(produto.quantidade);
            const estoque_minimo = Number(produto.estoque_minimo);

            // VALIDANDO O ESTOQUE
            if (
                produto.quantidade === undefined ||
                produto.estoque_minimo === undefined ||
                !Number.isInteger(quantidade) ||
                !Number.isInteger(estoque_minimo) ||
                quantidade < 0 ||
                estoque_minimo < 0
            ) {
                throw new Error(
                    'A quantidade e o estoque mínimo devem ser números inteiros maiores ou iguais a zero.'
                );
            }

            // ORGANIZANDO OS DADOS PARA ENVIAR À INFRAESTRUTURA
            const dadosProduto = {
                id_categoria: categoria.id_categoria,
                nome_produto: novoProduto.nome_produto,
                valor_unitario: novoProduto.valor_unitario,
                ativo: novoProduto.ativo,
                quantidade: quantidade,
                estoque_minimo: estoque_minimo
            };

            // CADASTRANDO PRODUTO E ESTOQUE NO MYSQL
            const resposta =
                await produtosInfrastructure.cadastrarProduto(
                    dadosProduto
                );

            return resposta;

        } catch (error) {
            throw new Error(
                `Erro ao cadastrar produto: ${error.message}`
            );
        }
    }


    // DELETAR PRODUTO
    async deletarProduto(id) {
        try {

            const resposta =
                await produtosInfrastructure.deletarProduto(id);

            if (resposta > 0) {
                return `Produto com ID ${id} deletado com sucesso!`;

            } else {
                throw new Error(
                    `Produto com ID ${id} não encontrado.`
                );
            }

        } catch (error) {
            throw new Error(
                `Erro ao deletar produto: ${error.message}`
            );
        }
    }


    // BUSCAR PRODUTO PELO ID
    async buscarPorID(id) {
        try {

            const produto =
                await produtosInfrastructure.buscarPorID(id);

            if (!produto) {
                throw new Error(
                    `Produto com ID ${id} não encontrado.`
                );
            }

            return produto;

        } catch (error) {
            throw new Error(
                `Erro ao buscar produto: ${error.message}`
            );
        }
    }


    // ATUALIZAR PRODUTO E ESTOQUE
    async atualizarProduto(id, produto) {
        try {

            // VERIFICANDO SE A CATEGORIA EXISTE
            const categoria =
                await categoriaInfrastructure.buscarCategoriaPorID(
                    produto.id_categoria
                );

            // CRIANDO O OBJETO PRODUTO ATUALIZADO
            const produtoAtualizado = new Produto(
                id,
                categoria,
                produto.nome_produto,
                produto.valor_unitario,
                produto.ativo
            );

            // CONVERTENDO OS DADOS DO ESTOQUE
            const quantidade = Number(produto.quantidade);
            const estoque_minimo = Number(produto.estoque_minimo);

            // VALIDANDO O ESTOQUE
            if (
                produto.quantidade === undefined ||
                produto.estoque_minimo === undefined ||
                !Number.isInteger(quantidade) ||
                !Number.isInteger(estoque_minimo) ||
                quantidade < 0 ||
                estoque_minimo < 0
            ) {
                throw new Error(
                    'A quantidade e o estoque mínimo devem ser números inteiros maiores ou iguais a zero.'
                );
            }

            // ORGANIZANDO OS DADOS ATUALIZADOS
            const dadosProduto = {
                id_categoria: categoria.id_categoria,
                nome_produto: produtoAtualizado.nome_produto,
                valor_unitario: produtoAtualizado.valor_unitario,
                ativo: produtoAtualizado.ativo,
                quantidade: quantidade,
                estoque_minimo: estoque_minimo
            };

            // ATUALIZANDO PRODUTO E ESTOQUE NO MYSQL
            const resposta =
                await produtosInfrastructure.atualizarProduto(
                    id,
                    dadosProduto
                );

            if (resposta > 0) {
                return `Produto com ID ${id} atualizado com sucesso!`;

            } else {
                throw new Error(
                    `Produto com ID ${id} não encontrado.`
                );
            }

        } catch (error) {
            throw new Error(
                `Erro ao atualizar produto: ${error.message}`
            );
        }
    }

}


// FUNÇÃO PARA TESTAR O CADASTRO DIRETAMENTE PELO SERVICE
async function main() {
    try {

        const produtosService = new ProdutosService();

        const produto = {
            id_categoria: 1,
            nome_produto: "Produto Teste",
            valor_unitario: 10.0,
            ativo: true,
            quantidade: 30,
            estoque_minimo: 10
        };

        const resposta =
            await produtosService.cadastrarProduto(produto);

        console.log("ID do produto cadastrado:", resposta);

    } catch (error) {
        console.error(error.message);
    }
}


// EXECUTA O MAIN APENAS SE ESTE ARQUIVO FOR RODADO DIRETAMENTE
if (require.main === module) {
    main();
}

module.exports = ProdutosService;