import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  PageHeader,
  Card,
  Status,
  money,
} from "../components/UI";

export default function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  function carregarClientes() {
    const clientesSalvos =
      JSON.parse(localStorage.getItem("clientes")) || [];

    setClientes(clientesSalvos);
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = pesquisa.toLowerCase().trim();

    return (
      cliente.nome?.toLowerCase().includes(texto) ||
      cliente.ra?.toLowerCase().includes(texto) ||
      cliente.telefone?.toLowerCase().includes(texto) ||
      cliente.tipoCliente?.toLowerCase().includes(texto)
    );
  });

  function excluirCliente(id) {
    const desejaExcluir = window.confirm(
      "Deseja realmente excluir este cliente?"
    );

    if (!desejaExcluir) {
      return;
    }

    const clientesAtualizados = clientes.filter(
      (cliente) => cliente.id !== id
    );

    setClientes(clientesAtualizados);

    localStorage.setItem(
      "clientes",
      JSON.stringify(clientesAtualizados)
    );
  }

  function editarCredito(cliente) {
    if (cliente.tipoCliente !== "aluno") {
      window.alert(
        "O crédito está disponível somente para alunos."
      );
      return;
    }

    const novoCredito = window.prompt(
      `Informe o crédito de ${cliente.nome}:`,
      Number(cliente.credito || 0).toFixed(2)
    );

    if (novoCredito === null) {
      return;
    }

    const creditoConvertido = Number(
      novoCredito.replace(",", ".")
    );

    if (
      Number.isNaN(creditoConvertido) ||
      creditoConvertido < 0
    ) {
      window.alert("Digite um valor válido.");
      return;
    }

    const clientesAtualizados = clientes.map((item) =>
      item.id === cliente.id
        ? { ...item, credito: creditoConvertido }
        : item
    );

    setClientes(clientesAtualizados);

    localStorage.setItem(
      "clientes",
      JSON.stringify(clientesAtualizados)
    );
  }

  return (
    <>
      <PageHeader
        title="Lista de Clientes"
        subtitle="Consulte e gerencie os clientes cadastrados."
      />

      <Card>
        <div className="toolbar">
          <input
            type="search"
            value={pesquisa}
            onChange={(event) =>
              setPesquisa(event.target.value)
            }
            placeholder="Pesquisar por nome, RA ou telefone..."
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>RA</th>
                <th>Responsável</th>
                <th>Telefone</th>
                <th>Crédito</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>

                  <td>
                    <Status type="ok">
                      {cliente.tipoCliente}
                    </Status>
                  </td>

                  <td>{cliente.ra || "—"}</td>
                  <td>{cliente.responsavel || "—"}</td>
                  <td>{cliente.telefone || "—"}</td>

                  <td>
                    {cliente.tipoCliente === "aluno"
                      ? money(Number(cliente.credito || 0))
                      : "—"}
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="action-button edit"
                        title="Editar crédito"
                        onClick={() => editarCredito(cliente)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="action-button delete"
                        title="Excluir cliente"
                        onClick={() =>
                          excluirCliente(cliente.id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    Nenhum cliente encontrado.
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