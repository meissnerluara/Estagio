// ATUALIZAÇÃO DE questionarioRoutes.js
const express = require('express');
const router = express.Router();
const questionarioController = require('../controllers/questionarioController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { respostaSchema } = require('../validators/respostaValidators');

// cria questionário (apenas professor)
router.post('/',
  autenticar,
  autorizar('professor'),
  questionarioController.create
);

// aluno responde questionário
router.post(
  '/respostas',
  autenticar,
  autorizar('aluno'),
  validateRequest(respostaSchema),
  questionarioController.criarResposta
);

// lista questionários (aluno ou professor)
router.get('/', 
  autenticar, 
  autorizar('aluno', 'professor'),
  questionarioController.findAll
);

// busca questionário por id (aluno ou professor)
router.get('/:id([0-9]+)',
  autenticar,
  autorizar('aluno', 'professor'),
  questionarioController.findOne
);

// lista respostas de um questionário (apenas professor)
router.get('/:id([0-9]+)/respostas', autenticar, autorizar('professor'), questionarioController.findRespostas);

// retorna tentativas de um aluno em um questionário
router.get('/resultados/:alunoId/:questionarioId', questionarioController.tentativasPorAluno);

// atualiza questionário (apenas professor)
router.put('/:id([0-9]+)', 
  autenticar,
  autorizar('professor'),
  questionarioController.update
);

// deleta questionário (apenas professor)
router.delete('/:id([0-9]+)',
  autenticar,
  autorizar('professor'),
  questionarioController.delete
);

module.exports = router;