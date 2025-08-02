import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

const VisualizarRespostas = () => {
  const [questionarios, setQuestionarios] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [questionarioSelecionado, setQuestionarioSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // carrega questionários ao montar componente
  useEffect(() => {
    const buscarQuestionarios = async () => {
      try {
        setCarregando(true);
        const response = await api.get("/questionarios");
        setQuestionarios(response.data);
      } catch (error) {
        toast.error("Erro ao carregar questionários");
      } finally {
        setCarregando(false);
      }
    };

    buscarQuestionarios();
  }, []);

  // carrega respostas do questionário selecionado
  const carregarRespostas = async (id) => {
    try {
      setCarregando(true);
      setQuestionarioSelecionado(id);
      const response = await api.get(`/questionarios/${id}/respostas`);
      setRespostas(response.data);
    } catch (error) {
      toast.error("Erro ao carregar respostas");
    } finally {
      setCarregando(false);
    }
  };

  // agrupa pontuação dos alunos
  function agruparPontuacaoPorAluno(respostas) {
    const mapa = {};
    respostas.forEach((r) => {
      const alunoKey = r.aluno?.rgm || r.aluno?.nome;
      if (!alunoKey) return;
      if (!mapa[alunoKey]) {
        mapa[alunoKey] = {
          nome: r.aluno?.nome,
          rgm: r.aluno?.rgm,
          curso: r.aluno?.curso,
          periodo: r.aluno?.periodo,
          turma: r.aluno?.turma,
          pontos: 0,
        };
      }
      mapa[alunoKey].pontos += r.correta ? 1 : 0;
    });
    return Object.values(mapa);
  }

  return (
    <div className="container-respostas-professor">
      <BotaoVoltar />
      <div className="card">
        <h1 className="title text-center">Visualizar Respostas dos Alunos</h1>

        {/* seleção de questionário */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Selecione um Questionário:</h2>
          {carregando && !questionarioSelecionado ? (
            <p>Carregando questionários...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {questionarios.map((q) => (
                <button
                  key={q.id}
                  onClick={() => carregarRespostas(q.id)}
                  className={`nav-button botao-selecionar-questionario ${
                    questionarioSelecionado === q.id ? 'active' : ''
                  }`}
                >
                  {q.nome}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* exibe tabela de respostas */}
        {carregando && respostas.length === 0 && (
          <p className="text-gray-500 text-center">Carregando respostas...</p>
        )}

        {respostas.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Pontuação dos Alunos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Aluno</th>
                    <th className="border px-4 py-2 text-left">RGM</th>
                    <th className="border px-4 py-2 text-left">Curso</th>
                    <th className="border px-4 py-2 text-left">Período</th>
                    <th className="border px-4 py-2 text-left">Turma</th>
                    <th className="border px-4 py-2 text-left">Pontuação Total</th>
                  </tr>
                </thead>
                <tbody>
                  {agruparPontuacaoPorAluno(respostas).map((aluno) => (
                    <tr key={aluno.rgm} className="hover:bg-blue-50">
                      <td className="border px-4 py-2">{aluno.nome}</td>
                      <td className="border px-4 py-2">{aluno.rgm}</td>
                      <td className="border px-4 py-2">{aluno.curso || '-'}</td>
                      <td className="border px-4 py-2">{aluno.periodo || '-'}</td>
                      <td className="border px-4 py-2">{aluno.turma || '-'}</td>
                      <td className="border px-4 py-2">{aluno.pontos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* mensagem se não houver respostas */}
        {!carregando && questionarioSelecionado && respostas.length === 0 && (
          <p className="mt-4 text-gray-600 text-center">
            Nenhuma resposta disponível para este questionário.
          </p>
        )}
      </div>
    </div>
  );
};

export default VisualizarRespostas;
