"""
Proyecto 03 - Fase 4: Desarrollo - Sprint 1
Transformacion de database.csv (USGS, "Significant Earthquakes 1965-2016",
via Kaggle: https://www.kaggle.com/datasets/usgs/earthquake-database) a JSON.

Uso:
    python3 csv_to_json.py

Entradas:
    data/database.csv   (CSV original, 23412 registros, 21 columnas)

Salidas:
    output/database.json        (arreglo JSON con los registros transformados)
    output/validation_report.json  (reporte de validacion: conteos y hallazgos)
"""

import csv
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_CSV = BASE_DIR / "data" / "database.csv"
OUTPUT_JSON = BASE_DIR / "output" / "database.json"
OUTPUT_REPORT = BASE_DIR / "output" / "validation_report.json"

# Las columnas del CSV original que se conservan en el JSON. Son las
# variables identificadas en la Fase 1 (Analisis): marca de tiempo
# (Date/Time), categoricas (Type, Magnitude Type) y numericas
# (Magnitude, Depth); se agregan Latitude/Longitude porque forman parte
# del modelo de datos "Earthquake" definido en la Fase 3 (Planificacion).
DATE_MMDDYYYY = re.compile(r"^(\d{2})/(\d{2})/(\d{4})$")
DATE_ISO = re.compile(r"^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})")


def normalize_date_time(raw_date, raw_time):
    """Devuelve (date 'YYYY-MM-DD', time 'HH:MM:SS') a partir de los
    formatos encontrados en el CSV original. La mayoria de filas usa
    'MM/DD/YYYY' y 'HH:MM:SS' por separado; 3 filas excepcionales traen
    una marca de tiempo ISO 8601 completa en ambas columnas."""
    m = DATE_MMDDYYYY.match(raw_date)
    if m:
        month, day, year = m.groups()
        return f"{year}-{month}-{day}", raw_time

    m = DATE_ISO.match(raw_date)
    if m:
        year, month, day, hh, mm, ss = m.groups()
        return f"{year}-{month}-{day}", f"{hh}:{mm}:{ss}"

    raise ValueError(f"Formato de fecha no reconocido: {raw_date!r}")


def to_float(value, field_name, row_number):
    value = value.strip()
    if value == "":
        return None
    try:
        return float(value)
    except ValueError as exc:
        raise ValueError(
            f"Fila {row_number}: valor numerico invalido en '{field_name}': {value!r}"
        ) from exc


def transform():
    records = []
    report = {
        "total_filas_leidas": 0,
        "total_registros_generados": 0,
        "fechas_formato_iso_corregidas": 0,
        "magnitude_type_faltante": 0,
        "depth_faltante": 0,
        "magnitude_faltante": 0,
        "tipos_evento_encontrados": set(),
        "errores": [],
    }

    with INPUT_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=2):  # fila 1 es el encabezado
            report["total_filas_leidas"] += 1
            try:
                raw_date = row["Date"].strip()
                raw_time = row["Time"].strip()
                date, time = normalize_date_time(raw_date, raw_time)
                if "T" in raw_date:
                    report["fechas_formato_iso_corregidas"] += 1

                magnitude_type = row["Magnitude Type"].strip()
                if magnitude_type == "":
                    report["magnitude_type_faltante"] += 1
                    magnitude_type = None

                depth = to_float(row["Depth"], "Depth", i)
                if depth is None:
                    report["depth_faltante"] += 1

                magnitude = to_float(row["Magnitude"], "Magnitude", i)
                if magnitude is None:
                    report["magnitude_faltante"] += 1

                event_type = row["Type"].strip()
                report["tipos_evento_encontrados"].add(event_type)

                record = {
                    "date": date,
                    "time": time,
                    "year": int(date[:4]),
                    "latitude": to_float(row["Latitude"], "Latitude", i),
                    "longitude": to_float(row["Longitude"], "Longitude", i),
                    "type": event_type,
                    "depth": depth,
                    "magnitude": magnitude,
                    "magType": magnitude_type,
                    "status": row["Status"].strip() or None,
                }
                records.append(record)
            except ValueError as exc:
                report["errores"].append(str(exc))

    report["total_registros_generados"] = len(records)
    report["tipos_evento_encontrados"] = sorted(report["tipos_evento_encontrados"])

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    with OUTPUT_REPORT.open("w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    transform()
