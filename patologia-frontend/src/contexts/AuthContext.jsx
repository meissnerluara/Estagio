import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;

  // armazena usuário autenticado
  const [usuario, setUsuario] = useState(() => {
    try {
      const usuarioSalvo = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      return token && usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    } catch (e) {
      console.error('Erro ao analisar usuário:', e);
      localStorage.removeItem('usuario');
      return null;
    }
  });

  const [carregando, setCarregando] = useState(true);

  // verifica autenticação ao iniciar app
  useEffect(() => {
    async function verificarAutenticacao() {
      const token = localStorage.getItem('token');
      if (!token) {
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(`${API_URL}/auth/verificar`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (resposta.ok) {
          const dados = await resposta.json();
          const usuario = dados.usuario || dados;

          setUsuario(usuario);
          localStorage.setItem('usuario', JSON.stringify(usuario));
        } else {
          logout();
        }
      } catch (erro) {
        console.error('Erro ao verificar autenticação:', erro);
        logout();
      } finally {
        setCarregando(false);
      }
    }

    verificarAutenticacao();
  }, [API_URL]);

  // faz login do usuário
  const login = async (credenciais) => {
    try {
      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciais),
        credentials: 'include'
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (resposta.status === 503) {
          throw new Error('Serviço de banco de dados temporariamente indisponível');
        }
        throw new Error(dados.message || 'Login falhou');
      }

      localStorage.setItem('token', dados.token);
      setUsuario(dados.usuario);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));

      return true;
    } catch (erro) {
      if (erro.message.includes('banco de dados')) {
        throw new Error('Serviço temporariamente indisponível. Tente novamente em alguns minutos.');
      }
      throw erro;
    }
  };

  // faz cadastro de usuário
  const register = async (userData) => {
    try {
      const endpoint = `${API_URL}/auth/register/${userData.tipo || 'aluno'}`;

      const resposta = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!resposta.ok) {
        const errorData = await resposta.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro no cadastro (${resposta.status})`);
      }

      const dados = await resposta.json();

      if (!dados.usuario || !dados.token) {
        throw new Error('Resposta incompleta do servidor');
      }

      setUsuario(dados.usuario);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));
      localStorage.setItem('token', dados.token);

      return { success: true, data: dados };
    } catch (erro) {
      return {
        success: false,
        error: erro.message || 'Erro ao cadastrar'
      };
    }
  };

  // faz logout do usuário
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (erro) {
      console.warn('Erro ao fazer logout no servidor:', erro);
    } finally {
      setUsuario(null);
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
    }
  };

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      login,
      logout,
      register,
      carregando
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook para acessar contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}