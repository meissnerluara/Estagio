import { useNavigate } from 'react-router-dom';
import styles from '../styles/BotaoVoltar.module.css';

export default function BotaoVoltar() {
  const navigate = useNavigate();

  return (
    // botão que volta para a página anterior
    <button
      onClick={() => navigate(-1)}
      className={styles.botaoVoltar}
    >
      ← Voltar
    </button>
  );
}
