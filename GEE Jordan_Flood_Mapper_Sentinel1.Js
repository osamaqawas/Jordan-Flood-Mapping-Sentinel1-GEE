/**
 * ==================================================================================
 * 🌊 Jordan National Flood Mapper (Sentinel-1 SAR)
 * ==================================================================================
 * Author: Osama Al-Qawasmeh
 * Objective: Full Jordan analysis, Map visualization, and Comparison by Governorate.
 * ==================================================================================
 */

// 1. Load Administrative Boundaries (Governorates)
var jordanDistricts = ee.FeatureCollection("FAO/GAUL/2015/level1")
    .filter(ee.Filter.eq('ADM0_NAME', 'Jordan'));

Map.centerObject(jordanDistricts, 8);
Map.setOptions('HYBRID');

// 2. Terrain Setup (Slope Mask to avoid false positives in mountains)
var slope = ee.Algorithms.Terrain(ee.Image('USGS/SRTMGL1_003')).select('slope');

// 3. Date Configuration
var before_start = '2025-11-01';
var before_end = '2025-12-10';
var after_start = '2025-12-15'; 
var after_end = '2026-01-04';

// 4. Sentinel-1 SAR Data Processing
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
    .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
    .filter(ee.Filter.bounds(jordanDistricts))
    .select('VH');

var before_img = s1.filterDate(before_start, before_end).median().clip(jordanDistricts);
var after_img = s1.filterDate(after_start, after_end).median().clip(jordanDistricts);

// 5. Flood Detection Logic (Change Detection)
var difference = after_img.divide(before_img);
var flooded = difference.gt(1.25)
    .updateMask(difference.gt(1.25))
    .updateMask(slope.lt(5)); 

// 6. Area Calculation per Governorate
var floodStats = flooded.multiply(ee.Image.pixelArea()).reduceRegions({
  collection: jordanDistricts,
  reducer: ee.Reducer.sum(),
  scale: 100
});

var finalStats = floodStats.map(function(f) {
  var area = ee.Number(f.get('sum')).divide(10000); // Convert to Hectares
  return f.set('Flood_Area_Ha', area);
});

// 7. Map Visualization (Updated to RED)
Map.addLayer(before_img, {min: -25, max: 0}, 'Radar Before (Grey)', false);
Map.addLayer(flooded, {palette: ['#FF0000']}, 'Detected Flood Areas (Red)');
Map.addLayer(jordanDistricts, {color: 'white', fillColor: '00000000'}, 'Governorate Boundaries');

// 8. Bar Chart Comparison
var chart = ui.Chart.feature.byFeature({
  features: finalStats,
  xProperty: 'ADM1_NAME',
  yProperties: ['Flood_Area_Ha']
})
.setChartType('ColumnChart')
.setOptions({
  title: 'Flood Impact by Governorate (Hectares) - 2025',
  hAxis: {title: 'Governorate'},
  vAxis: {title: 'Area (Ha)'},
  colors: ['#d63031'],
  legend: {position: 'none'}
});

print(chart);

// ============================================================
// 9. Adding the Map Legend
// ============================================================
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});

var legendTitle = ui.Label({
  value: 'Map Legend',
  style: {fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0', textAlign: 'center'}
});
legend.add(legendTitle);

var makeRow = function(color, name) {
  var colorBox = ui.Label({
    style: {backgroundColor: color, padding: '8px', margin: '0 5px 0 0'}
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(makeRow('#FF0000', 'Detected Flooded Area'));
legend.add(makeRow('#FFFFFF', 'Governorate Boundary'));

Map.add(legend);

// 10. Simple Info Label
print(ui.Label('Red areas represent potential flood zones detected via SAR change detection.'));