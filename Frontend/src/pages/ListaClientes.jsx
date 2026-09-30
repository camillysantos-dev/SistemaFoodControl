import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { listarClientes, requisicao } from "../api/clientes";
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

  const [erro, setErro] = useState("");

  async function carregarClientes() {
    try {
      setClientes(await listarClientes());
      setErro("");
    } catch (falha) {
      setErro(`Erro ao carregar clientes: ${falha.message}`);
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = pesquisa.toLowerCase().trim();

    return (
      cliente.nome?.toLowerCase().includes(texto) ||
      cliente.ra?.toLowerCase().includes(texto) ||
      cliente.telefone?.toLowerCase().includes(texto) ||
      cliente.tipo_cliente?.toLowerCase().includes(texto)
    );
  });

  async function excluirCliente(id) {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await requisicao(`/clientes/${id}`, { method: "DELETE" });
      await carregarClientes();
    } catch (falha) {
      setErro(`Erro ao excluir cliente: ${falha.message}`);
    }
  }

  async function editarCredito(cliente) {
    if (!cliente.id_aluno) return window.alert("O crédito está disponível somente para alunos.");
    const entrada = window.prompt(`Informe o saldo de ${cliente.nome}:`, Number(cliente.credito).toFixed(2));
    if (entrada === null) return;
    const saldo = Number(entrada.replace(",", "."));
    if (!Number.isFinite(saldo) || saldo < 0) return window.alert("Digite um valor válido.");
    try {
      const diferenca = Number((saldo - Number(cliente.credito)).toFixed(2));
      if (diferenca === 0) return;
      await requisicao(`/creditos/aluno/${cliente.id_aluno}/${diferenca > 0 ? "adicionar" : "remover"}`, {
        method: "PATCH", body: JSON.stringify({ valor: Math.abs(diferenca) }),
      });
      await carregarClientes();
    } catch (falha) {
      setErro(`Erro ao atualizar crédito: ${falha.message}`);
    }
  }

  return (
    <>
      <PageHeader
        title="Lista de Clientes"
        subtitle="Consulte e gerencie os clientes cadastrados."
      />

      <Card>
        {erro && <p className="form-message error">{erro}</p>}
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
                <tr key={cliente.id_cliente}>
                  <td>{cliente.nome}</td>

                  <td>
                    <Status type="ok">
                      {cliente.tipo_cliente}
                    </Status>
                  </td>

                  <td>{cliente.ra || "—"}</td>
                  <td>{cliente.responsavel || "—"}</td>
                  <td>{cliente.telefone || "—"}</td>

                  <td>
                    {cliente.tipo_cliente === "Aluno"
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
                          excluirCliente(cliente.id_cliente)
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
