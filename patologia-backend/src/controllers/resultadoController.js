// src/controllers/resultadoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ResultadoController {
  // obtém quantidade de tentativas de um aluno em um questionário
  async obterTentativas(req, res, next) {
    try {
      const { alunoId, questionarioId } = req.params;

      const tentativas = await prisma.resultado.count({
        where: {
          alunoId: Number(alunoId),
          questionarioId: Number(questionarioId)
        }
      });

      res.json({ tentativas });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao obter tentativas' });
    }
  }
}

// função alternativa para contar tentativas
async function contarTentativas(req, res) {
  const alunoId = parseInt(req.params.alunoId);
  const questionarioId = parseInt(req.params.questionarioId);

  if (!alunoId || !questionarioId) {
    return res.status(400).json({ message: 'Parâmetros inválidos' });
  }

  try {
    const totalTentativas = await prisma.resultado.count({
      where: {
        alunoId,
        questionarioId
      }
    });

    res.json({ tentativas: totalTentativas });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contar tentativas' });
  }
}

module.exports = { contarTentativas };
module.exports = new ResultadoController();