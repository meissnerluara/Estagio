const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class QuestionarioService {
  // cria um novo questionário e vincula perguntas
  async criarQuestionario({ nome, perguntas, professorId }) {
    try {
      const questionario = await prisma.questionario.create({
        data: {
          nome,
          professor: { connect: { id: Number(professorId) } },
          perguntas: {
            create: perguntas.map((perguntaId, index) => ({
              pergunta: { connect: { id: Number(perguntaId) } },
              ordem: index + 1
            }))
          }
        },
        include: {
          perguntas: { include: { pergunta: true } }
        }
      });
      return questionario;
    } catch (error) {
      throw error;
    }
  }

  // lista questionários, incluindo tentativas e nota do aluno
  async listarQuestionarios(alunoId) {
    try {
      const questionarios = await prisma.questionario.findMany({
        include: {
          perguntas: { include: { pergunta: { include: { exame: true } } } },
          professor: true,
          resultados: { where: { alunoId: Number(alunoId) } }
        }
      });
      return questionarios.map(q => ({
        id: q.id,
        nome: q.nome,
        professor: q.professor?.nome || '',
        perguntas: q.perguntas.map(jp => jp.pergunta),
        tentativas: q.resultados.length,
        nota: q.resultados[0]?.nota ?? null,
        exame: q.perguntas[0]?.pergunta?.exame
          ? {
              tipoImagem: q.perguntas[0].pergunta.exame.tipoImagem,
              especialidade: q.perguntas[0].pergunta.exame.especialidade
            }
          : null
      }));
    } catch (error) {
      throw new Error('Erro ao listar questionários: ' + error.message);
    }
  }

  // busca questionário por id, incluindo perguntas e exame
  async obterQuestionarioPorId(id) {
    try {
      const questionario = await prisma.questionario.findUnique({
        where: { id: Number(id) },
        include: {
          perguntas: {
            orderBy: { ordem: 'desc' },
            include: {
              pergunta: { include: { exame: true } }
            }
          }
        }
      });
      if (!questionario) return null;
      return {
        id: questionario.id,
        nome: questionario.nome,
        perguntas: questionario.perguntas.map(qp => ({
          id: qp.pergunta.id,
          texto: qp.pergunta.enunciado,
          alternativas: [
            qp.pergunta.alternativaA,
            qp.pergunta.alternativaB,
            qp.pergunta.alternativaC,
            qp.pergunta.alternativaD,
            qp.pergunta.alternativaE
          ].filter(Boolean),
          correta: qp.pergunta.correta,
          exame: {
            id: qp.pergunta.exame?.id,
            imagemUrl: qp.pergunta.exame?.imagemUrl
          }
        }))
      };
    } catch (error) {
      throw error;
    }
  }

  // atualiza questionário e suas perguntas
  async atualizarQuestionario(id, { nome, perguntas, professorId }) {
    try {
      await prisma.questionarioPergunta.deleteMany({
        where: { questionarioId: Number(id) }
      });
      const questionario = await prisma.questionario.update({
        where: { id: Number(id) },
        data: {
          nome,
          professor: { connect: { id: Number(professorId) } },
          perguntas: {
            create: perguntas.map((perguntaId, index) => ({
              pergunta: { connect: { id: Number(perguntaId) } },
              ordem: index + 1
            }))
          }
        },
        include: {
          perguntas: { include: { pergunta: true } }
        }
      });
      return {
        ...questionario,
        perguntas: questionario.perguntas.map(qp => ({
          ...qp.pergunta,
          ordem: qp.ordem
        }))
      };
    } catch (error) {
      throw error;
    }
  }

  // deleta questionário e suas relações
  async deletarQuestionario(id) {
    try {
      await prisma.resposta.deleteMany({
        where: { questionarioId: Number(id) }
      });
      await prisma.resultado.deleteMany({
        where: { questionarioId: Number(id) }
      });
      await prisma.questionarioPergunta.deleteMany({
        where: { questionarioId: Number(id) }
      });
      await prisma.questionario.delete({
        where: { id: Number(id) }
      });
    } catch (error) {
      throw error;
    }
  }

  // cria respostas para um questionário e calcula nota
  async criarResposta({ questionarioId, alunoId, respostas }) {
    try {
      const questionario = await prisma.questionario.findUnique({
        where: { id: questionarioId }
      });
      if (!questionario) {
        throw new Error('Questionário não encontrado');
      }
      await Promise.all(
        respostas.map(r =>
          prisma.resposta.create({
            data: {
              alunoId,
              questionarioId,
              perguntaId: r.perguntaId,
              alternativa: r.alternativa,
              correta: r.correta ?? false,
              tentativa: r.tentativa
            }
          })
        )
      );
      let nota = 0;
      respostas.forEach(r => {
        if (r.correta) {
          nota += r.tentativa === 1 ? 1 : 0.5;
        }
      });
      nota = Math.min(nota, 10);
      await prisma.resultado.upsert({
        where: {
          alunoId_questionarioId: { alunoId, questionarioId }
        },
        update: { nota },
        create: { alunoId, questionarioId, nota }
      });
      return { success: true, nota };
    } catch (error) {
      throw error;
    }
  }

  // lista respostas de um questionário, incluindo dados do aluno e pergunta
  async listarRespostas(questionarioId) {
    try {
      const respostas = await prisma.resposta.findMany({
        where: { questionarioId: Number(questionarioId) },
        include: {
          aluno: true,
          pergunta: true,
          questionario: {
            include: {
              perguntas: { include: { pergunta: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return respostas.map(r => ({
        id: r.id,
        aluno: {
          nome: r.aluno.nome,
          rgm: r.aluno.rgm,
          curso: r.aluno.curso,
          periodo: r.aluno.periodo,
          turma: r.aluno.turma
        },
        pergunta: { enunciado: r.pergunta.enunciado },
        alternativa: r.alternativa,
        correta: r.correta,
        score: r.correta ? 1 : 0,
        createdAt: r.createdAt
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new QuestionarioService();