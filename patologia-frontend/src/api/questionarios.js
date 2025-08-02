import api from './index';

// operações com questionários
const QuestionariosService = {
  // lista todos os questionários
  listar: async () => {
    try {
      const response = await api.get('/questionarios');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao listar questionários';
    }
  },

  // cria um novo questionário
  criar: async (questionarioData) => {
    try {
      const response = await api.post('/questionarios', questionarioData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao criar questionário';
    }
  },

  // obtém questionário por id
  obterPorId: async (id) => {
    try {
      const response = await api.get(`/questionarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao obter questionário';
    }
  },

  // deleta questionário por id
  deletar: async (id) => {
    try {
      await api.delete(`/questionarios/${id}`);
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao deletar questionário';
    }
  },

  // lista respostas de um questionário
  listarRespostas: async (questionarioId) => {
    try {
      const response = await api.get(`/questionarios/${questionarioId}/respostas`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao listar respostas';
    }
  },

  // atualiza questionário por id
  atualizar: async (id, questionarioData) => {
    try {
      const response = await api.put(`/questionarios/${id}`, questionarioData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao atualizar questionário';
    }
  }
};

export default QuestionariosService;