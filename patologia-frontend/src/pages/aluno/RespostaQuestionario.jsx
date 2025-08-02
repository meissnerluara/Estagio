import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import api from '../../api';
import QuestionariosService from '../../api/questionarios';
import '../../styles/global.css';

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace(/\/api$/, '');

export default function RespostaQuestionario() {
  // estados principais do questionário e respostas
  const [questionario, setQuestionario] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tentativas, setTentativas] = useState({});
  const [respostas, setRespostas] = useState({});
  const [showResumo, setShowResumo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // carrega questionário ao montar componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const apiResponse = await QuestionariosService.obterPorId(id);
        const payload = apiResponse.data ?? apiResponse;
        if (!Array.isArray(payload.perguntas)) {
          throw new Error('Estrutura de dados incorreta da API');
        }
        setQuestionario(payload);
      } catch (err) {
        const mensagem = err.response?.status === 403
          ? 'Você já respondeu este questionário.'
          : err.message || 'Erro ao carregar dados';
        setError(mensagem);
      }
    };
    carregarDados();
  }, [id]);

  // trata resposta do aluno para cada pergunta
  const handleResposta = (letra) => {
    const pergunta = questionario.perguntas[currentIndex];
    const perguntaId = pergunta.id;
    const tentativaAtual = tentativas[perguntaId] || 0;

    if (tentativaAtual >= 2) return;

    const correta = pergunta.correta === letra;
    const novaTentativa = tentativaAtual + 1;

    setTentativas(prev => ({ ...prev, [perguntaId]: novaTentativa }));

    setRespostas(prev => ({
      ...prev,
      [perguntaId]: {
        tentativa: novaTentativa,
        alternativa: letra,
        correta
      }
    }));

    setTimeout(() => {
      if (correta || novaTentativa === 2) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 500);
  };

  // envia respostas para o backend
  const enviarRespostas = async () => {
    setLoading(true);
    try {
      await api.post('/questionarios/respostas', {
        questionarioId: parseInt(id),
        respostas: Object.entries(respostas).map(([perguntaId, dados]) => ({
          perguntaId: parseInt(perguntaId),
          alternativa: dados.alternativa,
          correta: dados.correta,
          tentativa: dados.tentativa
        }))
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao enviar respostas');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="container-resposta-aluno">
        <div className="card">
          <BotaoVoltar />
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        </div>
      </div>
    );
  }

  if (!questionario) {
    return (
      <div className="container-resposta-aluno">
        <div className="card text-center">
          <BotaoVoltar />
          <p>Carregando questionário...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container-resposta-aluno">
        <div className="card text-center">
          <BotaoVoltar />
          <h2 className="title">Respostas Enviadas!</h2>
          <p>Obrigado por participar.</p>
          <button
            onClick={() => navigate('/aluno/questionarios')}
            className="nav-button mt-4"
          >
            Voltar para Questionários
          </button>
        </div>
      </div>
    );
  }

  if (showResumo) {
    const total = questionario.perguntas.length;
    let certos = 0;
    let pontos = 0;

    Object.values(respostas).forEach((r) => {
      if (r.correta) {
        certos += 1;
        pontos += r.tentativa === 1 ? 1 : 0.5;
      }
    });

    const errados = total - certos;

    return (
      <div className="container-resposta-aluno">
        <div className="card text-center">
          <BotaoVoltar />
          <h2 className="title">Resumo das Respostas</h2>
          <p>Total de perguntas: {total}</p>
          <p>Acertos: {certos}</p>
          <p>Erros: {errados}</p>
          <p className="text-green-700 font-semibold mt-2">Pontuação: {pontos.toFixed(1)} / 10</p>

          <button
            onClick={enviarRespostas}
            disabled={loading}
            className="nav-button mt-6"
          >
            {loading ? 'Enviando...' : 'Enviar Respostas'}
          </button>
        </div>
      </div>
    );
  }

  const perguntaAtual = questionario.perguntas[currentIndex];
  if (!perguntaAtual) {
    setShowResumo(true);
    return null;
  }

  const tentativaAtual = tentativas[perguntaAtual.id] || 0;
  const respostaAtual = respostas[perguntaAtual.id];

  return (
    <div className="container-resposta-aluno">
      <div className="card">
        <BotaoVoltar />
        <h2 className="title text-center">{questionario.nome}</h2>

        <div className="mb-6 p-4 bg-blue-50 rounded text-sm ">
          <p><strong>Instruções:</strong> Você tem até 2 tentativas por pergunta. A primeira tentativa vale 1 ponto e a segunda vale 0,5.</p>
        </div>

        {perguntaAtual.exame?.imagemUrl && (
          <div className="text-center" style={{ marginTop: '1.6rem', marginBottom: '1.6rem' }}>
            <img
              src={`${BASE_URL}${perguntaAtual.exame.imagemUrl}`}
              alt="Imagem do exame"
              className="mx-auto rounded border"
              style={{ maxWidth: '500px', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        )}

        <p className="font-semibold mb-2">
          <strong>Enunciado:</strong> {perguntaAtual.texto}
        </p>

        <div className="flex flex-col gap-3">
          {perguntaAtual.alternativas.map((alt, idx) => {
            const letra = String.fromCharCode(65 + idx);
            const resposta = respostas[perguntaAtual.id];
            const tentativaAtual = tentativas[perguntaAtual.id] || 0;

            let style = 'nav-button w-full text-left alternativa-botao';
            if (resposta) {
              const clicadaErrada = resposta.alternativa === letra && !resposta.correta;

              if (perguntaAtual.correta === letra) {
                style += ' bg-green-100 border-green-600 text-green-800';
              } else if (clicadaErrada) {
                style += ' bg-red-100 border-red-600 text-red-800';
              }

              if (tentativaAtual === 2 || resposta.correta) {
                style += ' opacity-50 cursor-not-allowed';
              }
            }

            return (
              <button
                key={letra}
                onClick={() => handleResposta(letra)}
                disabled={tentativaAtual >= 2 || (resposta && resposta.correta)}
                className={style}
              >
                {letra}) {alt}
              </button>
            );
          })}
        </div>

        {tentativaAtual === 1 && respostaAtual && !respostaAtual.correta && (
          <div className="erro-tentativa">
            Você errou, tente mais uma vez.
          </div>
        )}
      </div>
    </div>
  );
}
