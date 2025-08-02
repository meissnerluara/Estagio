import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

const MenuQuestionario = () => {
  const navigate = useNavigate();

  return (
    <div className="container-menuquestionarios-professor">
      <div className="card max-w-md mx-auto text-center">
        <BotaoVoltar />
        <h2 className="title">Painel de Questionários</h2>
        <p className="mb-4">Escolha uma opção:</p>

        {/* botões para criar ou visualizar questionários */}
        <div className="flex justify-center flex-wrap gap-4">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '0.3rem'
            }}
          >
            <button
              className="nav-button"
              onClick={() => navigate('/professor/questionario/cadastrar')}
            >
              Criar Questionário
            </button>
            <button
              className="nav-button"
              onClick={() => navigate('/professor/questionario/visualizar')}
            >
              Visualizar Questionários
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuQuestionario;
