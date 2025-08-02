import api from './index';

// operações com perguntas
const PerguntasService = {
  // lista perguntas, pode filtrar por exameId
  listar: async (exameId = null) => {
    try {
      const url = exameId ? `/perguntas?exameId=${exameId}` : '/perguntas';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao listar perguntas';
    }
  },

  // cria nova pergunta
  criar: async (perguntaData) => {
    try {
      const response = await api.post('/perguntas', perguntaData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao criar pergunta';
    }
  },

  // atualiza pergunta por id
  atualizar: async (id, perguntaData) => {
    try {
      const response = await api.put(`/perguntas/${id}`, perguntaData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao atualizar pergunta';
    }
  },

  // deleta pergunta por id
  deletar: async (id) => {
    try {
      await api.delete(`/perguntas/${id}`);
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao deletar pergunta';
    }
  }
};

export default PerguntasService;