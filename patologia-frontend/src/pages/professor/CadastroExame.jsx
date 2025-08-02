import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import '../../styles/global.css';

export default function CadastroExame() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    tipoImagem: '',
    especialidade: '',
    imagem: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // tipos de exame disponíveis
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

  // especialidades médicas disponíveis
  const especialidades = [
    'Cardiologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Neurologia',
    'Ortopedia',
    'Pneumologia',
    'Urologia',
  ];

  // atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // atualiza arquivo de imagem
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imagem: e.target.files[0] }));
  };

  // envia formulário para cadastrar exame
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const token = localStorage.getItem('token');

      await api.post('/exames', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Exame cadastrado com sucesso!');
      navigate('/professor/exames');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Erro ao cadastrar exame'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-cadastroexame-professor">
      <div className="card max-w-xl mx-auto">
        <BotaoVoltar to="/professor/exames" />
        <h2 className="title text-center">Cadastro de Exame</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-form">Nome do Exame</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="input input-mb"
              required
            />
          </div>

          <div>
            <label className="label-form">Tipo de Exame</label>
            <select
              name="tipoImagem"
              value={formData.tipoImagem}
              onChange={handleChange}
              className="input select-mb"
              required
            >
              <option value="">Selecione...</option>
              {tiposImagem.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-form">Especialidade</label>
            <select
              name="especialidade"
              value={formData.especialidade}
              onChange={handleChange}
              className="input select-mb"
              required
            >
              <option value="">Selecione...</option>
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-form">Imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input input-mb"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="button button-cadastro-exame disabled:bg-green-300"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Exame'}
          </button>
        </form>
      </div>
    </div>
  );
}
