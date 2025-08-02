import sys
import io
import warnings

def custom_showwarning(message, category, filename, lineno, file=None, line=None):
    print(f"{category.__name__}: {message}", file=sys.stderr)

warnings.showwarning = custom_showwarning

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# redireciona prints para stderr para evitar conflitos de saída
import builtins
builtins.print = lambda *args, **kwargs: __import__('sys').stderr.write(' '.join(map(str, args)) + '\n') if kwargs.get('file', sys.stdout) == sys.stdout else builtins.print(*args, **kwargs)

import json
import torch
import torchxrayvision as xrv
from PIL import Image
import numpy as np
from torchvision import transforms

# =====================
# função para pré-processar a imagem antes da inferência
# =====================
def preprocess_image(image_path):
    img = Image.open(image_path).convert('L')
    img = np.array(img)

    # crop central para quadrado
    h, w = img.shape
    min_dim = min(h, w)
    top = (h - min_dim) // 2
    left = (w - min_dim) // 2
    img = img[top:top+min_dim, left:left+min_dim]

    img = img.astype(np.float32)
    if img.max() > 1:
        img /= 255.0

    img = img * 255
    img = xrv.datasets.normalize(img, 255)

    img = torch.from_numpy(img).unsqueeze(0).unsqueeze(0)
    return img

# =====================
# função principal que executa a inferência com o modelo
# =====================
def run_inference(image_path, modalidade):
    try:
        img_tensor = preprocess_image(image_path)

        if modalidade == "raio-x":
            model = xrv.models.DenseNet(weights="densenet121-res224-all")
            labels = model.pathologies
        else:
            return {"error": "Modalidade inválida. Use apenas 'raio-x'."}

        model.eval()
        outputs = model(img_tensor)[0].detach().numpy()

        resultados = []
        for i, score in enumerate(outputs):
            resultados.append({
                "classe": labels[i],
                "probabilidade": float(score * 100)
            })

        resultados = sorted(resultados, key=lambda x: x["probabilidade"], reverse=True)

        return {
            "modalidade": modalidade,
            "top_diagnosticos": resultados[:5]
        }

    except Exception as e:
        return {"error": str(e)}

# imprime resultado em json para integração com backend
def print_json(obj):
    sys.__stdout__.write(json.dumps(obj) + '\n')
    sys.__stdout__.flush()

# =====================
# main: executa quando chamado via terminal
# =====================
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print_json({"error": "Uso: python torchxray_infer.py caminho_imagem modalidade"})
        sys.exit(1)

    image_path = sys.argv[1]
    modalidade = sys.argv[2].lower()

    resultado = run_inference(image_path, modalidade)
    print_json(resultado)
