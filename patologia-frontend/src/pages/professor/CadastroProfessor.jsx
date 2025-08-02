import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

export default function CadastroProfessor() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    matricula: '',
    senha: '',
    tipo: 'professor',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // envia formulário para cadastrar professor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { success, error: registerError } = await register(formData);
      if (success) {
        navigate('/professor');
      } else {
        setError(registerError || 'Erro no cadastro');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-cadastro-professor">
      <div className="card max-w-md mx-auto">
        <BotaoVoltar />
        <h2 className="title text-center">Cadastro do Professor</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            className="input"
            value={formData.nome}
            onChange={handleChange}
            required
            minLength="3"
          />
          <input
            type="text"
            name="matricula"
            placeholder="Matrícula"
            className="input"
            value={formData.matricula}
            onChange={handleChange}
            required
            minLength="5"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha (mínimo 6 caracteres)"
            className="input"
            value={formData.senha}
            onChange={handleChange}
            minLength="6"
            required
          />
          <button
            type="submit"
            className="button button-cadastro"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
