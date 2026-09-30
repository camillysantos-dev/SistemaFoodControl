const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API}${caminho}`, {
    ...opcoes,
    headers: { "Content-Type": "application/json", ...opcoes.headers },
  });
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) throw new Error(dados?.erro || dados?.mensagem || `Erro HTTP ${resposta.status}`);
  return dados;
}

export const listarClientes = () => requisicao("/clientes");
export const obterHistorico = (idAluno) => requisicao(`/creditos/aluno/${idAluno}/movimentacoes`);
