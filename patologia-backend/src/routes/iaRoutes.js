require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { execFile } = require('child_process');
const router = express.Router();

// configura upload de arquivos para ia
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/ia-uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// escolhe script python conforme modalidade
function escolherScript(modalidade) {
  if (modalidade === 'raio-x' || modalidade === 'mamografia') {
    return path.join(__dirname, '../../ai-models/torchxray_infer.py');
  }
  if (modalidade === 'tomografia' || modalidade === 'ressonancia') {
    return path.join(__dirname, '../../ai-models/monai_infer.py');
  }
  return null;
}

// caminho do python (pode ser do conda)
const pythonPath = process.env.PYTHON_PATH || 'python';

// endpoint para diagnóstico com ia
router.post('/diagnostico', upload.single('file'), (req, res) => {
  const modalidade = req.body.modalidade?.toLowerCase();
  const regiao = req.body.regiao?.toLowerCase();
  const imagemPath = req.file.path;

  const script = escolherScript(modalidade);
  console.log('Modalidade:', modalidade);
  console.log('Imagem salva em:', imagemPath);
  console.log('Script Python:', script);

  if (!script) {
    return res.status(400).json({ error: 'Modalidade inválida' });
  }

  // executa script python para inferência
  execFile(pythonPath, [script, imagemPath, modalidade, regiao], (error, stdout, stderr) => {
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);

    if (error) {
      console.error('Erro ao executar script:', stderr);
      return res.status(500).json({ error: 'Falha ao processar a imagem' });
    }

    try {
      const resultado = JSON.parse(stdout);
      console.log('Resultado IA:', resultado);
      res.json(resultado);
    } catch (e) {
      console.error('Erro ao parsear o JSON:', stdout);
      res.status(500).json({ error: 'Resposta inválida da IA' });
    }
  });
});

module.exports = router;
