const Joi = require('joi');

// valida cada item de resposta (perguntaId e alternativa)
const respostaItemSchema = Joi.object({
  perguntaId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID da pergunta deve ser um número',
    'number.positive': 'ID da pergunta deve ser positivo'
  }),
  alternativa: Joi.string().pattern(/^[A-E]$/).required().messages({
    'string.pattern.base': 'Alternativa deve ser uma letra entre A e E'
  })
});

// valida o envio de respostas de um questionário
const respostaSchema = Joi.object({
  questionarioId: Joi.number().integer().positive().required(),
  respostas: Joi.array().items(respostaItemSchema).min(1).required().messages({
    'array.min': 'Deve haver pelo menos uma resposta'
  })
});

module.exports = { 
  respostaSchema,
  respostaItemSchema 
};