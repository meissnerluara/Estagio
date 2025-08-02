import { PrismaClient } from '@prisma/client';

// instancia o cliente do prisma para acessar o banco de dados
const prisma = new PrismaClient();

module.exports = { prisma };