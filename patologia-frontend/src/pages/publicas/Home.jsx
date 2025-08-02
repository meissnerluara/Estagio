import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // hook para navegação

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 80px)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      {/* botão para alunos */}
      <div
        onClick={() => navigate('/auth/aluno')}
        style={{
          flex: 1,
          backgroundImage: "url('/images/aluno-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '3rem',
          fontWeight: '700',
          color: 'white',
          textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Sou Aluno
      </div>

      {/* botão para professores */}
      <div
        onClick={() => navigate('/auth/professor')}
        style={{
          flex: 1,
          backgroundImage: "url('/images/professor-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '3rem',
          fontWeight: '700',
          color: 'white',
          textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Sou Professor
      </div>
    </div>
  );
};

export default Home;