import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

export default function EditarQuestionario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [selectedPerguntas, setSelectedPerguntas] = useState([]);

  // carrega dados do questionário e perguntas ao montar componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionarioRes, perguntasRes] = await Promise.all([
          api.get(`/questionarios/${id}`),
          api.get('/perguntas'),
        ]);

        const dados = questionarioRes.data.data || questionarioRes.data;
        setNome(dados.nome || '');
        setSelectedPerguntas((dados.perguntas || []).map(p => p.id));
        setPerguntas(perguntasRes.data);
      } catch (error) {
        console.error('Erro detalhado:', error, error.response?.data);
        toast.error('Erro ao carregar dados');
      }
    };
    fetchData();
  }, [id]);

  // seleciona ou remove pergunta da lista
  const togglePergunta = (perguntaId) => {
    setSelectedPerguntas((prev) =>
      prev.includes(perguntaId)
        ? prev.filter((id) => id !== perguntaId)
        : [...prev, perguntaId]
    );
  };

  // envia alterações para o backend
  const handleSubmit = async () => {
    if (!nome.trim()) return toast.warning('Nome é obrigatório');
    if (selectedPerguntas.length < 10) return toast.warning('Selecione 10 perguntas');

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      await api.put(`/questionarios/${id}`, {
        nome,
        perguntas: selectedPerguntas,
        professorId: usuario.id,
      });

      toast.success('Questionário atualizado com sucesso');
      navigate('/professor/questionario/visualizar');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar questionário');
    }
  };

  return (
    <div className="container-editarquestionario-professor">
      <div className="card max-w-2xl mx-auto">
        <BotaoVoltar />
        <h2 className="title text-center">Editar Questionário</h2>

        <div className="flex flex-col gap-5 mt-4">
          <div>
            <label className="block font-semibold mb-1">Nome do Questionário</label>
            <input
              type="text"
              value={nome || ''}
              onChange={(e) => setNome(e.target.value)}
              className="input"
              placeholder="Digite o nome"
              required
            />
          </div>

          <div>
            <h3 className="font-semibold text-green-700 mb-2">
              Perguntas Selecionadas: {selectedPerguntas.length} de 10
            </h3>
            <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto bg-white shadow-sm">
              {perguntas.map((pergunta) => (
                <div
                  key={pergunta.id}
                  className={`pergunta-selecao${selectedPerguntas.includes(pergunta.id) ? ' selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPerguntas.includes(pergunta.id)}
                    onChange={() => togglePergunta(pergunta.id)}
                    className="mt-1 cursor-pointer"
                    id={`pergunta-${pergunta.id}`}
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
            className={`button button-editar-questionario ${selectedPerguntas.length < 10 || !nome.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Atualizar Questionário
          </button>
        </div>
      </div>
    </div>
  );
}
