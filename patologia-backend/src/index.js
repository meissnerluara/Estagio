require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const prisma = require('./prismaClientInstance');

// importa middlewares de autenticação e tratamento de erro
const { autenticar } = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSpec = require('./docs/swagger');

// importa rotas da aplicação
const authRoutes = require('./routes/authRoutes');
const exameRoutes = require('./routes/exameRoutes');
const perguntaRoutes = require('./routes/perguntaRoutes');
const questionarioRoutes = require('./routes/questionarioRoutes');
const respostaRoutes = require('./routes/respostaRoutes');
const resultadoRoutes = require('./routes/resultadoRoutes');
const iaRoutes = require('./routes/iaRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// configura cors para aceitar requisições do frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization']
};

// middlewares básicos para requisições, cookies e arquivos estáticos
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/ia-uploads', express.static(path.join(__dirname, '../uploads/ia-uploads')));

// documentação da api via swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware para checar conexão com o banco de dados
app.use((req, res, next) => {
  prisma.$queryRaw`SELECT 1`
    .then(() => next())
    .catch(err => {
      console.error('Falha na conexão com o banco:', err);
      res.status(503).json({ error: 'Serviço de banco indisponível' });
    });
});

// rotas públicas (login, cadastro, ia)
app.use('/api/auth', authRoutes);
app.use('/ia', iaRoutes);

// middleware de autenticação para rotas protegidas
const authWrapper = (req, res, next) => {
  return autenticar(req, res, next).catch(next);
};

// rotas protegidas (exames, perguntas, questionários, respostas)
app.use('/api/exames', authWrapper, exameRoutes);
app.use('/api/perguntas', authWrapper, perguntaRoutes);
app.use('/api/questionarios', authWrapper, questionarioRoutes);
app.use('/api/respostas', authWrapper, respostaRoutes);
app.use('/api', require('./routes/respostaRoutes'));
app.use('/api/resultados', resultadoRoutes);

// rota de health check
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'online' });
});

// tratamento global de erros
app.use(errorHandler);

// conecta ao banco e inicia o servidor
prisma.$connect()
  .then(() => {
    console.log('Conectado ao banco de dados');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha na conexão com o banco:', err);
    process.exit(1);
  });