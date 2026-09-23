import { useState } from "react";
import {
  PageHeader,
  Card,
  Button,
  Status,
  money,
} from "../components/UI";

export default function CreditoAluno() {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] =
    useState(null);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [movimentacoes, setMovimentacoes] = useState(() => {
    return (
      JSON.parse(
        localStorage.getItem("movimentacoesCredito")
      ) || []
    );
  });

  function exibirMensagem(texto, tipo) {
    setMensagem(texto);
    setTipoMensagem(tipo);

    setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
  }

  function buscarAluno() {
    const texto = pesquisa.toLowerCase().trim();

    if (!texto) {
      setResultados([]);
      exibirMensagem(
        "Digite o nome, RA ou turma do aluno.",
        "error"
      );
      return;
    }

    const clientes =
      JSON.parse(localStorage.getItem("clientes")) || [];

    const alunosEncontrados = clientes.filter((cliente) => {
      const tipoCliente =
        cliente.tipoCliente?.toLowerCase();

      const correspondePesquisa =
        cliente.nome?.toLowerCase().includes(texto) ||
        cliente.ra?.toLowerCase().includes(texto) ||
        cliente.turma?.toLowerCase().includes(texto);

      return (
        tipoCliente === "aluno" &&
        correspondePesquisa
      );
    });

    setResultados(alunosEncontrados);

    if (alunosEncontrados.length === 0) {
      exibirMensagem(
        "Nenhum aluno encontrado.",
        "error"
      );
    }
  }

  function selecionarAluno(aluno) {
    setAlunoSelecionado({
      ...aluno,
      credito: Number(aluno.credito || 0),
    });

    setResultados([]);
    setPesquisa("");
    setMensagem("");
  }

  function atualizarCreditoAluno(
    valor,
    tipo,
    descricao
  ) {
    if (!alunoSelecionado) {
      exibirMensagem(
        "Selecione um aluno primeiro.",
        "error"
      );
      return;
    }

    const saldoAtual = Number(
      alunoSelecionado.credito || 0
    );

    const novoSaldo =
      tipo === "credito"
        ? saldoAtual + valor
        : saldoAtual - valor;

    if (novoSaldo < 0) {
      exibirMensagem(
        "O aluno não possui saldo suficiente.",
        "error"
      );
      return;
    }

    const clientes =
      JSON.parse(localStorage.getItem("clientes")) || [];

    const clientesAtualizados = clientes.map((cliente) =>
      cliente.id === alunoSelecionado.id
        ? {
            ...cliente,
            credito: novoSaldo,
          }
        : cliente
    );

    localStorage.setItem(
      "clientes",
      JSON.stringify(clientesAtualizados)
    );

    const novaMovimentacao = {
      id: Date.now(),
      clienteId: alunoSelecionado.id,
      data: new Date().toLocaleDateString("pt-BR"),
      descricao,
      tipo,
      valor,
      saldo: novoSaldo,
    };

    const movimentacoesAtualizadas = [
      novaMovimentacao,
      ...movimentacoes,
    ];

    localStorage.setItem(
      "movimentacoesCredito",
      JSON.stringify(movimentacoesAtualizadas)
    );

    setMovimentacoes(movimentacoesAtualizadas);

    setAlunoSelecionado((alunoAtual) => ({
      ...alunoAtual,
      credito: novoSaldo,
    }));

    exibirMensagem(
      tipo === "credito"
        ? "Crédito adicionado com sucesso!"
        : "Crédito removido com sucesso!",
      "success"
    );
  }

  function adicionarCredito() {
    if (!alunoSelecionado) {
      exibirMensagem(
        "Busque e selecione um aluno primeiro.",
        "error"
      );
      return;
    }

    const valorDigitado = window.prompt(
      "Digite o valor que deseja adicionar:"
    );

    if (valorDigitado === null) {
      return;
    }

    const valor = Number(
      valorDigitado.replace(",", ".")
    );

    if (Number.isNaN(valor) || valor <= 0) {
      exibirMensagem(
        "Digite um valor válido.",
        "error"
      );
      return;
    }

    atualizarCreditoAluno(
      valor,
      "credito",
      "Recarga via Cantina"
    );
  }

  function removerCredito() {
    if (!alunoSelecionado) {
      exibirMensagem(
        "Busque e selecione um aluno primeiro.",
        "error"
      );
      return;
    }

    const valorDigitado = window.prompt(
      "Digite o valor que deseja remover:"
    );

    if (valorDigitado === null) {
      return;
    }

    const valor = Number(
      valorDigitado.replace(",", ".")
    );

    if (Number.isNaN(valor) || valor <= 0) {
      exibirMensagem(
        "Digite um valor válido.",
        "error"
      );
      return;
    }

    atualizarCreditoAluno(
      valor,
      "debito",
      "Remoção de crédito"
    );
  }

  const historicoAluno = alunoSelecionado
    ? movimentacoes.filter(
        (movimentacao) =>
          movimentacao.clienteId === alunoSelecionado.id
      )
    : [];

  return (
    <>
      <PageHeader
        title="Crédito do Aluno"
        subtitle="Adicione, remova ou consulte o saldo de crédito do aluno."
      />

      {mensagem && (
        <div
          className={`form-message ${tipoMensagem}`}
        >
          {mensagem}
        </div>
      )}

      <Card>
        <div className="toolbar">
          <input
            type="search"
            value={pesquisa}
            onChange={(event) =>
              setPesquisa(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                buscarAluno();
              }
            }}
            placeholder="Digite o nome, RA ou turma..."
          />

          <Button
            type="button"
            onClick={buscarAluno}
          >
            Buscar
          </Button>
        </div>

        {resultados.length > 0 && (
          <div className="credit-search-results">
            {resultados.map((aluno) => (
              <button
                type="button"
                className="student-result"
                key={aluno.id}
                onClick={() => selecionarAluno(aluno)}
              >
                <div className="avatar big">
                  {aluno.nome?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <b>{aluno.nome}</b>

                  <small>
                    RA: {aluno.ra || "Não informado"}
                    {aluno.turma
                      ? ` | ${aluno.turma}`
                      : ""}
                  </small>

                  <em>
                    Saldo:{" "}
                    {money(Number(aluno.credito || 0))}
                  </em>
                </div>
              </button>
            ))}
          </div>
        )}

        {alunoSelecionado ? (
          <>
            <div className="credit-box">
              <div>
                <h2>{alunoSelecionado.nome}</h2>

                <p>
                  RA:{" "}
                  {alunoSelecionado.ra ||
                    "Não informado"}

                  {alunoSelecionado.turma
                    ? ` | ${alunoSelecionado.turma}`
                    : ""}
                </p>

                <Status
                  type={
                    alunoSelecionado.ativo === false
                      ? "bad"
                      : "ok"
                  }
                >
                  {alunoSelecionado.ativo === false
                    ? "Aluno inativo"
                    : "Aluno ativo"}
                </Status>
              </div>

              <div>
                <small>Saldo Atual</small>

                <strong>
                  {money(
                    Number(
                      alunoSelecionado.credito || 0
                    )
                  )}
                </strong>
              </div>
            </div>

            <div className="actions left">
              <Button
                type="button"
                onClick={adicionarCredito}
              >
                + Adicionar Crédito
              </Button>

              <Button
                danger
                type="button"
                onClick={removerCredito}
              >
                − Remover Crédito
              </Button>
            </div>
          </>
        ) : (
          <div className="credit-empty">
            Busque e selecione um aluno para consultar o
            saldo.
          </div>
        )}
      </Card>

      <Card>
        <h2>Histórico de Movimentações</h2>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Saldo</th>
              </tr>
            </thead>

            <tbody>
              {historicoAluno.map((movimentacao) => (
                <tr key={movimentacao.id}>
                  <td>{movimentacao.data}</td>
                  <td>{movimentacao.descricao}</td>

                  <td>
                    <Status
                      type={
                        movimentacao.tipo === "debito"
                          ? "bad"
                          : "ok"
                      }
                    >
                      {movimentacao.tipo === "debito"
                        ? "Débito"
                        : "Crédito"}
                    </Status>
                  </td>

                  <td>
                    {movimentacao.tipo === "debito"
                      ? "− "
                      : "+ "}

                    {money(movimentacao.valor)}
                  </td>

                  <td>{money(movimentacao.saldo)}</td>
                </tr>
              ))}

              {!alunoSelecionado && (
                <tr>
                  <td
                    colSpan="5"
                    className="empty-table"
                  >
                    Selecione um aluno para visualizar o
                    histórico.
                  </td>
                </tr>
              )}

              {alunoSelecionado &&
                historicoAluno.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="empty-table"
                    >
                      Nenhuma movimentação encontrada.
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