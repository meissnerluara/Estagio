// classe de erro http personalizada para respostas padronizadas
class HttpError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);
    this.statusCode = statusCode; // código http do erro
    this.details = details;       // detalhes adicionais do erro
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { HttpError };