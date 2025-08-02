const express = require('express');
const router = express.Router();
const respostaController = require('../controllers/respostaController');
const { autenticar } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { respostaSchema } = require('../validators/respostaValidators');

// cria resposta para questionário (autenticado)
router.post('/',
  autenticar,
  validateRequest(respostaSchema),
  respostaController.create
);

// lista respostas (autenticado)
router.get('/',
  autenticar,
  respostaController.findAll
);

// busca resposta específica (autenticado)
router.get('/:id([0-9]+)',
  autenticar,
  respostaController.findOne
);

// deleta resposta (autenticado)
router.delete('/:id([0-9]+)',
  autenticar,
  respostaController.delete
);

module.exports = router;