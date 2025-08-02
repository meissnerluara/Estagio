const { PrismaClient } = require('@prisma/client');

// instancia o cliente do prisma para acessar o banco de dados
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;