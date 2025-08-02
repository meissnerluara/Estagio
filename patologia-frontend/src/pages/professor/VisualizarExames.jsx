import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamesService from '../../api/exames';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

export default function VisualizarExames() {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // carrega exames ao montar componente
  useEffect(() => {
    const fetchExames = async () => {
      try {
        const resposta = await ExamesService.listar();
        const dadosExames = resposta.data ? resposta.data : resposta;
        setExames(dadosExames);
      } catch (error) {
        alert('Não foi possível carregar os exames. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    fetchExames();
  }, []);

  // exclui exame selecionado
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este exame?')) return;
    try {
      await ExamesService.deletar(id);
      setExames(exames.filter(e => e.id !== id));
      alert('Exame excluído com sucesso!');
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir exame');
    }
  };

  if (loading) {
    return (
      <div className="container-visualizarexames-professor">
        <div className="card text-center">
          <BotaoVoltar />
          <p>Carregando Exames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-visualizarexames-professor">
      <div className="card">
        <BotaoVoltar />
        <h2 className="title text-center mb-6">Exames Cadastrados</h2>
        {/* lista exames cadastrados */}
        {!exames || exames.length === 0 ? (
          <p>Nenhum exame encontrado.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              marginTop: '2rem',
              margin: '0 auto'
            }}
          >
            {exames.map((exame) => (
              <div
                key={exame.id}
                className="card"
                style={{ padding: '1.5rem', minWidth: 0 }}
              >
                <h3 className="exame-nome">{exame.nome}</h3>
                <p><strong>Especialidade:</strong> {exame.especialidade}</p>
                <p><strong>Tipo de imagem:</strong> {exame.tipoImagem}</p>

                {/* exibe imagem do exame */}
                {exame.imagemUrl && (
                  <img
                    src={
                      exame.imagemUrl.startsWith('http')
                        ? exame.imagemUrl
                        : `http://localhost:3001${exame.imagemUrl}`
                    }
                    alt="Imagem do exame"
                    className="rounded border"
                    style={{
                      width: '300px',
                      height: '300px',
                      objectFit: 'cover',
                      display: 'block',
                      margin: '1.5rem auto'
                    }}
                  />
                )}

                {/* botões para editar ou excluir */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem' }}>
                  <button
                    className="button button-exame"
                    onClick={() => navigate(`/professor/exames/editar/${exame.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="button button-exame"
                    style={{ backgroundColor: '#dc2626', color: '#fff' }}
                    onClick={() => handleDelete(exame.id)}
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
}
