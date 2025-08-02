const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

class ExameService {
  // cria um novo exame e salva imagem no disco
  async criarExame({ nome, tipoImagem, especialidade, imagem, professorId }) {
    const extensao = path.extname(imagem.originalname);
    const nomeArquivo = `${Date.now()}${extensao}`;
    const caminho = path.join(__dirname, '../../uploads', nomeArquivo);

    await fs.promises.rename(imagem.path, caminho);

    return prisma.exame.create({
      data: {
        nome,
        tipoImagem,
        especialidade,
        imagemUrl: `/uploads/${nomeArquivo}`,
        professorId: professorId
      },
      include: { perguntas: true }
    });
  }

  // lista todos os exames
  async listarExames() {
    return prisma.exame.findMany({
      orderBy: { createdAt: 'desc' },
      include: { perguntas: true }
    });
  }

  // busca exame por id
  async obterExamePorId(id) {
    try {
      const idNumber = Number(id);
      if (isNaN(idNumber)) throw new Error('ID deve ser um número');
      return await prisma.exame.findUnique({
        where: { id: idNumber },
        include: { perguntas: true }
      });
    } catch (error) {
      throw error;
    }
  }

  // atualiza exame por id
  async atualizarExame(id, dados) {
    try {
      const { perguntas, createdAt, updatedAt, ...dadosParaAtualizar } = dados;
      return await prisma.exame.update({
        where: { id: Number(id) },
        data: dadosParaAtualizar,
        include: { perguntas: true }
      });
    } catch (error) {
      throw error;
    }
  }

  // deleta exame por id
  async deletarExame(id) {
    try {
      const idNumber = Number(id);
      if (isNaN(idNumber)) throw new Error('ID deve ser um número');
      return await prisma.exame.delete({
        where: { id: idNumber }
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExameService();