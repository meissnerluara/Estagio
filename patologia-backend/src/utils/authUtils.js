const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// configurações de segurança do jwt
const JWT_CONFIG = {
  expiresIn: '24h',
  issuer: 'patologIA-api',
  audience: ['aluno', 'professor']
};

// tempo de expiração do token (24 horas)
const TOKEN_EXPIRATION = 24 * 60 * 60; // segundos

module.exports = {
  // cria hash da senha
  hashSenha: (senha) => {
    if (!senha || typeof senha !== 'string') {
      throw new Error('Senha inválida');
    }
    return bcrypt.hashSync(senha, 12);
  },

  // compara senha com hash
  compararSenhas: (senha, hash) => {
    if (!senha || !hash) {
      throw new Error('Senha e hash são obrigatórios');
    }
    return bcrypt.compareSync(senha, hash);
  },

  // gera token jwt
  gerarToken: (id, tipo) => {
    if (!id || !tipo || !['aluno', 'professor'].includes(tipo)) {
      throw new Error('Dados inválidos para gerar token');
    }
    return jwt.sign(
      { id, tipo },
      process.env.JWT_SECRET,
      JWT_CONFIG
    );
  },

  // verifica e decodifica token jwt
  verificarToken: (token) => {
    if (!token) {
      throw new Error('Token não fornecido');
    }
    try {
      return jwt.verify(token, process.env.JWT_SECRET, JWT_CONFIG);
    } catch (err) {
      console.error('Erro na verificação do token:', err.message);
      throw new Error('Token inválido ou expirado');
    }
  },

  // autentica usuário no sistema
  autenticarUsuario: async (email, senha, tipo) => {
    if (!email || !senha || !tipo) {
      throw new Error('Credenciais incompletas');
    }
    if (!['aluno', 'professor'].includes(tipo)) {
      throw new Error('Tipo de usuário inválido');
    }
    const usuario = await prisma[tipo].findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senha: true,
        ...(tipo === 'aluno' && { rgm: true }),
        ...(tipo === 'professor' && { matriculas: true })
      }
    });
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    if (!usuario.senha) {
      throw new Error('Conta não configurada corretamente');
    }
    const senhaValida = this.compararSenhas(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }
    // remove a senha antes de retornar
    delete usuario.senha;
    return usuario;
  },

  // cria cookie seguro para autenticação
  setAuthCookie: (res, token) => {
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRATION * 1000,
      path: '/'
    });
  },

  // limpa cookie de autenticação
  clearAuthCookie: (res) => {
    res.clearCookie('token', {
      path: '/'
    });
  }
};