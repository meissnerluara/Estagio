import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/BotaoVoltar';

export default function CadastroAluno() {
  const { register } = useAuth(); // hook de autenticação
  const navigate = useNavigate(); // hook de navegação

  // estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    rgm: '',
    curso: '',
    periodo: '',
    turma: '',
    email: '',
    senha: '',
    tipo: 'aluno'
  });

  const [error, setError] = useState('');
  const [rgmError, setRgmError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // atualiza campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rgm') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // validação do RGM
  useEffect(() => {
    if (formData.rgm) {
      if (formData.rgm.length !== 11) {
        setRgmError('RGM deve ter exatamente 11 dígitos');
      } else if (!/^\d+$/.test(formData.rgm)) {
        setRgmError('RGM deve conter apenas números');
      } else {
        setRgmError('');
      }
    } else {
      setRgmError('');
    }
  }, [formData.rgm]);

  // envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.rgm.length !== 11 || !/^\d{11}$/.test(formData.rgm)) {
      setError('RGM deve ter exatamente 11 dígitos numéricos');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(formData); // chama cadastro
      if (result.success) {
        navigate('/aluno');
      } else {
        setError(result.details?.map(d => d.message).join(', ') || result.message || 'Erro no cadastro');
      }
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-cadastro-aluno">
      <div className="card">
        <BotaoVoltar />
        <h2 className="title text-center">Cadastro do Aluno</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            name="nome"
            required
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            className="input"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email institucional"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />
          <input
            type="password"
            name="senha"
            required
            placeholder="Senha (mínimo 6 caracteres)"
            minLength={6}
            value={formData.senha}
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="rgm"
            required
            placeholder="RGM (11 dígitos)"
            maxLength={11}
            value={formData.rgm}
            onChange={handleChange}
            className={`input ${rgmError ? 'border-red-500' : ''}`}
          />
          {rgmError && (
            <p className="text-red-500 text-sm -mt-2">{rgmError}</p>
          )}

          <select
            name="curso"
            required
            value={formData.curso}
            onChange={handleChange}
            className="input"
          >
            <option value="">Selecione seu curso</option>
            <option value="Medicina">Medicina</option>
            <option value="Biomedicina">Biomedicina</option>
            <option value="Enfermagem">Enfermagem</option>
          </select>

          <input
            type="number"
            name="periodo"
            required
            placeholder="Período (1-12)"
            min="1"
            max="12"
            value={formData.periodo}
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="turma"
            required
            placeholder="Turma (ex: A, B)"
            value={formData.turma}
            onChange={handleChange}
            className="input"
          />

          <button
            type="submit"
            className="button button-cadastro mt-2"
            disabled={isSubmitting || rgmError}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
