const swaggerJsdoc = require('swagger-jsdoc');
const packageJson = require('../../package.json');

// configurações do swagger para documentação da api
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PatologIA API',
      version: packageJson.version,
      description: 'API para o sistema de aprendizado de patologia',
      contact: {
        name: 'Suporte PatologIA',
        email: 'suporte@patologia.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Servidor local'
      }
    ],
    components: {
      // define autenticação JWT para rotas protegidas
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      // define exemplos de schemas de usuário
      schemas: {
        Aluno: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@email.com' },
            rgm: { type: 'string', example: '123456' }
          }
        },
        Professor: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Dra. Maria Souza' },
            email: { type: 'string', example: 'maria@email.com' },
            matriculas: { type: 'string', example: 'CRM/SP 123456' }
          }
        }
      },
      // resposta padrão para erro de autenticação
      responses: {
        UnauthorizedError: {
          description: 'Token inválido ou não fornecido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  erro: { type: 'string', example: 'Não autorizado' }
                }
              }
            }
          }
        }
      }
    },
    // exige autenticação JWT por padrão nas rotas
    security: [{ bearerAuth: [] }]
  },
  // arquivos onde o swagger busca as anotações das rotas e controllers
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;