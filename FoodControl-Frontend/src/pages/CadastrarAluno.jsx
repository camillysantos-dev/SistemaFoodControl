import { PageHeader, Card, Field, Button } from "../components/UI";

export default function CadastrarAluno() { 
    return <><PageHeader title="Cadastrar Aluno" subtitle="Preencha os dados para cadastrar um novo aluno." /><Card>
        <div className="form-grid">
        <Field label="Nome Completo" required><input placeholder="Digite o nome completo" /></Field>
        <Field label="RA"><input placeholder="Digite o RA" /></Field>
        <Field label="Turma"><select><option>Selecione a turma</option><option>1º Ano A</option><option>2º Ano B</option></select></Field>
        <Field label="Responsável"><input placeholder="Nome do responsável" /></Field><Field label="Telefone"><input placeholder="(11) 91234-5678" /></Field>
        <Field label="Categoria do cliente" required ><select><option>Selecione o tipo </option><option>Aluno</option><option>Professor</option><option>Funcionário</option><option>Visitante</option></select></Field>
        <Field label="Observações"><textarea placeholder="Digite informações adicionais..." />
        </Field></div><div className="actions"><Button secondary>Limpar</Button><Button>Salvar</Button>
        </div></Card></> }