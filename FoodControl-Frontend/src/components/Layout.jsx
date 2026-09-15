import {Outlet,NavLink} from "react-router-dom";
import {ShoppingCart,Package,Boxes,Users,BarChart3,CreditCard,Search,ChevronDown} from "lucide-react";

const linkClass=({isActive})=>`nav-link ${isActive?"active":""}`;
export default function Layout(){
 return <div className="app-shell">
  <aside className="sidebar">
   <div className="brand">Food<span>Control</span></div>
   <nav>
    <NavLink to="/venda" className={linkClass}><ShoppingCart/>Venda</NavLink>
    <NavLink to="/produtos" className={linkClass}><Package/>Produto</NavLink>
    <NavLink to="/estoque" className={linkClass}><Boxes/>Estoque</NavLink>
    <div className="nav-group"><div className="nav-group-title"><Users/>Aluno <ChevronDown size={15}/></div>
      <NavLink to="/alunos/cadastrar" className={linkClass}>Cadastrar Aluno</NavLink>
      <NavLink to="/alunos/credito" className={linkClass}>Crédito do Aluno</NavLink>
      <NavLink to="/alunos/lista" className={linkClass}>Lista de Alunos</NavLink>
    </div>
    <NavLink to="/relatorios" className={linkClass}><BarChart3/>Relatório</NavLink>
   </nav>
   <div className="sidebar-wave"></div>
   <p className="sidebar-quote">Comida boa<br/>gera grandes<br/>histórias!</p>
  </aside>
  <main className="main">
   <header className="topbar">
    <div className="global-search"><Search size={17}/><input placeholder="Pesquisar produtos, alunos, vendas..."/></div>
    <div className="admin"><div className="avatar">A</div><div><b>Admin</b><small>Administrador</small></div></div>
   </header>
   <div className="page"><Outlet/></div>
  </main>
 </div>
}