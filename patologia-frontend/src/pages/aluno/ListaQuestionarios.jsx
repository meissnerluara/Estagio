import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

export default function ListaQuestionarios() {
  const [questionarios, setQuestionarios] = useState([]); // lista de questionários
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // carrega questionários ao montar componente
  useEffect(() => {
    const carregarQuestionarios = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3001/api/questionarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setQuestionarios(Array.isArray(data) ? data : []);
      } catch (err) {
        const mensagem = err.response?.status === 403
        ? 'Você já respondeu este questionário.'
        : err.message || 'Erro ao carregar dados';
        setError(mensagem);
      } finally {
        setLoading(false);
      }
    };
    carregarQuestionarios();
  }, []);

  if (loading) {
    return (
      <div className="container-questionario-aluno">
        <div className="card text-center">
          <BotaoVoltar />
          <p>Carregando questionários...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-questionario-aluno">
        <div className="card">
          <BotaoVoltar />
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Erro ao carregar questionários: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-questionario-aluno">
      <div className="card">
        <BotaoVoltar />
        <h2 className="title text-center">Questionários Disponíveis</h2>
        {questionarios.length === 0 ? (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded">
            Nenhum questionário disponível no momento.
          </div>
        ) : (
          <div
            className="grid gap-6 mt-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              marginTop: '2rem',
              margin: '0 auto'
            }}
          >
            {questionarios.map((q) => (
              <div
                key={q.id}
                className="card"
                style={{ padding: '1.5rem', minWidth: 0 }}
              >
                <h3 className="questionario-nome">{q.nome}</h3>
                <div className="flex flex-col gap-6">
                  <button
                    onClick={() => navigate(`/aluno/questionario/${q.id}`)}
                    className="nav-button mt-2"
                    disabled={q.tentativas && q.tentativas >= 1}
                  >
                    Iniciar Questionário
                  </button>
                  {q.tentativas >= 1 && (
                    <div className="questionario-respondido">
                      Você já respondeu este questionário.
                      {q.nota !== null && q.nota !== undefined && (
                        <p>Nota: {q.nota?.toFixed(1)} / 10</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
