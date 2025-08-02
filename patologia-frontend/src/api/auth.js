import api from './index';

// autenticação com funções para login, logout, registro e verificação
const AuthService = {
  // faz login do usuário
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao fazer login';
    }
  },

  // faz logout do usuário
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  // faz cadastro de usuário
  register: async (userData, role) => {
    try {
      const response = await api.post(`/auth/register/${role}`, userData);
      return response;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao registrar';
    }
  },

  // verifica autenticação do usuário
  verify: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthService;