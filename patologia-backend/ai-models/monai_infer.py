import sys
import json
import torch
import numpy as np
from monai.bundle import ConfigParser
import os
import nibabel as nib
import uuid

# =====================
# seleciona o bundle do modelo conforme modalidade e região
# =====================
def escolher_bundle(modalidade, regiao):
    bundles_dir = os.path.join(os.path.dirname(__file__), "../monai-bundles")
    if modalidade == "tomografia" and regiao == "pulmao":
        return os.path.join(bundles_dir, "lung/lung_nodule_ct_detection")
    elif modalidade == "tomografia" and regiao == "baco":
        return os.path.join(bundles_dir, "spleen/spleen_ct_segmentation")
    elif modalidade == "ressonancia" and regiao == "prostata":
        return os.path.join(bundles_dir, "prostate/prostate_mri_anatomy")
    else:
        return None

# =====================
# executa a inferência com o modelo monai
# =====================
def run_inference(image_path, modalidade, regiao):
    print(f"Processando imagem: {image_path} | Modalidade: {modalidade} | Região: {regiao}", file=sys.stderr)
    bundle_dir = escolher_bundle(modalidade, regiao)
    print(f"Bundle selecionado: {bundle_dir}", file=sys.stderr)
    if not bundle_dir or not os.path.isdir(bundle_dir):
        return {"error": f"Bundle não encontrado para {modalidade} - {regiao}"}

    try:
        config_file = os.path.join(bundle_dir, "configs", "inference.json")
        config = ConfigParser()
        config.read_config(config_file)

        model = config.get_parsed_content("network")
        pre_transforms = config.get_parsed_content("preprocessing")
        post_transforms = config.get_parsed_content("postprocessing", allow_none=True)

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Usando device: {device}", file=sys.stderr)
        model.to(device)
        model.eval()

        data = {"image": image_path}
        processed = pre_transforms(data)
        img = processed["image"].unsqueeze(0).to(device)

        print(f"Shape da imagem após preprocessamento: {img.shape}", file=sys.stderr)

        with torch.no_grad():
            output = model(img)

        # caso especial: detecção de nódulo pulmonar
        if isinstance(output, dict) and "boxes" in output:
            print(f"Output keys: {list(output.keys())}", file=sys.stderr)
            boxes = output.get("boxes")
            scores = output.get("scores")
            if boxes is not None and len(boxes) > 0:
                maior_score = scores.max().item() if scores is not None else 1.0
                diagnostico = "Possível nódulo detectado."
                prob_doente = round(maior_score * 100, 2)
                prob_saudavel = round(100 - prob_doente, 2)
            else:
                diagnostico = "Nenhum nódulo detectado."
                prob_doente = 0.0
                prob_saudavel = 100.0
            return {
                "modalidade": modalidade,
                "regiao": regiao,
                "diagnostico": diagnostico,
                "probabilidade_doente": prob_doente,
                "probabilidade_saudavel": prob_saudavel
            }

        # caso padrão: modelos de segmentação
        if post_transforms:
            output = post_transforms({"pred": output})["pred"]

        mask = output.cpu().numpy().squeeze()

        # salva máscara segmentada em arquivo NIfTI para download
        output_filename = f"pred_{uuid.uuid4().hex}.nii.gz"
        output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../uploads/ia-uploads"))
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, output_filename)
        nib.save(nib.Nifti1Image(mask.astype(np.uint8), affine=np.eye(4)), output_path)

        possui_segmentacao = bool(np.sum(mask > 0))
        diagnostico = "Estrutura segmentada com sucesso." if possui_segmentacao else "Nenhuma estrutura detectada."

        return {
            "modalidade": modalidade,
            "regiao": regiao,
            "diagnostico": diagnostico,
            "segmentacao_detectada": possui_segmentacao,
            "predicao_nii_url": f"/ia-uploads/{output_filename}"
        }

    except Exception as e:
        print(f"Erro no processamento: {e}", file=sys.stderr)
        return {"error": str(e)}

# =====================
# main: executa quando chamado via terminal
# =====================
if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Uso correto: python monai_infer.py caminho_da_imagem modalidade regiao"}))
        sys.exit(1)

    image_path = sys.argv[1]
    modalidade = sys.argv[2].lower()
    regiao = sys.argv[3].lower()

    resultado = run_inference(image_path, modalidade, regiao)
    print(json.dumps(resultado))
