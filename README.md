# 🌊 Jordan National Flood Mapper (Sentinel-1 SAR)

A Google Earth Engine (GEE) application for **national-scale flood mapping in Jordan** using **Sentinel-1 SAR imagery**.  
The system detects flood extent using **pre- and post-event radar change detection**, calculates flooded area per governorate, and visualizes results interactively.

---

## 🎯 Project Objectives
- Detect flood-affected areas across Jordan
- Reduce false detections using terrain slope masking
- Compare flood impacts by governorate
- Provide an educational and research-ready GEE workflow

---

## 🛰️ Satellite Data
### Sentinel-1 SAR (C-band)
- Platform: **Sentinel-1A / 1B**
- Acquisition mode: IW
- Polarization: **VH**
- Spatial resolution: ~10 m
- Advantage: Weather-independent (cloud & night capable)

---

## 🗺️ Study Area
- Entire country of **Jordan**
- Administrative boundaries at **Governorate level (GAUL Level 1)**

---

## ⚙️ Methodology
1. **Load administrative boundaries**
2. **Terrain slope masking** using SRTM (to reduce mountainous false positives)
3. **Radar backscatter change detection**
4. **Flood thresholding** (After / Before > 1.25)
5. **Flood area calculation** (hectares)
6. **Governorate-level comparison**
7. **Interactive visualization and charts**

---

## 📊 Flood Detection Logic
Flooded pixels are identified where:

After_Flood_Image / Before_Flood_Image > 1.25
AND
Slope < 5°

yaml
Copy code

This approach effectively isolates flood-induced backscatter changes while suppressing terrain effects.

---

## 📈 Outputs
- Flood extent map (Red)
- Flooded area per governorate (Hectares)
- Interactive bar chart comparison
- On-map legend and explanations

---

## 🧑‍🎓 Educational Value
This repository is suitable for:
- Remote Sensing courses
- GIS & Environmental Analysis
- Disaster risk management training
- Google Earth Engine teaching labs

---

## 🧪 Technologies Used
- **Google Earth Engine (JavaScript API)**
- **Sentinel-1 SAR**
- **SRTM DEM**
- **FAO GAUL Administrative Boundaries**

---

## ▶️ How to Run the Code
1. Open **Google Earth Engine Code Editor**
   👉 https://code.earthengine.google.com/
2. Copy the code from:
gee/Jordan_Flood_Mapper_Sentinel1.js

yaml
Copy code
3. Paste and run the script
4. Adjust dates and thresholds if needed

---

## 🧑‍💻 Author
**Osama Al-Qawasmeh**  
Yarmouk University  
Remote Sensing & GeoAI Researcher  

---

## 📌 Citation
If you use this work in research or teaching, please cite:

> Al-Qawasmeh, O. (2025). *Jordan National Flood Mapper using Sentinel-1 SAR and Google Earth Engine*.

---

## 📜 License
This project is licensed under the **MIT License** – free to use for academic and educational purposes.
