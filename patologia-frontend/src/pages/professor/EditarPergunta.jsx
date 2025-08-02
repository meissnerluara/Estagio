import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

const EditarPergunta = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // estados dos campos da pergunta
  const [enunciado, setEnunciado] = useState('');
  const [alternativaA, setAlternativaA] = useState('');
  const [alternativaB, setAlternativaB] = useState('');
  const [alternativaC, setAlternativaC] = useState('');
  const [alternativaD, setAlternativaD] = useState('');
  const [alternativaE, setAlternativaE] = useState('');
  const [correta, setCorreta] = useState('');

  // carrega dados da pergunta ao montar componente
  useEffect(() => {
    const carregarPergunta = async () => {
      try {
        const response = await api.get(`/perguntas/${id}`);
        const pergunta = response.data;

        setEnunciado(pergunta.enunciado);
        setAlternativaA(pergunta.alternativaA);
        setAlternativaB(pergunta.alternativaB);
        setAlternativaC(pergunta.alternativaC);
        setAlternativaD(pergunta.alternativaD);
        setAlternativaE(pergunta.alternativaE);
        setCorreta(pergunta.correta);
      } catch (error) {
        alert('Erro ao carregar pergunta.');
        navigate('/professor/perguntas');
      }
    };

    carregarPergunta();
  }, [id, navigate]);

  // envia alterações para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!enunciado || !alternativaA || !alternativaB || !alternativaC || !alternativaD || !alternativaE || !correta) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      await api.put(`/perguntas/${id}`, {
        enunciado,
        alternativaA,
        alternativaB,
        alternativaC,
        alternativaD,
        alternativaE,
        correta,
      });

      alert('Pergunta atualizada com sucesso!');
      navigate('/professor/perguntas');
    } catch (error) {
      alert('Erro ao atualizar pergunta.');
    }
  };

  return (
    <div className="container-editarperguntas-professor">
      <div className="card max-w-2xl mx-auto">
        <BotaoVoltar />
        <h2 className="title text-center">Editar Pergunta</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block font-semibold mb-1">Enunciado</label>
            <textarea
              value={enunciado}
              onChange={(e) => setEnunciado(e.target.value)}
              className="input resize-none textarea-enunciado"
              rows="4"
              required
            />
          </div>

          {[
            { label: 'A', value: alternativaA, setter: setAlternativaA },
            { label: 'B', value: alternativaB, setter: setAlternativaB },
            { label: 'C', value: alternativaC, setter: setAlternativaC },
            { label: 'D', value: alternativaD, setter: setAlternativaD },
            { label: 'E', value: alternativaE, setter: setAlternativaE },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block font-semibold mb-1">
                Alternativa {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="input"
                required
              />
            </div>
          ))}

          <div>
            <label className="block font-semibold mb-1">Resposta Correta</label>
            <select
              value={correta}
              onChange={(e) => setCorreta(e.target.value)}
              className="input"
              required
            >
              <option value="">Selecione</option>
              {['A', 'B', 'C', 'D', 'E'].map((letra) => (
                <option key={letra} value={letra}>{letra}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/professor/perguntas')}
              className="button secondary button-pequeno"
            >
              Cancelar
            </button>
            <button type="submit" className="button button-pequeno">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPergunta;
