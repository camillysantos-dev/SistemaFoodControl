import { useEffect, useState } from "react";
import {
  PageHeader,
  Card,
  Button,
  money,
} from "../components/UI";

const products = [
  ["Pão de Queijo", 3.5],
  ["Coxinha", 4],
  ["Suco Natural", 6],
  ["Chocolate", 3],
  ["Refrigerante Lata", 5],
];

export default function Venda() {
  const [cart, setCart] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] =
    useState(null);

  const [pesquisaCliente, setPesquisaCliente] = useState("");
  const [pesquisaProduto, setPesquisaProduto] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  function carregarClientes() {
    const clientesSalvos =
      JSON.parse(localStorage.getItem("clientes")) || [];

    setClientes(clientesSalvos);
  }

  const total = cart.reduce(
    (soma, produto) => soma + produto[1],
    0
  );

  const clientesFiltrados = clientes.filter((cliente) => {
    const pesquisa = pesquisaCliente.toLowerCase().trim();

    if (!pesquisa) {
      return false;
    }

    return (
      cliente.nome?.toLowerCase().includes(pesquisa) ||
      cliente.ra?.toLowerCase().includes(pesquisa) ||
      cliente.telefone?.toLowerCase().includes(pesquisa) ||
      cliente.tipoCliente?.toLowerCase().includes(pesquisa)
    );
  });

  const produtosFiltrados = products.filter((produto) =>
    produto[0]
      .toLowerCase()
      .includes(pesquisaProduto.toLowerCase().trim())
  );

  function exibirMensagem(texto, tipo) {
    setMensagem(texto);
    setTipoMensagem(tipo);

    setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
  }

  function selecionarCliente(cliente) {
    setClienteSelecionado(cliente);
    setPesquisaCliente("");
  }

  function adicionarProduto(produto) {
    setCart((carrinhoAtual) => [
      ...carrinhoAtual,
      produto,
    ]);
  }

  function removerProduto(indice) {
    setCart((carrinhoAtual) =>
      carrinhoAtual.filter(
        (_, indiceProduto) => indiceProduto !== indice
      )
    );
  }

  function limparVenda() {
    setCart([]);
    setFormaPagamento("");
    setMensagem("");
  }

  function finalizarVenda() {
    if (!clienteSelecionado) {
      exibirMensagem(
        "Selecione um cliente antes de finalizar a venda.",
        "error"
      );
      return;
    }

    if (cart.length === 0) {
      exibirMensagem(
        "Adicione pelo menos um produto.",
        "error"
      );
      return;
    }

    if (!formaPagamento) {
      exibirMensagem(
        "Selecione uma forma de pagamento.",
        "error"
      );
      return;
    }

    const creditoDisponivel = Number(
      clienteSelecionado.credito || 0
    );

    if (
      formaPagamento === "credito_aluno" &&
      clienteSelecionado.tipoCliente !== "aluno"
    ) {
      exibirMensagem(
        "O pagamento com saldo está disponível somente para alunos.",
        "error"
      );
      return;
    }

    if (
      formaPagamento === "credito_aluno" &&
      total > creditoDisponivel
    ) {
      exibirMensagem(
        "O aluno não possui crédito suficiente.",
        "error"
      );
      return;
    }

    const vendasSalvas =
      JSON.parse(localStorage.getItem("vendas")) || [];

    const novaVenda = {
      id: Date.now(),
      clienteId: clienteSelecionado.id,
      cliente: clienteSelecionado.nome,
      ra: clienteSelecionado.ra || "",
      produtos: cart.map((produto) => ({
        nome: produto[0],
        valor: produto[1],
        quantidade: 1,
      })),
      formaPagamento,
      total,
      dataVenda: new Date().toISOString(),
    };

    localStorage.setItem(
      "vendas",
      JSON.stringify([...vendasSalvas, novaVenda])
    );

    if (formaPagamento === "credito_aluno") {
      const clientesAtualizados = clientes.map((cliente) =>
        cliente.id === clienteSelecionado.id
          ? {
              ...cliente,
              credito:
                Number(cliente.credito || 0) - total,
            }
          : cliente
      );

      localStorage.setItem(
        "clientes",
        JSON.stringify(clientesAtualizados)
      );

      setClientes(clientesAtualizados);

      setClienteSelecionado((clienteAtual) => ({
        ...clienteAtual,
        credito:
          Number(clienteAtual.credito || 0) - total,
      }));
    }

    setCart([]);
    setFormaPagamento("");

    exibirMensagem(
      `Venda finalizada com sucesso! Total: ${money(total)}`,
      "success"
    );
  }

  return (
    <>
      <PageHeader
        title="Venda"
        subtitle="Selecione o cliente, adicione os produtos e finalize a venda."
      />

      {mensagem && (
        <div className={`form-message ${tipoMensagem}`}>
          {mensagem}
        </div>
      )}

      <div className="two-col">
        <Card>
          <h2>Selecionar Cliente</h2>

          <input
            type="search"
            value={pesquisaCliente}
            onChange={(event) =>
              setPesquisaCliente(event.target.value)
            }
            placeholder="Digite o nome, RA ou telefone..."
          />

          {pesquisaCliente.trim() !== "" && (
            <div className="client-results">
              {clientesFiltrados.map((cliente) => (
                <button
                  type="button"
                  className="student-result"
                  key={cliente.id}
                  onClick={() => selecionarCliente(cliente)}
                >
                  <div className="avatar big">
                    {cliente.nome?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <b>{cliente.nome}</b>

                    <small>
                      {cliente.tipoCliente === "aluno"
                        ? `RA: ${cliente.ra || "Não informado"}`
                        : `Tipo: ${cliente.tipoCliente}`}
                    </small>

                    {cliente.tipoCliente === "aluno" && (
                      <em>
                        Crédito disponível:{" "}
                        {money(Number(cliente.credito || 0))}
                      </em>
                    )}
                  </div>
                </button>
              ))}

              {clientesFiltrados.length === 0 && (
                <p className="empty-result">
                  Nenhum cliente encontrado.
                </p>
              )}
            </div>
          )}

          {clienteSelecionado && (
            <div className="student-mini selected-client">
              <div className="avatar big">
                {clienteSelecionado.nome
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <b>{clienteSelecionado.nome}</b>

                <small>
                  {clienteSelecionado.tipoCliente === "aluno"
                    ? `RA: ${
                        clienteSelecionado.ra ||
                        "Não informado"
                      }`
                    : `Tipo: ${
                        clienteSelecionado.tipoCliente
                      }`}
                </small>

                {clienteSelecionado.tipoCliente === "aluno" && (
                  <em>
                    Crédito disponível:{" "}
                    {money(
                      Number(
                        clienteSelecionado.credito || 0
                      )
                    )}
                  </em>
                )}
              </div>

              <button
                type="button"
                className="remove-client"
                title="Remover cliente"
                onClick={() => setClienteSelecionado(null)}
              >
                ×
              </button>
            </div>
          )}

          <h2>Pesquisar Produto</h2>

          <input
            type="search"
            value={pesquisaProduto}
            onChange={(event) =>
              setPesquisaProduto(event.target.value)
            }
            placeholder="Pesquisar produto..."
          />

          <table>
            <tbody>
              {produtosFiltrados.map((produto, indice) => (
                <tr key={indice}>
                  <td>{produto[0]}</td>
                  <td>{money(produto[1])}</td>

                  <td>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() =>
                        adicionarProduto(produto)
                      }
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}

              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="3" className="empty-table">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <Card>
          <div className="row-between">
            <h2>Itens da Venda</h2>

            <button
              type="button"
              className="link"
              onClick={limparVenda}
            >
              Limpar
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Valor</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {cart.map((produto, indice) => (
                <tr key={indice}>
                  <td>{produto[0]}</td>
                  <td>1</td>
                  <td>{money(produto[1])}</td>

                  <td>
                    <button
                      type="button"
                      className="trash"
                      onClick={() => removerProduto(indice)}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}

              {cart.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-table">
                    Nenhum produto adicionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="checkout">
            <div className="row-between">
              <b>Total da Venda</b>
              <strong>{money(total)}</strong>
            </div>

            <select
              value={formaPagamento}
              onChange={(event) =>
                setFormaPagamento(event.target.value)
              }
            >
              <option value="">
                Selecione a forma de pagamento
              </option>

              {clienteSelecionado?.tipoCliente === "aluno" && (
                <option value="credito_aluno">
                  Saldo do Aluno (Crédito)
                </option>
              )}

              <option value="pix">PIX</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="debito">
                Cartão de Débito
              </option>
              <option value="credito">
                Cartão de Crédito
              </option>
            </select>

            <Button
              type="button"
              onClick={finalizarVenda}
            >
              Finalizar Venda
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}