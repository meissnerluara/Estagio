const Joi = require('joi');

// validação do login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'E-mail inválido',
    'any.required': 'E-mail é obrigatório'
  }),
  senha: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'any.required': 'Senha é obrigatória'
  }),
  tipo: Joi.string().valid('aluno', 'professor').required().messages({
    'any.only': 'Tipo deve ser "aluno" ou "professor"',
    'any.required': 'Tipo é obrigatório'
  })
});

// validação do cadastro de aluno
const alunoSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  rgm: Joi.string().pattern(/^\d{11}$/).required().messages({
    'string.pattern.base': 'RGM deve conter exatamente 11 dígitos numéricos'
  }),
  curso: Joi.string().required(),
  periodo: Joi.string().required(),
  turma: Joi.string().required(),
  tipo: Joi.string().valid('aluno').required()
}).options({
  abortEarly: false,
  allowUnknown: false
});

// validação do cadastro de professor
const professorSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  matricula: Joi.string().required(),
  senha: Joi.string().min(6).required(),
  tipo: Joi.string().valid('professor').default('professor')
});

module.exports = {
  loginSchema,
  alunoSchema,
  professorSchema
};