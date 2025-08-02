const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { loginSchema, alunoSchema, professorSchema } = require('../validators/authValidators');

// rotas de autenticação (login, cadastro, logout, verificação)
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/register/aluno', validateRequest(alunoSchema), authController.registerAluno);
router.post('/register/professor', validateRequest(professorSchema), authController.registerProfessor);
router.post('/logout', authController.logout);
router.get('/verify', authController.verify);

// rota protegida para verificar autenticação
router.get('/verificar', autenticar, authController.verificarAutenticacao);

module.exports = router;