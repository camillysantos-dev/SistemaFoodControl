import { useState } from "react";
import { PageHeader, Card, Field, Button } from "../components/UI";

const formularioInicial = {
    nome: "",
    tipoCliente: "",
    ra: "",
    responsavel: "",
    telefone: "",
    observacoes: "",
};

export default function CadastrarCliente() {
    const [formulario, setFormulario] = useState(formularioInicial);
    const [mensagem, setMensagem] = useState("");

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
            responsavel:
                novoTipo === "aluno" ? dadosAnteriores.responsavel : "",
        }));
    }

    function limparFormulario() {
        setFormulario(formularioInicial);
        setMensagem("");
    }

    function salvarCliente(event) {
        event.preventDefault();

        if (
            formulario.tipoCliente === "aluno" &&
            (!formulario.ra.trim() || !formulario.responsavel.trim())
        ) {
            setMensagem("Preencha o RA e o responsável do aluno.");
            return;
        }

        const clientesSalvos =
            JSON.parse(localStorage.getItem("clientes")) || [];

        const novoCliente = {
            id: Date.now(),
            ...formulario,
            dataCadastro: new Date().toISOString(),
        };

        localStorage.setItem(
            "clientes",
            JSON.stringify([...clientesSalvos, novoCliente])
        );

        setFormulario(formularioInicial);
        setMensagem("Cliente cadastrado com sucesso!");

        setMensagem("Cliente cadastrado com sucesso!");

        setTimeout(() => {
            setMensagem("");
        }, 2000);
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

                        <Button type="submit">
                            Salvar
                        </Button>
                    </div>
                </form>
            </Card>
        </>
    );
}