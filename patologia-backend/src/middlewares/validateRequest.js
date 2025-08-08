const { HttpError } = require('../utils/HttpError');

// middleware para validar requisições usando um schema joi
const validateRequest = (schema, property = 'body') => {
  return (req, next) => {
    console.log('Validando requisição...');
    console.log('Dados recebidos:', req[property]);

    const { error } = schema.validate(req[property], { 
      abortEarly: false,
      allowUnknown: property === 'body'
    });

    if (error) {
      console.log('Erros de validação encontrados:', error.details);
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, '')
      }));
      // lança erro http 422 se houver erro de validação
      throw new HttpError(422, 'Validação falhou', { errors });
    }

    console.log('Validação passou com sucesso');
    next();
  };
};

module.exports = validateRequest;