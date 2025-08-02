const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { gerarToken } = require('../utils/authUtils');
const { professorSchema, alunoSchema } = require('../validators/authValidators');
const prisma = require('../prismaClientInstance');

// função auxiliar para criar usuário no banco
const createUser = async (userData, tipo) => {
  const hashedPassword = await bcrypt.hash(userData.senha, 10);

  if (tipo === 'aluno') {
    return prisma.aluno.create({
      data: {
        nome: userData.nome,
        email: userData.email,
        senha: hashedPassword,
        rgm: userData.rgm,
        curso: userData.curso,
        periodo: userData.periodo,
        turma: userData.turma,
        tipo: 'aluno'
      }
    });
  } else {
    return prisma.professor.create({
      data: {
        nome: userData.nome,
        email: userData.email,
        senha: hashedPassword,
        matricula: userData.matricula,
        tipo: 'professor'
      }
    });
  }
};

// login de usuário (aluno ou professor)
exports.login = async (req, res) => {
  const { email, senha, tipo } = req.body;

  try {
    await prisma.$queryRaw`SELECT 1`;

    // busca usuário pelo tipo e email
    const user = await prisma[tipo].findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: `${tipo} não encontrado` });
    }

    // compara senha informada com hash
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const { senha: _, ...userWithoutPassword } = user;
    const token = gerarToken(user.id, tipo);

    res.json({
      token,
      usuario: {
        ...userWithoutPassword,
        tipo
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Erro interno no servidor',
      error: error.message
    });
  }
};

// cadastro de aluno
exports.registerAluno = async (req, res) => {
  try {
    const { error, value } = alunoSchema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      return res.status(422).json({
        success: false,
        error: 'Validação falhou',
        details: error.details
      });
    }

    const hashedPassword = await bcrypt.hash(value.senha, 10);

    const novoAluno = await prisma.aluno.create({
      data: {
        nome: value.nome,
        email: value.email,
        senha: hashedPassword,
        rgm: value.rgm,
        curso: value.curso,
        periodo: value.periodo,
        turma: value.turma,
        tipo: 'aluno'
      }
    });

    const token = gerarToken(novoAluno.id, 'aluno');

    return res.status(201).json({
      success: true,
      message: 'Aluno cadastrado com sucesso',
      usuario: {
        id: novoAluno.id,
        nome: novoAluno.nome,
        email: novoAluno.email,
        tipo: 'aluno'
      },
      token
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao cadastrar aluno',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// cadastro de professor
exports.registerProfessor = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const { error, value } = professorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        details: error.details
      });
    }

    const { nome, email, senha, matricula } = value;

    // verifica se email ou matrícula já existem
    const existingEmail = await prisma.professor.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: 'E-mail já cadastrado' });
    }
    const existingMatricula = await prisma.professor.findUnique({ where: { matricula } });
    if (existingMatricula) {
      return res.status(409).json({ message: 'Matrícula já cadastrada' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const novoProfessor = await prisma.professor.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        matricula,
        tipo: 'professor'
      }
    });

    const token = gerarToken(novoProfessor.id, 'professor');

    return res.status(201).json({
      message: 'Professor cadastrado com sucesso',
      usuario: {
        id: novoProfessor.id,
        nome: novoProfessor.nome,
        email: novoProfessor.email,
        tipo: 'professor'
      },
      token
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Erro interno ao cadastrar professor',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// logout (apenas resposta simples)
exports.logout = async (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
};

// verifica se o token é válido
exports.verify = async (req, res) => {
  res.json({ valid: true });
};

// retorna dados do usuário autenticado
exports.verificarAutenticacao = (req, res) => {
  res.json({
    id: req.usuario.id,
    tipo: req.usuario.tipo,
    email: req.usuario.email,
    nome: req.usuario.nome
  });
};

module.exports = exports;