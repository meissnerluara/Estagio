const perguntaService = require('../services/perguntaService');
const { HttpError } = require('../utils/HttpError');

class PerguntaController {
  // cria uma nova pergunta
  async create(req, res, next) {
    try {
      const professorId = req.usuario.id;
      const { alternativaA, alternativaB, alternativaC, alternativaD, alternativaE } = req.body;

      if (!alternativaA || !alternativaB || !alternativaC || !alternativaD || !alternativaE) {
        throw new HttpError(400, 'Todas as alternativas devem ser preenchidas');
      }

      const dadosPergunta = {
        enunciado: req.body.enunciado,
        exameId: req.body.exameId,
        alternativaA,
        alternativaB,
        alternativaC,
        alternativaD,
        alternativaE,
        correta: req.body.correta,
        professorId
      };

      const pergunta = await perguntaService.criarPergunta(dadosPergunta);
      res.status(201).json(pergunta);
    } catch (error) {
      next(error);
    }
  }

  // lista perguntas (pode filtrar por exame)
  async findAll(req, res, next) {
    try {
      const { exameId } = req.query;
      const perguntas = await perguntaService.listarPerguntas(exameId);
      res.json(perguntas);
    } catch (error) {
      next(error);
    }
  }

  // busca pergunta por id
  async findOne(req, res, next) {
    try {
      const pergunta = await perguntaService.obterPerguntaPorId(req.params.id);
      if (!pergunta) {
        throw new HttpError(404, 'Pergunta não encontrada');
      }
      res.json(pergunta);
    } catch (error) {
      next(error);
    }
  }

  // atualiza pergunta
  async update(req, res, next) {
    try {
      const pergunta = await perguntaService.atualizarPergunta(
        req.params.id,
        req.body
      );
      res.json(pergunta);
    } catch (error) {
      next(error);
    }
  }

  // deleta pergunta
  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new HttpError(400, 'ID inválido');
      }
      await perguntaService.deletarPergunta(id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PerguntaController();