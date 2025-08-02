import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/global.css';

const DashboardProfessor = () => {
  const navigate = useNavigate(); // hook para navegação
  const location = useLocation(); // hook para saber rota atual
  const { usuario } = useContext(AuthContext); // dados do usuário logado

  const tipoUsuario = usuario?.tipo;

  return (
    <div className="container-dashboard-professor">
      <div className="card">
        <h2 className="title text-center">Painel do Professor</h2>
        <p className="text-center">
          Bem-vindo, {usuario?.nome || 'Professor'}! Selecione uma das opções abaixo:
        </p>

        {tipoUsuario === 'professor' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '1.5rem'
            }}
          >
            <button
              onClick={() => navigate('/professor/exames')}
              className={`nav-button ${location.pathname.includes('/professor/exames') ? 'active' : ''}`}
            >
              Exames
            </button>
            <button
              onClick={() => navigate('/professor/perguntas')}
              className={`nav-button ${location.pathname.includes('/professor/perguntas') ? 'active' : ''}`}
            >
              Perguntas
            </button>
            <button
              onClick={() => navigate('/professor/questionario')}
              className={`nav-button ${location.pathname.includes('/professor/questionario') ? 'active' : ''}`}
            >
              Questionários
            </button>
            <button
              onClick={() => navigate('/professor/respostas')}
              className={`nav-button ${location.pathname.includes('/professor/respostas') ? 'active' : ''}`}
            >
              Respostas
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

export default DashboardProfessor;