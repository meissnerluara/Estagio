const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PerguntaService {
  // cria uma nova pergunta
  async criarPergunta({ exameId, enunciado, alternativas, alternativaA, alternativaB, alternativaC, alternativaD, alternativaE, correta, professorId }) {
    const dados = {
      enunciado,
      correta,
      exameId: Number(exameId),
      professorId: Number(professorId),
      alternativaA: alternativas?.[0] || alternativaA || '',
      alternativaB: alternativas?.[1] || alternativaB || '',
      alternativaC: alternativas?.[2] || alternativaC || '',
      alternativaD: alternativas?.[3] || alternativaD || '',
      alternativaE: alternativas?.[4] || alternativaE || ''
    };
    return prisma.pergunta.create({ data: dados });
  }

  // lista perguntas, pode filtrar por exameId
  async listarPerguntas(exameId = null) {
    const where = exameId ? { exameId } : {};
    return prisma.pergunta.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { exame: true }
    });
  }

  // busca pergunta por id
  async obterPerguntaPorId(id) {
    return prisma.pergunta.findUnique({
      where: { id: Number(id) },
      include: { exame: true }
    });
  }

  // atualiza pergunta por id
  async atualizarPergunta(id, dados) {
    return prisma.pergunta.update({
      where: { id: Number(id) },
      data: dados
    });
  }

  // deleta pergunta por id
  async deletarPergunta(id) {
    return prisma.pergunta.delete({
      where: { id: Number(id) }
    });
  }
}

module.exports = new PerguntaService();