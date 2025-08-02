import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import BotaoVoltar from '../../components/BotaoVoltar';
import '../../styles/global.css';

// regiões disponíveis por modalidade de exame
const REGIOES_POR_MODALIDADE = {
  "raio-x": [{ value: "torax", label: "Tórax" }],
  "tomografia": [
    { value: "pulmao", label: "Pulmão" },
    { value: "baco", label: "Baço" }
  ],
  "ressonancia": [
    { value: "prostata", label: "Próstata" }
  ]
};

// tradução dos diagnósticos para português
const LABELS_PT = {
  "Effusion": "Derrame pleural",
  "Lung Opacity": "Opacidade pulmonar",
  "Enlarged Cardiomediastinum": "Cardiomediastino aumentado",
  "Cardiomegaly": "Cardiomegalia",
  "Atelectasis": "Atelectasia",
  "Consolidation": "Consolidação",
  "Edema": "Edema",
  "Fracture": "Fratura",
  "Lung Lesion": "Lesão pulmonar",
  "Pleural Other": "Outra alteração pleural",
  "Pleural Thickening": "Espessamento pleural",
  "Pneumonia": "Pneumonia",
  "Pneumothorax": "Pneumotórax",
  "Support Devices": "Dispositivos de suporte",
  "Nodule/Mass": "Nódulo/Massa",
  "Aortic enlargement": "Aorta aumentada",
  "Calcification": "Calcificação",
  "ILD": "Doença pulmonar intersticial",
  "Infiltration": "Infiltração",
  "Other lesion": "Outra lesão",
  "Pulmonary fibrosis": "Fibrose pulmonar",
  "Emphysema": "Enfisema",
  "Fibrosis": "Fibrose",
  "Mass": "Massa",
  "Nodule": "Nódulo",
  "Pleural Effusion": "Derrame pleural",
  "Hernia": "Hérnia",
  "No Finding": "Sem achados"
};

function IAsDiagnostico() {
  // estados para arquivo, modalidade, região, resultado, loading e erro
  const [file, setFile] = useState(null);
  const [modalidade, setModalidade] = useState('raio-x');
  const [regiao, setRegiao] = useState('torax');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const resultadoRef = useRef(null);

  // rola para o resultado ao receber resposta
  useEffect(() => {
    if (resultado && resultadoRef.current) {
      resultadoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [resultado]);

  // atualiza arquivo selecionado
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // atualiza modalidade e região
  const handleModalidadeChange = (e) => {
    const novaModalidade = e.target.value;
    setModalidade(novaModalidade);
    const regioes = REGIOES_POR_MODALIDADE[novaModalidade];
    if (regioes && regioes.length > 0) {
      setRegiao(regioes[0].value);
    } else {
      setRegiao('');
    }
  };

  // envia imagem para análise
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setErro('Selecione uma imagem!');
      return;
    }

    setLoading(true);
    setErro(null);
    setResultado(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('modalidade', modalidade);
    formData.append('regiao', regiao);

    try {
      const response = await axios.post('http://localhost:3001/ia/diagnostico', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResultado(response.data); // salva resultado da IA
    } catch (err) {
      setErro('Erro ao analisar a imagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-ia">
      <div className="card max-w-xl mx-auto">
        <BotaoVoltar />
        <h1 className="title text-center mb-4">Análise de Imagem com Inteligência Artificial</h1>

        <form onSubmit={handleSubmit} className="ia-form">
          {/* seleção de modalidade */}
          <div style={{ width: '100%', marginBottom: '0rem', marginTop: '0.7rem' }}>
            <label className="block font-semibold mb-1">Modalidade:</label>
            <select
              value={modalidade}
              onChange={handleModalidadeChange}
              className="input"
              required
            >
              <option value="raio-x">Raio-X (.png / .jpg / .jpeg / .bmp / .tiff)</option>
              <option value="tomografia">Tomografia (.nii / .nii.gz)</option>
              <option value="ressonancia">Ressonância (.nii / .nii.gz)</option>
            </select>
          </div>

          {/* seleção de região anatômica */}
          <div style={{ width: '100%', marginBottom: '0rem' }}>
            <label className="block font-semibold mb-1">Região anatômica:</label>
            <select
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              className="input"
              required
            >
              {REGIOES_POR_MODALIDADE[modalidade]?.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          {/* upload da imagem */}
          <div style={{ width: '100%', marginBottom: '0.5rem' }}>
            <label className="block font-semibold mb-1">Imagem:</label>
            <input
              type="file"
              accept="*"
              onChange={handleFileChange}
              className="input"
              required
            />
          </div>

          {/* botão de análise */}
          <button
            type="submit"
            disabled={loading}
            className="button button-pequeno"
            style={{ marginBottom: '0rem' }}
          >
            {loading ? 'Analisando...' : 'Analisar'}
          </button>
        </form>

        {erro && <div className="bg-red-100 text-red-700 p-3 rounded ia-erro">{erro}</div>}

        {/* exibe resultado da IA */}
        {resultado && (
          <div ref={resultadoRef} className="ia-resultado">
            <h2 className="font-bold text-lg text-center" style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Resultado:</h2>
            {resultado.top_diagnosticos ? (
              <ul style={{ paddingLeft: 0, marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                {resultado.top_diagnosticos.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      listStyle: 'none',
                      margin: '0.5rem 0',
                      padding: 0,
                      fontWeight: 500,
                      fontSize: '1.1rem',
                    }}
                  >
                    <strong>{LABELS_PT[item.classe] || item.classe}</strong>: {item.probabilidade.toFixed(2)}%
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                <li><strong>Diagnóstico:</strong> {resultado.diagnostico}</li>
                {resultado.probabilidade_doente !== undefined && (
                  <>
                    <li><strong>Probabilidade de doente:</strong> {resultado.probabilidade_doente.toFixed(2)}%</li>
                    <li><strong>Probabilidade de saudável:</strong> {resultado.probabilidade_saudavel.toFixed(2)}%</li>
                  </>
                )}
              </ul>
            )}
          </div>
        )}

        {/* link para baixar máscara de predição, se existir */}
        {resultado?.predicao_nii_url && (
          <div style={{ marginTop: '1rem' }}>
            <a
              href={`http://localhost:3001${resultado.predicao_nii_url}`}
              download
              className="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Baixar máscara de predição (.nii)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default IAsDiagnostico;