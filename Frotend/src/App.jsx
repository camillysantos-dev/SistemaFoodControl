import {Routes,Route,Navigate} from "react-router-dom";
import Layout from "./components/Layout";
import Venda from "./pages/Venda";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import Cadastrar from "./pages/CadastrarCliente";
import CreditoAluno from "./pages/CreditoAluno";
import Lista from "./pages/ListaClientes";
import Relatorios from "./pages/Relatorios";

export default function App(){
 return <Routes>
   <Route element={<Layout/>}>
     <Route path="/" element={<Navigate to="/venda" replace/>}/>
     <Route path="/venda" element={<Venda/>}/>
     <Route path="/produtos" element={<Produtos/>}/>
     <Route path="/estoque" element={<Estoque/>}/>
     <Route path="/alunos/cadastrar" element={<Cadastrar/>}/>
     <Route path="/alunos/credito" element={<CreditoAluno/>}/>
     <Route path="/alunos/lista" element={<Lista/>}/>
     <Route path="/relatorios" element={<Relatorios/>}/>
   </Route>
 </Routes>
}