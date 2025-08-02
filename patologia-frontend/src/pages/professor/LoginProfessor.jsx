import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

const LoginProfessor = () => {
  const { login } = useAuth(); // hook de autenticação
  const navigate = useNavigate(); // hook de navegação

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // envia formulário de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login({ email, senha, tipo: 'professor' });

      if (success) {
        navigate('/professor');
      } else {
        setError('Credenciais inválidas ou serviço indisponível');
      }
    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-login">
      <div className="card max-w-md mx-auto">
        <BotaoVoltar />
        <h2 className="title text-center">Login do Professor</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email institucional"
            required
            className="input"
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            required
            className="input"
          />
          <button
            type="submit"
            disabled={loading}
            className="button button-login"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginProfessor;
