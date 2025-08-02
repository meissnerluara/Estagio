const { HttpError } = require('../utils/HttpError');

// middleware global para tratamento de erros
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // trata erros http personalizados
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // trata erros de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // trata erros do prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      error: 'Já existe um registro com esses dados'
    });
  }

  // erro interno genérico
  res.status(500).json({
    success: false,
    error: 'Erro interno no servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;