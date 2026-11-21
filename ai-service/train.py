"""Entrena YOLOv8 con el dataset preparado. Uso: python train.py --data dataset/data.yaml"""
import argparse

from ultralytics import YOLO

ap = argparse.ArgumentParser()
ap.add_argument("--data", required=True)
ap.add_argument("--epochs", type=int, default=30)
ap.add_argument("--imgsz", type=int, default=640)
ap.add_argument("--batch", type=int, default=16)
ap.add_argument("--model", default="yolov8n.pt")
a = ap.parse_args()

YOLO(a.model).train(data=a.data, epochs=a.epochs, imgsz=a.imgsz, batch=a.batch)
print("Listo. Copia runs/detect/train/weights/best.pt a ai-service/models/best.pt")
