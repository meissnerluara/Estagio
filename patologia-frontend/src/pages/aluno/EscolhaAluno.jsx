import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

// tela para escolher entre login e cadastro de aluno
const EscolhaAluno = () => {
  const navigate = useNavigate();

  return (
    <div className="container-escolha">
      <div className="card max-w-md mx-auto text-center">
        <BotaoVoltar />
        <h2 className="title">Área do Aluno</h2>
        <p className="mb-4">Escolha uma opção para continuar:</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate('/auth/aluno/login')}
            className="nav-button"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/auth/aluno/cadastro')}
            className="nav-button"
          >
            Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscolhaAluno;
