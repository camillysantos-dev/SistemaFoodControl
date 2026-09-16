import { useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  ShoppingCart,
  Package,
  Boxes,
  Users,
  BarChart3,
  Search,
  ChevronDown,
  UserPlus,
  LogOut,
} from "lucide-react";

const linkClass = ({ isActive }) =>
  `nav-link ${isActive ? "active" : ""}`;

export default function Layout() {
  const [clienteAberto, setClienteAberto] =
    useState(false);

  const [adminAberto, setAdminAberto] =
    useState(false);

  const navigate = useNavigate();

  function abrirCadastroUsuario() {
    setAdminAberto(false);
    navigate("/usuarios/cadastrar");
  }

  function sair() {
    const desejaSair = window.confirm(
      "Deseja realmente sair do sistema?"
    );

    if (!desejaSair) {
      return;
    }

    /*
     * Remove somente os dados de autenticação.
     * Clientes, produtos e vendas continuam salvos.
     */
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("token");

    setAdminAberto(false);
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          Food<span>Control</span>
        </div>

        <nav>
          <NavLink
            to="/venda"
            className={linkClass}
          >
            <ShoppingCart />
            Venda
          </NavLink>

          <NavLink
            to="/produtos"
            className={linkClass}
          >
            <Package />
            Produto
          </NavLink>

          <NavLink
            to="/estoque"
            className={linkClass}
          >
            <Boxes />
            Estoque
          </NavLink>

          <div className="nav-group">
            <button
              type="button"
              className="nav-group-title"
              onClick={() =>
                setClienteAberto(!clienteAberto)
              }
              aria-expanded={clienteAberto}
            >
              <span className="nav-group-label">
                <Users />
                Cliente
              </span>

              <ChevronDown
                size={15}
                className={`chevron ${
                  clienteAberto
                    ? "chevron-open"
                    : ""
                }`}
              />
            </button>

            {clienteAberto && (
              <div className="nav-submenu">
                <NavLink
                  to="/alunos/cadastrar"
                  className={linkClass}
                >
                  Cadastrar Cliente
                </NavLink>

                <NavLink
                  to="/alunos/credito"
                  className={linkClass}
                >
                  Crédito do Aluno
                </NavLink>

                <NavLink
                  to="/alunos/lista"
                  className={linkClass}
                >
                  Lista de Clientes
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/relatorios"
            className={linkClass}
          >
            <BarChart3 />
            Relatório
          </NavLink>
        </nav>

        <div className="sidebar-wave"></div>

        <p className="sidebar-quote">
          Comida boa
          <br />
          gera grandes
          <br />
          histórias!
        </p>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="global-search">
            <Search size={17} />

            <input placeholder="Pesquisar produtos, clientes, vendas..." />
          </div>

          <div className="admin-wrapper">
            <button
              type="button"
              className="admin"
              onClick={() =>
                setAdminAberto(!adminAberto)
              }
              aria-expanded={adminAberto}
            >
              <div className="avatar">A</div>

              <div className="admin-info">
                <b>Admin</b>
                <small>Administrador</small>
              </div>

              <ChevronDown
                size={16}
                className={`admin-chevron ${
                  adminAberto ? "aberto" : ""
                }`}
              />
            </button>

            {adminAberto && (
              <div className="admin-menu">
                <button
                  type="button"
                  onClick={abrirCadastroUsuario}
                >
                  <UserPlus size={17} />
                  Criar usuário
                </button>

                <button
                  type="button"
                  className="logout-option"
                  onClick={sair}
                >
                  <LogOut size={17} />
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}