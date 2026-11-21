"""Convierte RDD2022 (anotaciones Pascal VOC .xml) al formato YOLO, usando solo D00, D10, D20 y D40.

Uso:  python prepare_rdd2022.py --src RDD2022 --out dataset --max-images 6000
Busca .jpg y .xml de forma recursiva dentro de --src, así que sirve con la estructura de carpetas que traiga el zip.
"""
import argparse
import random
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path

CLASSES = ["D00", "D10", "D20", "D40"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out", default="dataset")
    ap.add_argument("--max-images", type=int, default=6000)
    args = ap.parse_args()

    src, out = Path(args.src), Path(args.out)
    jpgs = {p.stem: p for p in src.rglob("*.jpg")}
    xmls = [p for p in src.rglob("*.xml") if p.stem in jpgs]
    random.seed(0)
    random.shuffle(xmls)

    for split in ("train", "val"):
        (out / "images" / split).mkdir(parents=True, exist_ok=True)
        (out / "labels" / split).mkdir(parents=True, exist_ok=True)

    kept = 0
    for x in xmls:
        if kept >= args.max_images:
            break
        root = ET.parse(x).getroot()
        size = root.find("size")
        w, h = float(size.findtext("width", "0")), float(size.findtext("height", "0"))
        if w <= 0 or h <= 0:
            continue
        lines = []
        for o in root.iter("object"):
            name = o.findtext("name")
            if name not in CLASSES:
                continue
            bb = o.find("bndbox")
            x1, y1, x2, y2 = (float(bb.findtext(k)) for k in ("xmin", "ymin", "xmax", "ymax"))
            cx, cy = (x1 + x2) / 2 / w, (y1 + y2) / 2 / h
            bw, bh = (x2 - x1) / w, (y2 - y1) / h
            lines.append(f"{CLASSES.index(name)} {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}")
        if not lines:
            continue
        split = "val" if kept % 10 == 0 else "train"
        shutil.copy(jpgs[x.stem], out / "images" / split / f"{x.stem}.jpg")
        (out / "labels" / split / f"{x.stem}.txt").write_text("\n".join(lines))
        kept += 1

    names = "\n".join(f"  {i}: {c}" for i, c in enumerate(CLASSES))
    (out / "data.yaml").write_text(
        f"path: {out.resolve().as_posix()}\ntrain: images/train\nval: images/val\nnames:\n{names}\n")
    print(f"Listo: {kept} imágenes -> {out}/data.yaml")


if __name__ == "__main__":
    main()
