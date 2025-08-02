import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import api from '../../services/api';
import '../../styles/global.css';

export default function EditarExame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exame, setExame] = useState(null);

  // lista de tipos de exame
  const tiposImagem = [
    'Angiografia',
    'Densitometria Óssea',
    'Mamografia',
    'Medicina Nuclear',
    'Raio-X',
    'Ressonância Magnética',
    'Tomografia Computadorizada',
    'Ultrassonografia',
  ];

  // lista de especialidades
  const especialidades = [
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Neurologia',
    'Ortopedia',
    'Pneumologia',
    'Urologia',
  ];

  // carrega dados do exame ao montar componente
  useEffect(() => {
    const fetchExame = async () => {
      try {
        const response = await api.get(`/exames/${id}`);
        setExame(response.data);
      } catch (error) {
        alert('Não foi possível carregar o exame');
      }
    };
    fetchExame();
  }, [id]);

  // atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExame(prev => ({ ...prev, [name]: value }));
  };

  // envia alterações para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/exames/${id}`, {
        nome: exame.nome,
        tipoImagem: exame.tipoImagem,
        especialidade: exame.especialidade,
      });
      alert('Exame atualizado com sucesso!');
      navigate('/professor/exames/visualizar');
    } catch (error) {
      alert('Erro ao salvar alterações');
    }
  };

  if (!exame) {
    return (
      <div className="container-editarexames-professor">
        <div className="card text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container-editarexames-professor">
      <div className="card max-w-2xl mx-auto">
        <BotaoVoltar />
        <h2 className="title text-center">Editar Exame</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          <div>
            <label className="label-form">Nome do Exame</label>
            <input
              type="text"
              name="nome"
              value={exame.nome || ''}
              onChange={handleChange}
              className="input input-mb"
              required
            />
          </div>

          <div>
            <label className="label-form">Tipo de Exame</label>
            <select
              name="tipoImagem"
              value={exame.tipoImagem || ''}
              onChange={handleChange}
              className="input select-mb"
              required
            >
              <option value="">Selecione um tipo</option>
              {tiposImagem.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-form">Especialidade</label>
            <select
              name="especialidade"
              value={exame.especialidade || ''}
              onChange={handleChange}
              className="input select-mb"
              required
            >
              <option value="">Selecione uma especialidade</option>
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
            <p className="text-sm text-red-600 mt-2">
              * a imagem não pode ser alterada.
              para modificar a imagem, exclua e cadastre novamente o exame.
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/professor/exames/visualizar')}
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
}
