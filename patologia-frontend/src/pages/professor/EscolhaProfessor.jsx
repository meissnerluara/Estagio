import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

// tela para escolher entre login e cadastro de professor
const EscolhaProfessor = () => {
  const navigate = useNavigate();

  return (
    <div className="container-escolha">
      <div className="card max-w-md mx-auto text-center">
        <BotaoVoltar />
        <h2 className="title">Área do Professor</h2>
        <p className="mb-4">Escolha uma opção para continuar:</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            className="nav-button"
            onClick={() => navigate('/auth/professor/login')}
          >
            Login
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/auth/professor/cadastro')}
          >
            Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscolhaProfessor;
