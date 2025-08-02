import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Header.module.css";

export default function Header() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const tipoUsuario = usuario?.tipo;

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* título do sistema, redireciona para dashboard conforme tipo de usuário */}
        <h1
          className={styles.headerTitle}
          onClick={() => {
            if (usuario) {
              if (usuario.tipo === "professor") {
                navigate("/professor");
              } else if (usuario.tipo === "aluno") {
                navigate("/aluno");
              }
            } else {
              navigate("/");
            }
          }}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (usuario) {
                if (usuario.tipo === "professor") {
                  navigate("/professor");
                } else if (usuario.tipo === "aluno") {
                  navigate("/aluno");
                }
              } else {
                navigate("/");
              }
            }
          }}
        >
          NOME DO PROJETO
        </h1>

        <nav className={styles.headerNav}>
          {usuario ? (
            <>
              {/* navegação para professor */}
              {tipoUsuario === "professor" && (
                <>
                  <button
                    onClick={() => navigate("/professor")}
                    className={`${styles.navButton} ${
                      location.pathname === "/professor" ? styles.active : ""
                    }`}
                  >
                    Início
                  </button>
                  <button
                    onClick={() => navigate("/professor/exames")}
                    className={`${styles.navButton} ${
                      location.pathname.includes("/professor/exames") ? styles.active : ""
                    }`}
                  >
                    Exames
                  </button>
                  <button
                    onClick={() => navigate("/professor/perguntas")}
                    className={`${styles.navButton} ${
                      location.pathname.includes("/professor/perguntas") ? styles.active : ""
                    }`}
                  >
                    Perguntas
                  </button>
                  <button
                    onClick={() => navigate("/professor/questionario")}
                    className={`${styles.navButton} ${
                      location.pathname.includes("/professor/questionario") ? styles.active : ""
                    }`}
                  >
                    Questionários
                  </button>
                  <button
                    onClick={() => navigate("/professor/respostas")}
                    className={`${styles.navButton} ${
                      location.pathname.includes("/professor/respostas") ? styles.active : ""
                    }`}
                  >
                    Respostas
                  </button>
                </>
              )}

              {/* navegação para aluno */}
              {tipoUsuario === "aluno" && (
                <>
                  <button
                    onClick={() => navigate("/aluno")}
                    className={`${styles.navButton} ${
                      location.pathname === "/aluno" ? styles.active : ""
                    }`}
                  >
                    Início
                  </button>
                  <button
                    onClick={() => navigate("/aluno/questionarios")}
                    className={`${styles.navButton} ${
                      location.pathname.includes("/aluno/questionarios") ? styles.active : ""
                    }`}
                  >
                    Responder Questionários
                  </button>
                </>
              )}

              {/* botão para análise de imagem */}
              <button
                onClick={() => navigate("/ia")}
                className={`${styles.navButton} ${
                  location.pathname === "/ia" ? styles.active : ""
                }`}
              >
                Analisar Imagem
              </button>

              {/* botão para logout */}
              <button onClick={logout} className={`${styles.navButton} ${styles.logoutButton}`}>
                Sair
              </button>
            </>
          ) : (
            // botão para página sobre quando não está logado
            <button
              onClick={() => navigate("/sobre")}
              className={styles.navButton}
            >
              Sobre o Projeto
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
