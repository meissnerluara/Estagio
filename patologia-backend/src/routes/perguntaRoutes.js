const express = require('express');
const router = express.Router();
const perguntaController = require('../controllers/perguntaController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');

// cria pergunta (apenas professor)
router.post('/',
  autenticar,
  autorizar('professor'),
  perguntaController.create
);

// lista perguntas (público)
router.get('/', perguntaController.findAll);

// busca pergunta por id (público)
router.get('/:id([0-9]+)', perguntaController.findOne);

// atualiza pergunta (apenas professor)
router.put('/:id([0-9]+)',
  autenticar,
  autorizar('professor'),
  perguntaController.update
);

// deleta pergunta (apenas professor)
router.delete('/:id([0-9]+)',
  autenticar,
  autorizar('professor'),
  perguntaController.delete
);

module.exports = router;