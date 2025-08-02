import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import api from '../../services/api';
import '../../styles/global.css';

const CadastroPergunta = () => {
  const navigate = useNavigate();
  const [exames, setExames] = useState([]);
  const [formData, setFormData] = useState({
    exameId: '',
    enunciado: '',
    alternativaA: '',
    alternativaB: '',
    alternativaC: '',
    alternativaD: '',
    alternativaE: '',
    correta: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // carrega exames disponíveis ao montar componente
  useEffect(() => {
    const fetchExames = async () => {
      try {
        const response = await api.get('/exames');
        setExames(response.data);
      } catch (error) {
        toast.error('Erro ao carregar exames');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExames();
  }, []);

  // envia formulário para cadastrar pergunta
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.correta) {
      toast.error('Você deve selecionar a alternativa correta.');
      return;
    }

    const dadosParaEnviar = {
      enunciado: formData.enunciado,
      exameId: Number(formData.exameId),
      alternativaA: formData.alternativaA,
      alternativaB: formData.alternativaB,
      alternativaC: formData.alternativaC,
      alternativaD: formData.alternativaD,
      alternativaE: formData.alternativaE,
      correta: formData.correta
    };

    try {
      await api.post('/perguntas', dadosParaEnviar);
      toast.success('Pergunta cadastrada com sucesso!');
      navigate('/professor/perguntas');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar pergunta');
    }
  };

  if (isLoading) {
    return (
      <div className="container-cadastropergunta-professor">
        <div className="card text-center">
          <p>Carregando exames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-cadastropergunta-professor">
      <div className="card max-w-2xl mx-auto">
        <BotaoVoltar to="/professor/perguntas" />
        <h2 className="title text-center">Cadastrar Pergunta</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block font-semibold mb-1">Exame Relacionado</label>
            <select
              value={formData.exameId}
              onChange={(e) => setFormData(prev => ({ ...prev, exameId: e.target.value }))}
              className="input"
              required
            >
              <option value="">Selecione um exame</option>
              {exames.map(exame => (
                <option key={exame.id} value={exame.id}>
                  {exame.nome} - {exame.especialidade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Enunciado</label>
            <textarea
              value={formData.enunciado}
              onChange={(e) => setFormData(prev => ({ ...prev, enunciado: e.target.value }))}
              className="input resize-none textarea-enunciado"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Alternativas</label>

            <div className="flex flex-col gap-3">
              {['A', 'B', 'C', 'D', 'E'].map((letra) => (
                <div key={letra} className="flex items-center gap-3 alternativa-cadastro">
                  <span className="font-semibold text-green-700">{letra}.</span>
                  <input
                    type="text"
                    value={formData[`alternativa${letra}`]}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, [`alternativa${letra}`]: e.target.value }))
                    }
                    className="input flex-1"
                    required
                  />
                  <input
                    type="radio"
                    name="correta"
                    checked={formData.correta === letra}
                    onChange={() => setFormData(prev => ({ ...prev, correta: letra }))}
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="button button-cadastro-pergunta">
            Cadastrar Pergunta
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroPergunta;
