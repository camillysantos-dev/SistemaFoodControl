import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  PageHeader,
  Card,
  Status,
  Button,
} from "../components/UI";

const produtosIniciais = [
  {
    id: 1,
    nome: "Pão de Queijo",
    categoria: "Salgados",
    preco: 3.5,
    estoque: 50,
    minimo: 10,
    ativo: true,
  },
  {
    id: 2,
    nome: "Coxinha",
    categoria: "Salgados",
    preco: 4,
    estoque: 8,
    minimo: 10,
    ativo: true,
  },
  {
    id: 3,
    nome: "Suco Natural",
    categoria: "Bebidas",
    preco: 6,
    estoque: 15,
    minimo: 10,
    ativo: true,
  },
  {
    id: 4,
    nome: "Chocolate",
    categoria: "Doces",
    preco: 3,
    estoque: 5,
    minimo: 10,
    ativo: true,
  },
  {
    id: 5,
    nome: "Refrigerante Lata",
    categoria: "Bebidas",
    preco: 5,
    estoque: 120,
    minimo: 20,
    ativo: true,
  },
];

function carregarProdutos() {
  const produtosSalvos =
    JSON.parse(localStorage.getItem("produtos")) || [];

  const lista =
    produtosSalvos.length > 0
      ? produtosSalvos
      : produtosIniciais;

  return lista.map((produto) => ({
    ...produto,
    estoque: Number(produto.estoque || 0),
    minimo: Number(produto.minimo ?? 10),
    ativo: produto.ativo !== false,
  }));
}

export default function Estoque() {
  const [produtos, setProdutos] = useState(
    carregarProdutos
  );

  const [pesquisa, setPesquisa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] =
    useState(false);
    
  useEffect(() => {
    function atualizarProdutos() {
      setProdutos(carregarProdutos());
    }

    window.addEventListener("focus", atualizarProdutos);
    window.addEventListener("storage", atualizarProdutos);

    return () => {
      window.removeEventListener(
        "focus",
        atualizarProdutos
      );

      window.removeEventListener(
        "storage",
        atualizarProdutos
      );
    };
  }, []);

  function salvarProdutos(listaAtualizada) {
    setProdutos(listaAtualizada);

    localStorage.setItem(
      "produtos",
      JSON.stringify(listaAtualizada)
    );
  }

  const categorias = [
    ...new Set(
      produtos.map((produto) => produto.categoria)
    ),
  ];

  const produtosFiltrados = produtos.filter(
    (produto) => {
      const correspondePesquisa = produto.nome
        .toLowerCase()
        .includes(pesquisa.toLowerCase().trim());

      const correspondeCategoria =
        categoria === "" ||
        produto.categoria === categoria;

      const estoqueBaixo =
        produto.estoque < produto.minimo;

      const correspondeStatus =
        status === "" ||
        (status === "baixo" && estoqueBaixo) ||
        (status === "normal" && !estoqueBaixo);

      return (
        correspondePesquisa &&
        correspondeCategoria &&
        correspondeStatus
      );
    }
  );

  const totalEstoque = produtos.reduce(
    (total, produto) =>
      total + Number(produto.estoque || 0),
    0
  );

  const totalEstoqueBaixo = produtos.filter(
    (produto) => produto.estoque < produto.minimo
  ).length;

  function editarProduto(produto) {
    const novaQuantidade = window.prompt(
      `Informe a nova quantidade de ${produto.nome}:`,
      produto.estoque
    );

    if (novaQuantidade === null) {
      return;
    }

    const quantidadeConvertida = Number(
      novaQuantidade.replace(",", ".")
    );

    if (
      novaQuantidade.trim() === "" ||
      Number.isNaN(quantidadeConvertida) ||
      quantidadeConvertida < 0
    ) {
      window.alert("Digite uma quantidade válida.");
      return;
    }

    const novoMinimo = window.prompt(
      `Informe o estoque mínimo de ${produto.nome}:`,
      produto.minimo
    );

    if (novoMinimo === null) {
      return;
    }

    const minimoConvertido = Number(
      novoMinimo.replace(",", ".")
    );

    if (
      novoMinimo.trim() === "" ||
      Number.isNaN(minimoConvertido) ||
      minimoConvertido < 0
    ) {
      window.alert(
        "Digite um estoque mínimo válido."
      );
      return;
    }

    const produtosAtualizados = produtos.map((item) =>
      item.id === produto.id
        ? {
            ...item,
            estoque: quantidadeConvertida,
            minimo: minimoConvertido,
          }
        : item
    );

    salvarProdutos(produtosAtualizados);
  }

  function excluirProduto(produto) {
    const desejaExcluir = window.confirm(
      `Deseja excluir o produto "${produto.nome}"?`
    );

    if (!desejaExcluir) {
      return;
    }

    const produtosAtualizados = produtos.filter(
      (item) => item.id !== produto.id
    );

    salvarProdutos(produtosAtualizados);
  }

  function limparFiltros() {
    setPesquisa("");
    setCategoria("");
    setStatus("");
  }

  return (
    <>
      <PageHeader
        title="Estoque"
        subtitle="Acompanhe o estoque dos produtos em tempo real."
      />

      <div className="stats">
        <Card>
          <small>Total em estoque</small>
          <strong>{totalEstoque} unidades</strong>
        </Card>

        <Card>
          <small>Produtos com estoque baixo</small>
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
              ? "Fechar filtros"
              : "Filtrar"}
          </Button>
        </div>

        {filtrosAbertos && (
          <div className="stock-filters">
            <select
              value={categoria}
              onChange={(event) =>
                setCategoria(event.target.value)
              }
            >
              <option value="">
                Todas as categorias
              </option>

              {categorias.map((nomeCategoria) => (
                <option
                  value={nomeCategoria}
                  key={nomeCategoria}
                >
                  {nomeCategoria}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="">
                Todos os status
              </option>

              <option value="normal">
                Estoque normal
              </option>

              <option value="baixo">
                Estoque baixo
              </option>
            </select>

            <Button
              secondary
              type="button"
              onClick={limparFiltros}
            >
              Limpar filtros
            </Button>
          </div>
        )}

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Estoque Mínimo</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map((produto) => {
                const estoqueBaixo =
                  produto.estoque < produto.minimo;

                return (
                  <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>{produto.categoria}</td>
                    <td>{produto.estoque}</td>
                    <td>{produto.minimo}</td>

                    <td>
                      <Status
                        type={
                          estoqueBaixo ? "warn" : "ok"
                        }
                      >
                        {estoqueBaixo
                          ? "Estoque baixo"
                          : "Normal"}
                      </Status>
                    </td>
                  </tr>
                );
              })}

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