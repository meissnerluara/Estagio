import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

const DashboardAluno = () => {
  const navigate = useNavigate(); // hook de navegação
  const location = useLocation(); // hook para saber rota atual
  const { usuario } = useContext(AuthContext); // dados do usuário logado

  const tipoUsuario = usuario?.tipo;

  return (
    <div className="container-dashboard-aluno">
      <div className="card">
        <BotaoVoltar />
        <h2 className="title text-center">Painel do Aluno</h2>
        <p className="text-center">
          Bem-vindo, {usuario?.nome || 'Aluno'}! Selecione uma das opções abaixo:
        </p>

        {tipoUsuario === 'aluno' && (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate('/aluno/questionarios')}
            className={`nav-button ${location.pathname.includes('/aluno/questionarios') ? 'active' : ''}`}
          >
            Responder Questionários
          </button>
          <button
            onClick={() => navigate('/ia')}
            className={`nav-button ${location.pathname.includes('/ia') ? 'active' : ''}`}
          >
            Analisar Imagem
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAluno;