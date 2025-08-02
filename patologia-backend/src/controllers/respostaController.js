const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { HttpError } = require('../utils/HttpError');

class RespostaController {
  // cria respostas para um questionário
  async create(req, res, next) {
    try {
      const { questionarioId, respostas } = req.body;
      const alunoId = req.usuario.id;

      // busca perguntas válidas do questionário
      const questionario = await prisma.questionario.findUnique({
        where: { id: questionarioId },
        include: {
          perguntas: {
            include: {
              pergunta: true
            }
          }
        }
      });

      if (!questionario) {
        throw new HttpError(404, 'Questionário não encontrado');
      }

      const perguntasIds = questionario.perguntas.map(p => p.pergunta.id);

      const respostasValidas = respostas.every(r =>
        perguntasIds.includes(r.perguntaId)
      );

      // cria as respostas no banco
      const respostasCriadas = await Promise.all(
        respostas.map(r =>
          prisma.resposta.create({
            data: {
              alunoId,
              questionarioId,
              perguntaId: r.perguntaId,
              alternativa: r.alternativa,
              correta: r.correta ?? false,
              tentativa: r.tentativa ?? 1
            }
          })
        )
      );

      res.status(201).json({ message: 'Respostas salvas com sucesso', respostas: respostasCriadas });
    } catch (error) {
      next(new HttpError(500, error.message || 'Erro ao salvar respostas'));
    }
  }

  // lista respostas de questionários
  async findAll(req, res, next) {
    try {
      const { questionarioId } = req.query;

      const where = {};
      if (questionarioId) where.questionarioId = questionarioId;
      if (req.usuario.tipo === 'aluno') where.alunoId = req.usuario.id;

      const respostas = await prisma.respostaQuestionario.findMany({
        where,
        include: {
          aluno: true,
          questionario: true,
          respostas: {
            include: {
              pergunta: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(respostas);
    } catch (error) {
      next(error);
    }
  }

  // busca resposta específica
  async findOne(req, res, next) {
    try {
      const resposta = await prisma.respostaQuestionario.findUnique({
        where: { id: req.params.id },
        include: {
          aluno: true,
          questionario: {
            include: {
              perguntas: true
            }
          },
          respostas: {
            include: {
              pergunta: true
            }
          }
        }
      });

      if (!resposta) {
        throw new HttpError(404, 'Resposta não encontrada');
      }

      // só professor ou aluno dono pode ver a resposta
      if (req.usuario.tipo === 'aluno' && resposta.alunoId !== req.usuario.id) {
        throw new HttpError(403, 'Acesso não autorizado');
      }

      res.json(resposta);
    } catch (error) {
      next(error);
    }
  }

  // deleta resposta (apenas professor)
  async delete(req, res, next) {
    try {
      if (req.usuario.tipo !== 'professor') {
        throw new HttpError(403, 'Apenas professores podem deletar respostas');
      }

      await prisma.respostaQuestionario.delete({
        where: { id: req.params.id }
      });

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RespostaController();