const exameService = require('../services/exameService');
const { HttpError } = require('../utils/HttpError');

class ExameController {
  // cria um novo exame (upload de imagem)
  async create(req, res, next) {
    try {
      if (!req.file) {
        throw new HttpError(400, 'Nenhuma imagem enviada');
      }

      const tokenData = req.user;

      const exame = await exameService.criarExame({
        ...req.body,
        imagem: req.file,
        professorId: tokenData.id
      });

      res.status(201).json(exame);
    } catch (error) {
      next(error);
    }
  }

  // lista todos os exames
  async findAll(req, res, next) {
    try {
      const exames = await exameService.listarExames();
      res.json(exames);
    } catch (error) {
      next(error);
    }
  }

  // busca exame por id
  async findOne(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpError(400, 'ID inválido');

      const exame = await exameService.obterExamePorId(id);
      if (!exame) throw new HttpError(404, 'Exame não encontrado');

      res.json(exame);
    } catch (error) {
      next(error);
    }
  }

  // atualiza exame
  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpError(400, 'ID inválido');

      const exame = await exameService.atualizarExame(id, req.body);
      res.json(exame);
    } catch (error) {
      next(error);
    }
  }

  // deleta exame
  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpError(400, 'ID inválido');

      await exameService.deletarExame(id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ExameController();