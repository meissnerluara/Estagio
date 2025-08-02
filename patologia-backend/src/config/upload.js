const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { HttpError } = require('../utils/HttpError');

// configura onde e como os arquivos serão salvos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// filtra arquivos permitidos (apenas imagens jpeg, png ou gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new HttpError(400, 'Tipo de arquivo não suportado. Apenas imagens JPEG, PNG ou GIF são permitidas.'), false);
  }
};

// exporta configuração do multer com limite de 10MB
module.exports = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});