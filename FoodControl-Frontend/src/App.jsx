import {Routes,Route,Navigate} from "react-router-dom";
import Layout from "./components/Layout";
import Venda from "./pages/Venda";
import Produtos from "./pages/Produtos";
import Estoque from "./pages/Estoque";
import CadastrarAluno from "./pages/CadastrarAluno";
import CreditoAluno from "./pages/CreditoAluno";
import ListaAlunos from "./pages/ListaAlunos";
import Relatorios from "./pages/Relatorios";

export default function App(){
 return <Routes>
   <Route element={<Layout/>}>
     <Route path="/" element={<Navigate to="/venda" replace/>}/>
     <Route path="/venda" element={<Venda/>}/>
     <Route path="/produtos" element={<Produtos/>}/>
     <Route path="/estoque" element={<Estoque/>}/>
     <Route path="/alunos/cadastrar" element={<CadastrarAluno/>}/>
     <Route path="/alunos/credito" element={<CreditoAluno/>}/>
     <Route path="/alunos/lista" element={<ListaAlunos/>}/>
     <Route path="/relatorios" element={<Relatorios/>}/>
   </Route>
 </Routes>
}