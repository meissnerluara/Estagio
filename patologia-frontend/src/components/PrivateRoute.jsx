import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, role }) {
  const { usuario } = useAuth();

  // verifica se usuário está autenticado
  if (!usuario) return <Navigate to="/" />;

  // verifica se usuário tem o role correto
  if (role && usuario.tipo !== role) return <Navigate to="/" />;

  // renderiza o conteúdo protegido
  return children;
}