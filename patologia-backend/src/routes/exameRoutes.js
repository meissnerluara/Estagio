const express = require('express');
const router = express.Router();
const exameController = require('../controllers/exameController');
const { autenticar, autorizar } = require('../middlewares/authMiddleware');
const upload = require('../config/upload');

// cria exame (upload de imagem, apenas professor)
router.post('/', 
  autenticar,
  autorizar('professor'),
  upload.single('imagem'),
  exameController.create
);

// lista exames (público)
router.get('/', exameController.findAll);

// busca exame por id (público)
router.get('/:id([0-9]+)', exameController.findOne);

// atualiza exame (apenas professor)
router.put('/:id([0-9]+)', 
  autenticar,
  autorizar('professor'),
  exameController.update
);

// deleta exame (apenas professor)
router.delete('/:id([0-9]+)',
  autenticar,
  autorizar('professor'),
  exameController.delete
);

module.exports = router;