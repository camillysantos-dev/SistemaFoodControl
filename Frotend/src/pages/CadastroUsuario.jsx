import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function cadastrar(event) {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    const usuarioFormatado = usuario.trim().toLowerCase();
    const emailFormatado = email.trim().toLowerCase();
    const usuariosCadastrados =
      JSON.parse(localStorage.getItem("usuariosFoodControl")) || [];

    const cadastroExistente = usuariosCadastrados.some(
      (item) =>
        item.usuario === usuarioFormatado || item.email === emailFormatado
    );

    if (cadastroExistente) {
      setErro("Esse usuário ou e-mail já está cadastrado.");
      return;
    }

    usuariosCadastrados.push({
      id: Date.now(),
      nome: nome.trim(),
      email: emailFormatado,
      telefone: telefone.trim(),
      usuario: usuarioFormatado,
      senha,
    });

    localStorage.setItem(
      "usuariosFoodControl",
      JSON.stringify(usuariosCadastrados)
    );

    navigate("/login");
  }

  return (
    <main className="user-register-page">
      <aside className="user-register-panel">
        <div>
          <h1>Food<span>Control</span></h1>
          <div className="user-register-line" />
          <p>Mais organização<br />para a sua cantina.</p>
        </div>

        <div className="user-register-message">
          Comida boa gera grandes histórias!
        </div>
      </aside>

      <section className="user-register-content">
        <div className="user-register-login">
          Já tem uma conta?
          <button type="button" onClick={() => navigate("/login")}>Entrar</button>
        </div>

        <form className="user-register-card" onSubmit={cadastrar}>
          <header className="user-register-header">
            <h2>Food<span>Control</span></h2>
            <div className="user-register-title-line" />
            <h3>Crie sua conta</h3>
            <p>Preencha os dados abaixo para começar a usar o sistema.</p>
          </header>

          <div className="user-register-grid">
            <label className="user-register-field user-register-full">
              Nome completo <b>*</b>
              <span className="user-register-input">
                <UserRound size={22} />
                <input
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                />
              </span>
            </label>

            <label className="user-register-field">
              E-mail <b>*</b>
              <span className="user-register-input">
                <Mail size={22} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                />
              </span>
            </label>

            <label className="user-register-field">
              Telefone (opcional)
              <span className="user-register-input">
                <Phone size={22} />
                <input
                  type="tel"
                  value={telefone}
                  onChange={(event) => setTelefone(event.target.value)}
                  placeholder="(11) 91234-5678"
                />
              </span>
            </label>

            <label className="user-register-field">
              Nome de usuário <b>*</b>
              <span className="user-register-input">
                <UserRound size={22} />
                <input
                  type="text"
                  value={usuario}
                  onChange={(event) => setUsuario(event.target.value)}
                  placeholder="Escolha um nome de usuário"
                  required
                />
              </span>
            </label>

            <label className="user-register-field">
              Senha <b>*</b>
              <span className="user-register-input">
                <LockKeyhole size={22} />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                  minLength={4}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label="Mostrar ou ocultar senha"
                >
                  {mostrarSenha ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </span>
            </label>

            <label className="user-register-field user-register-full">
              Confirmar senha <b>*</b>
              <span className="user-register-input">
                <LockKeyhole size={22} />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  placeholder="Confirme sua senha"
                  minLength={4}
                  required
                />
              </span>
            </label>
          </div>

          {erro && <p className="user-register-error">{erro}</p>}

          <button className="user-register-submit" type="submit">
            Criar usuário
            <ArrowRight size={24} />
          </button>
        </form>
      </section>
    </main>
  );
}
