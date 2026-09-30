import { useState } from "react";
import { requisicao } from "../api/clientes";
import { PageHeader, Card, Field, Button } from "../components/UI";

const formularioInicial = {
    nome: "",
    tipoCliente: "",
    ra: "",
    turma: "",
    telefoneResponsavel: "",
    responsavel: "",
    parentesco: "",
    telefone: "",
    observacoes: "",
};

export default function CadastrarCliente() {
    const [formulario, setFormulario] = useState(formularioInicial);
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);

    function atualizarCampo(event) {
        const { name, value } = event.target;

        setFormulario((dadosAnteriores) => ({
            ...dadosAnteriores,
            [name]: value,
        }));
    }

    function alterarTipoCliente(event) {
        const novoTipo = event.target.value;

        setFormulario((dadosAnteriores) => ({
            ...dadosAnteriores,
            tipoCliente: novoTipo,
            ra: novoTipo === "aluno" ? dadosAnteriores.ra : "",
            turma: novoTipo === "aluno" ? dadosAnteriores.turma : "",
            telefoneResponsavel: novoTipo === "aluno" ? dadosAnteriores.telefoneResponsavel : "",
            responsavel:
                novoTipo === "aluno" ? dadosAnteriores.responsavel : "",
            parentesco: novoTipo === "aluno" ? dadosAnteriores.parentesco : "",
        }));
    }

    function limparFormulario() {
        setFormulario(formularioInicial);
        setMensagem("");
    }

    async function salvarCliente(event) {
        event.preventDefault();
        if (formulario.tipoCliente === "aluno" &&
            (!formulario.ra.trim() || !formulario.responsavel.trim() || !formulario.telefoneResponsavel.trim())) {
            setMensagem("Preencha RA, responsável e telefone do responsável.");
            return;
        }
        setSalvando(true);
        setMensagem("");
        try {
            await requisicao("/clientes", {
                method: "POST",
                body: JSON.stringify({
                    nome: formulario.nome.trim(),
                    tipo_cliente: ({ aluno: "Aluno", professor: "Professor", funcionario: "Funcionário", visitante: "Visitante" })[formulario.tipoCliente],
                    telefone: formulario.telefone.trim(),
                    observacoes: formulario.observacoes.trim(),
                    ra: formulario.ra.trim(),
                    turma: formulario.turma.trim(),
                    responsavel: formulario.responsavel.trim(),
                    telefone_responsavel: formulario.telefoneResponsavel.trim(),
                    parentesco: formulario.parentesco,
                }),
            });
            setFormulario(formularioInicial);
            setMensagem("Cliente cadastrado com sucesso!");
        } catch (erro) {
            setMensagem(`Não foi possível cadastrar: ${erro.message}`);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Cadastrar Cliente"
                subtitle="Preencha os dados para cadastrar um novo cliente."
            />

            <Card>
                <form onSubmit={salvarCliente}>
                    <div className="form-grid">
                        <Field label="Nome completo" required>
                            <input
                                type="text"
                                name="nome"
                                value={formulario.nome}
                                onChange={atualizarCampo}
                                placeholder="Digite o nome completo"
                                required
                            />
                        </Field>

                        <Field label="Categoria do cliente" required>
                            <select
                                name="tipoCliente"
                                value={formulario.tipoCliente}
                                onChange={alterarTipoCliente}
                                required
                            >
                                <option value="">Selecione o tipo</option>
                                <option value="aluno">Aluno</option>
                                <option value="professor">Professor</option>
                                <option value="funcionario">Funcionário</option>
                                <option value="visitante">Visitante</option>
                            </select>
                        </Field>

                        {formulario.tipoCliente === "aluno" && (
                            <>
                                <Field label="RA" required>
                                    <input
                                        type="text"
                                        name="ra"
                                        value={formulario.ra}
                                        onChange={atualizarCampo}
                                        placeholder="Digite o RA"
                                        required
                                    />
                                </Field>

                                <Field label="Turma">
                                    <input name="turma" value={formulario.turma} onChange={atualizarCampo} placeholder="Turma do aluno" />
                                </Field>
                                <Field label="Responsável" required>
                                    <input
                                        type="text"
                                        name="responsavel"
                                        value={formulario.responsavel}
                                        onChange={atualizarCampo}
                                        placeholder="Nome do responsável"
                                        required
                                    />
                                </Field>

                                <Field label="Parentesco">
                                    <select
                                        name="parentesco"
                                        value={formulario.parentesco}
                                        onChange={atualizarCampo}
                                    >
                                        <option value="">Selecione o parentesco</option>
                                        <option value="Mãe">Mãe</option>
                                        <option value="Pai">Pai</option>
                                        <option value="Avó">Avó</option>
                                        <option value="Avô">Avô</option>
                                        <option value="Tia">Tia</option>
                                        <option value="Tio">Tio</option>
                                        <option value="Responsável legal">Responsável legal</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </Field>

                                <Field label="Telefone do responsável" required>
                                    <input type="tel" name="telefoneResponsavel" value={formulario.telefoneResponsavel} onChange={atualizarCampo} required />
                                </Field>
                            </>
                        )}

                        <Field label="Telefone" required>
                            <input
                                type="tel"
                                name="telefone"
                                value={formulario.telefone}
                                onChange={atualizarCampo}
                                placeholder="(11) 91234-5678"
                                required
                            />
                        </Field>

                        <Field label="Observações">
                            <textarea
                                name="observacoes"
                                value={formulario.observacoes}
                                onChange={atualizarCampo}
                                placeholder="Digite informações adicionais..."
                            />
                        </Field>
                    </div>

                    {mensagem && (
                        <p
                            className={
                                mensagem.includes("sucesso")
                                    ? "form-message success"
                                    : "form-message error"
                            }
                        >
                            {mensagem}
                        </p>
                    )}

                    <div className="actions">
                        <Button
                            secondary
                            type="button"
                            onClick={limparFormulario}
                        >
                            Limpar
                        </Button>

                        <Button type="submit" disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
}
