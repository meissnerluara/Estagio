const jwt = require('jsonwebtoken');
const { HttpError } = require('../utils/HttpError');
const prisma = require('../prismaClientInstance');

// middleware para autenticar usuário via token jwt
async function autenticar(req, res, next) {
  try {
    console.log('Headers recebidos:', req.headers);

    // tenta pegar o token do header Authorization
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('Token encontrado no header Authorization');
    }

    // se não encontrou no header, tenta nos cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
      console.log('Token encontrado nos cookies');
    }

    if (!token) {
      console.log('Nenhum token encontrado em nenhuma fonte');
      return next(new HttpError(401, 'Autenticação necessária'));
    }

    console.log('Token recebido:', token);

    // verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token decodificado:', decoded);

    // busca usuário no banco conforme tipo e id do token
    const usuario = await prisma[decoded.tipo].findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        email: true,
        ...(decoded.tipo === 'aluno' && { rgm: true }),
        ...(decoded.tipo === 'professor' && { matricula: true })
      }
    });

    if (!usuario) {
      return next(new HttpError(401, 'Usuário não encontrado'));
    }

    // anexa dados do usuário na requisição
    req.usuario = { ...usuario, tipo: decoded.tipo };
    console.log('Usuário autenticado:', req.usuario);

    next();
  } catch (error) { 
    console.error('Erro na autenticação:', error.message);
    return next(new HttpError(401, 'Token inválido ou expirado'));
  }
}

// middleware para autorizar acesso por tipo de usuário
function autorizar(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.tipo)) {
      return next(new HttpError(403, 'Acesso não autorizado'));
    }
    next();
  };
}

module.exports = { autenticar, autorizar };