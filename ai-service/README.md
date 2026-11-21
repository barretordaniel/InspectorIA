# Servicio de IA (YOLOv8) — costo $0

1. **Entrenar (Google Colab gratis, GPU T4)**
   - Colab → Entorno de ejecución → Cambiar tipo → GPU T4.
   - Sube a Colab esta carpeta `ai-service` y el zip de RDD2022 (descomprímelo en `/content/RDD2022`).
   ```
   !pip install ultralytics
   !python prepare_rdd2022.py --src /content/RDD2022 --out /content/dataset --max-images 6000
   !python train.py --data /content/dataset/data.yaml --epochs 30
   ```
   - Descarga `runs/detect/train/weights/best.pt` y guárdalo como `ai-service/models/best.pt`.

2. **Correr el servicio (en tu PC)**
   ```
   pip install -r requirements.txt
   uvicorn main:app --port 8000
   ```
   Revisa http://localhost:8000/health → `{"model_loaded": true}`.

3. **Activarlo en el backend**: en `application.yml` pon `inspectoria.classifier: remote`
   (o la variable de entorno `CLASSIFIER=remote`) y reinicia.

Limitaciones: RDD2022 solo trae huecos (D40) y grietas (D00/D10/D20); *hundimiento* y *andén roto* necesitan
fotos propias. Son fotos de carretera, no de ciudadanos de cerca: la precisión con fotos de celular será menor
hasta tener un dataset propio.
