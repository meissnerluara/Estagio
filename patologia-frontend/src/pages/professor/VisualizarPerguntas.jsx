import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

const VisualizarPerguntas = () => {
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // carrega perguntas ao montar componente
  useEffect(() => {
    const carregarPerguntas = async () => {
      try {
        const response = await api.get('/perguntas');
        setPerguntas(response.data);
      } catch (error) {
        alert('Erro ao carregar perguntas.');
      } finally {
        setLoading(false);
      }
    };
    carregarPerguntas();
  }, []);

  // exclui pergunta selecionada
  const excluirPergunta = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta pergunta?')) return;
    try {
      await api.delete(`/perguntas/${id}`);
      setPerguntas(perguntas.filter(p => p.id !== id));
    } catch (error) {
      alert('Erro ao excluir pergunta.');
    }
  };

  // navega para tela de edição
  const editarPergunta = (id) => {
    navigate(`/professor/perguntas/editar/${id}`);
  };

  if (loading) {
    return (
      <div className="container-visualizarperguntas-professor">
        <div className="card text-center">
          <BotaoVoltar />
          <p>Carregando Perguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-visualizarperguntas-professor">
      <div className="card">
        <BotaoVoltar />
        <h2 className="title text-center mb-6">Perguntas Cadastradas</h2>
        {/* lista perguntas cadastradas */}
        {perguntas.length === 0 ? (
          <p>Nenhuma pergunta cadastrada.</p>
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
            {perguntas.map((p) => (
              <div key={p.id} className="card">
                <h3 className="exame-nome" style={{ fontSize: '1.2rem', marginBottom: '-0.2rem', textAlign: 'left' }}>
                  Enunciado:
                </h3>
                <p style={{ marginBottom: '1.3rem', textAlign: 'left' }}>{p.enunciado}</p>
                <div style={{ marginBottom: '-0.75rem' }}>
                  <strong style={{ display: 'block', marginBottom: '0.7rem' }}>Alternativas:</strong>
                  <ul style={{ paddingLeft: '1.2rem', fontSize: '0.98rem', margin: 0, listStyle: 'none' }}>
                    <li style={{ marginBottom: '0.5rem' }}>A) {p.alternativaA}</li>
                    <li style={{ marginBottom: '0.5rem' }}>B) {p.alternativaB}</li>
                    <li style={{ marginBottom: '0.5rem' }}>C) {p.alternativaC}</li>
                    <li style={{ marginBottom: '0.5rem' }}>D) {p.alternativaD}</li>
                    <li style={{ marginBottom: '0' }}>E) {p.alternativaE}</li>
                  </ul>
                </div>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>Correta:</strong> {p.correta}
                </p>
                {/* botões para editar ou excluir */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                  <button
                    className="button button-exame"
                    onClick={() => editarPergunta(p.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="button button-exame"
                    style={{ backgroundColor: '#dc2626', color: '#fff' }}
                    onClick={() => excluirPergunta(p.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizarPerguntas;
