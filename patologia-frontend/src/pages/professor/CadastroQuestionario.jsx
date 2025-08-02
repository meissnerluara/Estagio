import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import api from '../../services/api';
import '../../styles/global.css';

export default function CriarQuestionario() {
  const navigate = useNavigate();
  const [perguntas, setPerguntas] = useState([]);
  const [selectedPerguntas, setSelectedPerguntas] = useState([]);
  const [nome, setNome] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // carrega perguntas disponíveis ao montar componente
  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const response = await api.get('/perguntas');
        setPerguntas(response.data);
      } catch (error) {
        toast.error('Erro ao carregar perguntas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerguntas();
  }, []);

  // seleciona ou remove pergunta da lista
  const togglePergunta = (id) => {
    setSelectedPerguntas((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  // envia formulário para criar questionário
  const handleSubmit = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      await api.post('/questionarios', {
        nome,
        perguntas: selectedPerguntas,
        professorId: usuario.id,
      });

      toast.success('Questionário criado com sucesso!');
      navigate('/professor/questionario');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar questionário');
    }
  };

  if (isLoading) {
    return (
      <div className="container-cadastroquestionario-professor">
        <div className="card text-center">
          <p>Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-cadastroquestionario-professor">
      <div className="card max-w-2xl mx-auto">
        <BotaoVoltar />
        <h2 className="title text-center">Criar Questionário</h2>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block font-semibold mb-1">Nome do Questionário:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input input-mb"
              placeholder="Ex: Questionário de Radiologia Básica"
              required
            />
          </div>

          <div>
            <h3 className="font-semibold text-green-700 mb-2">
              Perguntas Selecionadas: {selectedPerguntas.length} de 10
            </h3>
            <div style={{ marginBottom: '2rem', maxHeight: '24rem', overflowY: 'auto' }}>
              {perguntas.map((pergunta) => (
                <div
                  key={pergunta.id}
                  className={`pergunta-selecao${selectedPerguntas.includes(pergunta.id) ? ' selected' : ''}`}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <input
                    type="checkbox"
                    id={`pergunta-${pergunta.id}`}
                    checked={selectedPerguntas.includes(pergunta.id)}
                    onChange={() => togglePergunta(pergunta.id)}
                    className="mt-1 cursor-pointer"
                  />
                  <label
                    htmlFor={`pergunta-${pergunta.id}`}
                    className="select-none"
                  >
                    {pergunta.enunciado}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedPerguntas.length < 10 || !nome.trim()}
            className={`button button-cadastro ${selectedPerguntas.length < 10 || !nome.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Criar Questionário
          </button>
        </div>
      </div>
    </div>
  );
}
