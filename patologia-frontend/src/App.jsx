import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

// Páginas Públicas
import Home from './pages/publicas/Home';
import IAsDiagnostico from './pages/publicas/IAsDiagnostico';
import SobreProjeto from './pages/publicas/SobreProjeto';

// Páginas de Autenticação
import LoginAluno from './pages/aluno/LoginAluno';
import CadastroAluno from './pages/aluno/CadastroAluno';
import EscolhaAluno from './pages/aluno/EscolhaAluno';
import LoginProfessor from './pages/professor/LoginProfessor';
import CadastroProfessor from './pages/professor/CadastroProfessor';
import EscolhaProfessor from './pages/professor/EscolhaProfessor';

// Páginas do Aluno
import DashboardAluno from './pages/aluno/DashboardAluno';
import ListaQuestionarios from './pages/aluno/ListaQuestionarios';
import RespostaQuestionario from './pages/aluno/RespostaQuestionario';

// Páginas do Professor
import DashboardProfessor from './pages/professor/DashboardProfessor';

import MenuExames from './pages/professor/MenuExames';
import CadastroExame from './pages/professor/CadastroExame';
import EditarExame from './pages/professor/EditarExame';
import VisualizarExames from './pages/professor/VisualizarExames';

import MenuPerguntas from './pages/professor/MenuPerguntas';
import CadastroPergunta from './pages/professor/CadastroPergunta';
import EditarPergunta from './pages/professor/EditarPergunta';
import VisualizarPerguntas from './pages/professor/VisualizarPerguntas';

import MenuQuestionarios from './pages/professor/MenuQuestionarios';
import CadastroQuestionario from './pages/professor/CadastroQuestionario';
import EditarQuestionario from './pages/professor/EditarQuestionario';
import VisualizarQuestionarios from './pages/professor/VisualizarQuestionarios';

import VisualizarRespostas from './pages/professor/VisualizarRespostas';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/ia" element={<IAsDiagnostico />} />
        <Route path="/sobre" element={<SobreProjeto />} />

        {/* Rotas de Autenticação */}
        <Route path="/auth">
          <Route path="aluno" element={<EscolhaAluno />} />
          <Route path="aluno/login" element={<LoginAluno />} />
          <Route path="aluno/cadastro" element={<CadastroAluno />} />
          <Route path="professor" element={<EscolhaProfessor />} />
          <Route path="professor/login" element={<LoginProfessor />} />
          <Route path="professor/cadastro" element={<CadastroProfessor />} />
        </Route>

        {/* Rotas do Aluno */}
        <Route
          path="/aluno"
          element={
            <PrivateRoute role="aluno">
              <DashboardAluno />
            </PrivateRoute>
          }
        />
        <Route
          path="/aluno/questionarios"
          element={
            <PrivateRoute role="aluno">
              <ListaQuestionarios />
            </PrivateRoute>
          }
        />
        <Route
          path="/aluno/questionario/:id"
          element={
            <PrivateRoute role="aluno">
              <RespostaQuestionario />
            </PrivateRoute>
          }
        />

        {/* Rotas do Professor */}
        <Route
          path="/professor"
          element={
            <PrivateRoute role="professor">
              <DashboardProfessor />
            </PrivateRoute>
          }
        />
        {/* Rotas de Exames */}
        <Route
          path="/professor/exames"
          element={
            <PrivateRoute role="professor">
              <MenuExames />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/exames/cadastrar"
          element={
            <PrivateRoute role="professor">
              <CadastroExame />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/exames/editar/:id"
          element={
            <PrivateRoute role="professor">
              <EditarExame />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/exames/visualizar"
          element={
            <PrivateRoute role="professor">
              <VisualizarExames />
            </PrivateRoute>
          }
        />
        {/* Rotas de Perguntas */}
        <Route
          path="/professor/perguntas"
          element={
            <PrivateRoute role="professor">
              <MenuPerguntas />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/perguntas/cadastrar"
          element={
            <PrivateRoute role="professor">
              <CadastroPergunta />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/perguntas/editar/:id"
          element={
            <PrivateRoute role="professor">
              <EditarPergunta />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/perguntas/visualizar"
          element={
            <PrivateRoute role="professor">
              <VisualizarPerguntas />
            </PrivateRoute>
          }
        />
        {/* Rotas de Questionários */}
        <Route
          path="/professor/questionario"
          element={
            <PrivateRoute role="professor">
              <MenuQuestionarios />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/questionario/cadastrar"
          element={
            <PrivateRoute role="professor">
              <CadastroQuestionario />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/questionario/editar/:id"
          element={
            <PrivateRoute role="professor">
              <EditarQuestionario />
            </PrivateRoute>
          }
        />
        <Route
          path="/professor/questionario/visualizar"
          element={
            <PrivateRoute role="professor">
              <VisualizarQuestionarios />
            </PrivateRoute>
          }
        />
        {/* Rotas de Respostas */}
        <Route
          path="/professor/respostas"
          element={
            <PrivateRoute role="professor">
              <VisualizarRespostas />
            </PrivateRoute>
          }
        />

        {/* Rota de Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;