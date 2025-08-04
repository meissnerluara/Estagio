import axios from 'axios';

// instância do axios com configurações padrão
if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL não está definida. Configure a variável de ambiente corretamente.');
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// interceptador de requisições para adicionar o token ao header authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Token enviado:', token);
  } else {
    console.warn('Nenhum token encontrado no localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error); // em caso de erro na configuração da requisição, rejeita a Promise
});

export default api;