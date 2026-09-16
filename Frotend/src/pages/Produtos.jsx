import { useState } from "react";
import {
  Pencil,
  Trash2,
  Power,
  X,
} from "lucide-react";

import {
  PageHeader,
  Card,
  Status,
  Button,
  money,
} from "../components/UI";

const produtosIniciais = [
  {
    id: 1,
    nome: "Pão de Queijo",
    categoria: "Salgados",
    preco: 3.5,
    estoque: 50,
    ativo: true,
  },
  {
    id: 2,
    nome: "Coxinha",
    categoria: "Salgados",
    preco: 4,
    estoque: 8,
    ativo: true,
  },
  {
    id: 3,
    nome: "Suco Natural",
    categoria: "Bebidas",
    preco: 6,
    estoque: 15,
    ativo: true,
  },
  {
    id: 4,
    nome: "Chocolate",
    categoria: "Doces",
    preco: 3,
    estoque: 5,
    ativo: true,
  },
  {
    id: 5,
    nome: "Refrigerante Lata",
    categoria: "Bebidas",
    preco: 5,
    estoque: 120,
    ativo: true,
  },
];

const formularioInicial = {
  nome: "",
  categoria: "",
  preco: "",
  estoque: "",
  ativo: true,
};

export default function Produtos() {
  const [produtos, setProdutos] = useState(() => {
    const produtosSalvos = localStorage.getItem("produtos");

    return produtosSalvos
      ? JSON.parse(produtosSalvos)
      : produtosIniciais;
  });

  const [formulario, setFormulario] =
    useState(formularioInicial);

  const [formularioAberto, setFormularioAberto] =
    useState(false);

  const [produtoEmEdicao, setProdutoEmEdicao] =
    useState(null);

  const [pesquisa, setPesquisa] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] =
    useState("");

  const [statusFiltro, setStatusFiltro] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] =
    useState(false);

  const [mensagem, setMensagem] = useState("");

  const categorias = [
    ...new Set(produtos.map((produto) => produto.categoria)),
  ];

  const produtosFiltrados = produtos.filter((produto) => {
    const correspondePesquisa = produto.nome
      .toLowerCase()
      .includes(pesquisa.toLowerCase().trim());

    const correspondeCategoria =
      categoriaFiltro === "" ||
      produto.categoria === categoriaFiltro;

    const correspondeStatus =
      statusFiltro === "" ||
      (statusFiltro === "ativo" && produto.ativo) ||
      (statusFiltro === "inativo" && !produto.ativo);

    return (
      correspondePesquisa &&
      correspondeCategoria &&
      correspondeStatus
    );
  });

  const totalCategorias = categorias.length;

  const totalEstoqueBaixo = produtos.filter(
    (produto) => produto.estoque < 10
  ).length;

  function salvarNoLocalStorage(listaAtualizada) {
    localStorage.setItem(
      "produtos",
      JSON.stringify(listaAtualizada)
    );
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;

    setFormulario((formularioAtual) => ({
      ...formularioAtual,
      [name]: value,
    }));
  }

  function abrirNovoProduto() {
    setProdutoEmEdicao(null);
    setFormulario(formularioInicial);
    setFormularioAberto(true);
    setMensagem("");
  }

  function fecharFormulario() {
    setFormularioAberto(false);
    setProdutoEmEdicao(null);
    setFormulario(formularioInicial);
  }

  function salvarProduto(event) {
    event.preventDefault();

    const precoConvertido = Number(
      String(formulario.preco).replace(",", ".")
    );

    const estoqueConvertido = Number(formulario.estoque);

    if (
      !formulario.nome.trim() ||
      !formulario.categoria.trim() ||
      Number.isNaN(precoConvertido) ||
      precoConvertido <= 0 ||
      Number.isNaN(estoqueConvertido) ||
      estoqueConvertido < 0
    ) {
      setMensagem("Preencha os dados corretamente.");
      return;
    }

    if (produtoEmEdicao) {
      const produtosAtualizados = produtos.map((produto) =>
        produto.id === produtoEmEdicao.id
          ? {
              ...produto,
              nome: formulario.nome.trim(),
              categoria: formulario.categoria,
              preco: precoConvertido,
              estoque: estoqueConvertido,
            }
          : produto
      );

      setProdutos(produtosAtualizados);
      salvarNoLocalStorage(produtosAtualizados);
      setMensagem("Produto atualizado com sucesso!");
    } else {
      const novoProduto = {
        id: Date.now(),
        nome: formulario.nome.trim(),
        categoria: formulario.categoria,
        preco: precoConvertido,
        estoque: estoqueConvertido,
        ativo: true,
      };

      const produtosAtualizados = [
        ...produtos,
        novoProduto,
      ];

      setProdutos(produtosAtualizados);
      salvarNoLocalStorage(produtosAtualizados);
      setMensagem("Produto cadastrado com sucesso!");
    }

    setFormulario(formularioInicial);
    setProdutoEmEdicao(null);
    setFormularioAberto(false);

    setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  function editarProduto(produto) {
    setProdutoEmEdicao(produto);

    setFormulario({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      estoque: produto.estoque,
      ativo: produto.ativo,
    });

    setFormularioAberto(true);
    setMensagem("");
  }

  function excluirProduto(produto) {
    const desejaExcluir = window.confirm(
      `Deseja realmente excluir "${produto.nome}"?`
    );

    if (!desejaExcluir) {
      return;
    }

    const produtosAtualizados = produtos.filter(
      (item) => item.id !== produto.id
    );

    setProdutos(produtosAtualizados);
    salvarNoLocalStorage(produtosAtualizados);

    setMensagem("Produto excluído com sucesso!");

    setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  function alterarStatus(produto) {
    const produtosAtualizados = produtos.map((item) =>
      item.id === produto.id
        ? { ...item, ativo: !item.ativo }
        : item
    );

    setProdutos(produtosAtualizados);
    salvarNoLocalStorage(produtosAtualizados);
  }

  function limparFiltros() {
    setPesquisa("");
    setCategoriaFiltro("");
    setStatusFiltro("");
  }

  return (
    <>
      <PageHeader
        title="Produtos"
        subtitle="Cadastre, edite e gerencie os produtos da cantina."
        action={
          <Button
            type="button"
            onClick={abrirNovoProduto}
          >
            + Novo Produto
          </Button>
        }
      />

      {mensagem && (
        <div
          className={`form-message ${
            mensagem.includes("corretamente")
              ? "error"
              : "success"
          }`}
        >
          {mensagem}
        </div>
      )}

      {formularioAberto && (
        <Card>
          <div className="row-between">
            <h2>
              {produtoEmEdicao
                ? "Editar Produto"
                : "Novo Produto"}
            </h2>

            <button
              type="button"
              className="close-button"
              onClick={fecharFormulario}
              title="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={salvarProduto}>
            <div className="form-grid">
              <label className="field">
                Nome do produto <b>*</b>

                <input
                  type="text"
                  name="nome"
                  value={formulario.nome}
                  onChange={atualizarCampo}
                  placeholder="Digite o nome do produto"
                  required
                />
              </label>

              <label className="field">
                Categoria <b>*</b>

                <select
                  name="categoria"
                  value={formulario.categoria}
                  onChange={atualizarCampo}
                  required
                >
                  <option value="">
                    Selecione a categoria
                  </option>

                  <option value="Salgados">
                    Salgados
                  </option>

                  <option value="Bebidas">
                    Bebidas
                  </option>

                  <option value="Doces">
                    Doces
                  </option>

                  <option value="Lanches">
                    Lanches
                  </option>

                  <option value="Outros">
                    Outros
                  </option>
                </select>
              </label>

              <label className="field">
                Preço <b>*</b>

                <input
                  type="text"
                  name="preco"
                  value={formulario.preco}
                  onChange={atualizarCampo}
                  placeholder="Ex.: 3,50"
                  required
                />
              </label>

              <label className="field">
                Estoque inicial <b>*</b>

                <input
                  type="number"
                  name="estoque"
                  min="0"
                  value={formulario.estoque}
                  onChange={atualizarCampo}
                  placeholder="Digite a quantidade"
                  required
                />
              </label>
            </div>

            <div className="actions">
              <Button
                secondary
                type="button"
                onClick={fecharFormulario}
              >
                Cancelar
              </Button>

              <Button type="submit">
                {produtoEmEdicao
                  ? "Salvar Alterações"
                  : "Cadastrar Produto"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="stats">
        <Card>
          <small>Total de Produtos</small>
          <strong>{produtos.length}</strong>
        </Card>

        <Card>
          <small>Categorias</small>
          <strong>{totalCategorias}</strong>
        </Card>

        <Card>
          <small>Mais Vendido</small>
          <strong>Pão de Queijo</strong>
        </Card>

        <Card>
          <small>Estoque Baixo</small>
          <strong>{totalEstoqueBaixo}</strong>
        </Card>
      </div>

      <Card>
        <div className="toolbar">
          <input
            type="search"
            value={pesquisa}
            onChange={(event) =>
              setPesquisa(event.target.value)
            }
            placeholder="Buscar produto..."
          />

          <Button
            secondary
            type="button"
            onClick={() =>
              setFiltrosAbertos(!filtrosAbertos)
            }
          >
            {filtrosAbertos
              ? "Fechar Filtros"
              : "Filtrar"}
          </Button>
        </div>

        {filtrosAbertos && (
          <div className="product-filters">
            <select
              value={categoriaFiltro}
              onChange={(event) =>
                setCategoriaFiltro(event.target.value)
              }
            >
              <option value="">
                Todas as categorias
              </option>

              {categorias.map((categoria) => (
                <option
                  value={categoria}
                  key={categoria}
                >
                  {categoria}
                </option>
              ))}
            </select>

            <select
              value={statusFiltro}
              onChange={(event) =>
                setStatusFiltro(event.target.value)
              }
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>

            <Button
              secondary
              type="button"
              onClick={limparFiltros}
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria}</td>
                  <td>{money(produto.preco)}</td>
                  <td>{produto.estoque}</td>

                  <td>
                    <Status
                      type={produto.ativo ? "ok" : "bad"}
                    >
                      {produto.ativo ? "Ativo" : "Inativo"}
                    </Status>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="action-button edit"
                        title="Editar produto"
                        onClick={() =>
                          editarProduto(produto)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className={`action-button ${
                          produto.ativo
                            ? "disable"
                            : "enable"
                        }`}
                        title={
                          produto.ativo
                            ? "Desativar produto"
                            : "Ativar produto"
                        }
                        onClick={() =>
                          alterarStatus(produto)
                        }
                      >
                        <Power size={16} />
                      </button>

                      <button
                        type="button"
                        className="action-button delete"
                        title="Excluir produto"
                        onClick={() =>
                          excluirProduto(produto)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {produtosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="empty-table"
                  >
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}