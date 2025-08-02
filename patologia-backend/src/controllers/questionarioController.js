const questionarioService = require('../services/questionarioService');
const { HttpError } = require('../utils/HttpError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class QuestionarioController {
  // cria um novo questionário
  async create(req, res, next) {
    try {
      const professorId = req.usuario.id;
      const dados = { ...req.body, professorId };

      const questionario = await questionarioService.criarQuestionario(dados);

      const formatted = {
        ...questionario,
        perguntas: questionario.perguntas.map(jp => jp.pergunta)
      };

      res.status(201).json(formatted);
    } catch (error) {
      next(new HttpError(500, error.message || 'Erro ao criar questionário'));
    }
  }

  // lista questionários do aluno autenticado
  async findAll(req, res, next) {
    try {
      const alunoId = req.usuario?.id;
      if (!alunoId) {
        return next(new HttpError(401, 'Usuário não autenticado'));
      }
      const questionarios = await questionarioService.listarQuestionarios(Number(alunoId));
      res.json(questionarios);
    } catch (error) {
      next(new HttpError(500, 'Erro ao listar questionários'));
    }
  }

  // busca questionário por id, bloqueando se já respondido
  async findOne(req, res, next) {
    try {
      const usuario = req.usuario;
      const questionarioId = Number(req.params.id);

      if (usuario.tipo === 'aluno') {
        const resultado = await prisma.resultado.findFirst({
          where: {
            alunoId: usuario.id,
            questionarioId
          }
        });

        if (resultado) {
          return res.status(403).json({ message: 'Este questionário já foi respondido.' });
        }
      }

      const questionario = await questionarioService.obterQuestionarioPorId(questionarioId);

      if (!questionario) {
        return res.status(404).json({ message: 'Questionário não encontrado' });
      }

      res.json({ success: true, data: questionario });
    } catch (error) {
      next(new HttpError(500, 'Erro ao obter questionário'));
    }
  }

  // atualiza questionário se não houver respostas
  async update(req, res, next) {
    try {
      const professorId = req.usuario.id;

      const respostas = await prisma.resposta.findFirst({
        where: { questionarioId: Number(req.params.id) }
      });
      if (respostas) {
        return res.status(403).json({ message: 'Não é possível editar: já existem respostas para este questionário.' });
      }

      const dados = {
        ...req.body,
        professorId
      };

      const questionario = await questionarioService.atualizarQuestionario(
        req.params.id,
        dados
      );
      res.json(questionario);
    } catch (error) {
      next(new HttpError(500, 'Erro ao atualizar questionário'));
    }
  }

  // deleta questionário
  async delete(req, res, next) {
    try {
      await questionarioService.deletarQuestionario(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(new HttpError(500, 'Erro ao excluir questionário'));
    }
  }

  // cria respostas para um questionário e calcula nota
  async criarResposta(req, res, next) {
    try {
      const { questionarioId, respostas } = req.body;
      const alunoId = req.usuario.id;

      const resultado = await questionarioService.criarResposta({
        questionarioId,
        alunoId,
        respostas
      });

      res.status(201).json(resultado);
    } catch (error) {
      next(new HttpError(500, error.message || 'Erro ao salvar respostas'));
    }
  }

  // retorna tentativas de um aluno em um questionário
  async tentativasPorAluno(req, res, next) {
    try {
      const { alunoId, questionarioId } = req.params;

      const respostas = await prisma.resposta.findMany({
        where: {
          alunoId: parseInt(alunoId),
          questionarioId: parseInt(questionarioId)
        },
        select: {
          perguntaId: true
        },
        distinct: ['perguntaId']
      });

      const tentativas = respostas.length > 0 ? 1 : 0;

      res.json({ tentativas });
    } catch (error) {
      next(new HttpError(500, 'Erro ao buscar tentativas anteriores'));
    }
  }

  // lista respostas de um questionário
  async findRespostas(req, res, next) {
    try {
      const respostas = await questionarioService.listarRespostas(req.params.id);
      res.json(respostas);
    } catch (error) {
      next(new HttpError(500, 'Erro ao listar respostas'));
    }
  }
}

module.exports = new QuestionarioController();