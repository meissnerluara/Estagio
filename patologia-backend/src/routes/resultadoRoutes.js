const express = require('express');
const router = express.Router();
const resultadoController = require('../controllers/resultadoController');

// rota para obter quantidade de tentativas de um aluno em um questionário
router.get('/:alunoId/:questionarioId', resultadoController.obterTentativas);

module.exports = router;