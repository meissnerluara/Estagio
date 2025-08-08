import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

export default function VisualizarQuestionarios() {
  const [questionarios, setQuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // carrega questionários ao montar componente
  useEffect(() => {
    const fetchQuestionarios = async () => {
      try {
        const res = await api.get('/questionarios');
        setQuestionarios(res.data);
      } catch (error) {
        toast.error('Erro ao carregar questionários');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionarios();
  }, []);

  // exclui questionário selecionado
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este questionário?')) return;
    try {
      await api.delete(`/questionarios/${id}`);
      setQuestionarios((prev) => prev.filter((q) => q.id !== id));
      toast.success('Questionário excluído');
    } catch (error) {
      toast.error('Erro ao excluir questionário');
    }
  };

  if (loading) {
    return (
      <div className="container-visualizarquestionarios-professor">
        <div className="card text-center">
          <BotaoVoltar />
          <p>Carregando Questionários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-visualizarquestionarios-professor">
      <div className="card">
        <BotaoVoltar />
        <h1 className="title text-center mb-6">Questionários Cadastrados</h1>
        {/* lista questionários cadastrados */}
        {questionarios.length === 0 ? (
          <p>Nenhum questionário encontrado.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2.5rem',
              marginTop: '2rem',
              margin: '0 auto'
            }}
          >
            {questionarios.map((q) => (
              <div key={q.id} className="card" style={{ padding: '1.5rem', minWidth: 0 }}>
                <h2 className="exame-nome">{q.nome}</h2>
                {/* botões para editar ou excluir */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => navigate(`/professor/questionario/editar/${q.id}`)}
                    className="button button-exame"
                    disabled={q.tentativas > 0}
                    title={q.tentativas > 0 ? 'Já existem respostas para este questionário' : ''}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="button button-exame"
                    style={{ backgroundColor: '#dc2626', color: '#fff' }}
                  >
                    Excluir
                  </button>
                </div>
                {/* aviso se não pode editar */}
                {q.tentativas > 0 && (
                  <div style={{ marginTop: '1.4rem', textAlign: 'left' }}>
                    Não é possível editar.<br />
                    Existem respostas para este questionário.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
