import api from './index';

// operações com exames
const ExamesService = {
  // lista todos os exames
  listar: async () => {
    try {
      const response = await api.get('/exames');
      console.log('Resposta completa:', response); // para debug
      return response.data || response; // retorna dados do exame
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao listar exames';
    }
  },

  // cria novo exame (upload de imagem)
  criar: async (formData) => {
    try {
      const response = await api.post('/exames', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao criar exame';
    }
  },

  // obtém exame por id
  obterPorId: async (id) => {
    try {
      const response = await api.get(`/exames/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao obter exame';
    }
  },

  // atualiza exame por id
  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/exames/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao atualizar exame';
    }
  },

  // deleta exame por id
  deletar: async (id) => {
    try {
      await api.delete(`/exames/${id}`);
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao deletar exame';
    }
  }
};

export default ExamesService;