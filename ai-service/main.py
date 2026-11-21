"""Servicio de visión artificial de InspectorIA (YOLOv8). Uso: uvicorn main:app --port 8000"""
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image
from ultralytics import YOLO

MODEL_PATH = os.getenv("MODEL_PATH", "models/best.pt")
MIN_CONF = float(os.getenv("MIN_CONF", "0.25"))

# Clases de RDD2022 -> tipo de daño de InspectorIA
# D00 grieta longitudinal, D10 grieta transversal, D20 piel de cocodrilo, D40 hueco
CLASS_TO_TYPE = {
    "longitudinal crack": "Grieta", "transverse crack": "Grieta",
    "alligator crack": "Grieta", "pothole": "Hueco",
}

# Severidad según qué fracción de la foto ocupa el daño (heurística ajustable)
LEVE_MAX = float(os.getenv("LEVE_MAX", "0.03"))
MODERADO_MAX = float(os.getenv("MODERADO_MAX", "0.12"))

app = FastAPI(title="InspectorIA AI")
model = YOLO(MODEL_PATH) if os.path.exists(MODEL_PATH) else None


def severity_from_area(ratio: float) -> str:
    if ratio < LEVE_MAX:
        return "leve"
    if ratio < MODERADO_MAX:
        return "moderado"
    return "grave"


@app.get("/health")
def health():
    return {"model_loaded": model is not None}


@app.post("/classify")
def classify(photo: UploadFile = File(...)):
    if model is None:
        raise HTTPException(503, f"Modelo no cargado: falta {MODEL_PATH}")
    try:
        img = Image.open(photo.file).convert("RGB")
    except Exception:
        raise HTTPException(400, "La imagen no es válida")

    result = model.predict(img, conf=MIN_CONF, verbose=False)[0]
    w, h = img.size
    dets = []
    for box in result.boxes:
        name = result.names[int(box.cls)].lower()
        if name not in CLASS_TO_TYPE:
            continue
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        dets.append({
            "type": CLASS_TO_TYPE[name],
            "conf": float(box.conf),
            "area": max(0.0, (x2 - x1) * (y2 - y1)) / (w * h),
        })
    if not dets:
        raise HTTPException(422, "No se detectó daño vial")

    best = max(dets, key=lambda d: d["conf"])
    worst_area = max(d["area"] for d in dets if d["type"] == best["type"])
    return {
        "type": best["type"],
        "severity": severity_from_area(worst_area),
        "confidence": round(best["conf"] * 100),
    }
