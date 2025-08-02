const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  // login do professor
  async loginProfessor(email, senha) {
    const professor = await prisma.professor.findUnique({ where: { email } });
    if (!professor || !(await bcrypt.compare(senha, professor.senha))) {
      throw new Error('Credenciais inválidas');
    }
    const token = this.gerarToken(professor.id, 'professor');
    return { ...professor, token };
  }

  // login do aluno
  async loginAluno(email, senha) {
    const aluno = await prisma.aluno.findUnique({ where: { email } });
    if (!aluno || !(await bcrypt.compare(senha, aluno.senha))) {
      throw new Error('Credenciais inválidas');
    }
    const token = this.gerarToken(aluno.id, 'aluno');
    return { ...aluno, token };
  }

  // cadastro de professor
  async registrarProfessor(dados) {
    const senhaHash = await bcrypt.hash(dados.senha, 10);
    return prisma.professor.create({
      data: {
        ...dados,
        senha: senhaHash
      }
    });
  }

  // cadastro de aluno
  async registrarAluno(dados) {
    const senhaHash = await bcrypt.hash(dados.senha, 10);
    return prisma.aluno.create({
      data: {
        ...dados,
        senha: senhaHash
      }
    });
  }

  // gera token jwt
  gerarToken(id, tipo) {
    return jwt.sign({ id, tipo }, process.env.JWT_SECRET, { expiresIn: '8h' });
  }

  // verifica token jwt
  async verificarToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new AuthService();