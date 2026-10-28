/**
 * KrishiMitra - Agricultural Constants and Knowledge Base
 * Based on ICAR (Indian Council of Agricultural Research) &
 * UAS (University of Agricultural Sciences, Bengaluru/Dharwad) guidelines.
 */

export const SOIL_TYPES = [
  { id: 'red_loamy', name: 'Red Sandy / Loamy Soil', description: 'Common in Hassan & Southern Karnataka; porous with good aeration, moderate water retention.' },
  { id: 'black_regur', name: 'Black / Regur Soil', description: 'High clay content, excellent moisture retention, rich in calcium and potash; ideal for cotton, pulses.' },
  { id: 'alluvial', name: 'Alluvial Soil', description: 'Highly fertile river basin soil, rich in potash and humus; excellent for cereals, sugarcane.' },
  { id: 'laterite', name: 'Laterite Soil', description: 'Common in Western Ghats & coastal fringes; acidic, rich in iron/aluminum, requires organic matter.' },
  { id: 'clayey', name: 'Clayey Soil', description: 'Fine texture, very high water holding capacity; suited for paddy and wetland crops.' },
  { id: 'sandy', name: 'Sandy Soil', description: 'High permeability, low water retention; suitable for groundnut, pulses with frequent light irrigation.' },
  { id: 'loamy', name: 'Loamy Soil', description: 'Balanced blend of sand, silt, and clay; universally favorable for most horticultural and field crops.' },
];

export const SEASONS = [
  { id: 'kharif', name: 'Kharif (Monsoon)', period: 'June to October', description: 'Sown with the onset of southwest monsoon, harvested in autumn.' },
  { id: 'rabi', name: 'Rabi (Winter)', period: 'October to March', description: 'Sown after monsoon rains, harvested in spring.' },
  { id: 'zaid', name: 'Zaid (Summer)', period: 'March to June', description: 'Warm dry season crops, grown with irrigation between Rabi and Kharif.' },
  { id: 'whole_year', name: 'Perennial / Whole Year', period: 'Annual cycle', description: 'Long-duration cash crops or plantation crops.' },
];

// District coordinate registry for weather queries (Focus on Karnataka with Hassan / MCE region at core)
export const DISTRICT_COORDINATES = {
  'Hassan': { lat: 13.0033, lon: 76.1004, state: 'Karnataka' },
  'Mandya': { lat: 12.5226, lon: 76.8973, state: 'Karnataka' },
  'Mysuru': { lat: 12.2958, lon: 76.6394, state: 'Karnataka' },
  'Shivamogga': { lat: 13.9299, lon: 75.5681, state: 'Karnataka' },
  'Chikkamagaluru': { lat: 13.3161, lon: 75.7720, state: 'Karnataka' },
  'Belagavi': { lat: 15.8497, lon: 74.4977, state: 'Karnataka' },
  'Dharwad': { lat: 15.4589, lon: 75.0078, state: 'Karnataka' },
  'Tumakuru': { lat: 13.3409, lon: 77.1006, state: 'Karnataka' },
  'Davangere': { lat: 14.4644, lon: 75.9218, state: 'Karnataka' },
  'Bengaluru Rural': { lat: 13.2846, lon: 77.5684, state: 'Karnataka' },
  'Bagalkot': { lat: 16.1817, lon: 75.6958, state: 'Karnataka' },
  'Ballari': { lat: 15.1394, lon: 76.9214, state: 'Karnataka' },
};

export const DEFAULT_LOCATION = 'Hassan, Karnataka';
export const DEFAULT_COORDS = { lat: 13.0033, lon: 76.1004 };

// Crop Agronomic Profiles for Demo Predictor & Irrigation Advisory
export const CROP_PROFILES = {
  'Finger Millet (Ragi)': {
    kannadaName: 'ರಾಗಿ (Ragi)',
    botanicalName: 'Eleusine coracana',
    category: 'Millets / Coarse Cereals (ಕಿರುಧಾನ್ಯ)',
    localKarnatakaRelevance: 'Primary staple of Southern Karnataka (Hassan, Mandya, Tumakuru). Extremely resilient and nutritious.',
    seasons: ['kharif', 'rabi'],
    soils: ['red_loamy', 'laterite', 'loamy', 'sandy'],
    idealNPK: { n: [40, 80], p: [25, 45], k: [25, 50] },
    idealPH: [5.5, 7.5],
    waterRequirement: 'Low to Moderate (350 - 450 mm)',
    dailyWaterConsumptionMm: 3.5,
    criticalStages: ['Tillering', 'Flowering / Panicle emergence', 'Grain filling'],
    summary: 'Hardy drought-resistant crop ideal for red loamy soils with low to moderate nitrogen requirements.',
    simpleInstructionEn: 'Prepare soil well; sow seeds 2-3 cm deep. High drought tolerance with low water need.',
    simpleInstructionKn: 'ಭೂಮಿಯನ್ನು ಚೆನ್ನಾಗಿ ಉಳುಮೆ ಮಾಡಿ ೨-೩ ಸೆಂ.ಮೀ ಆಳದಲ್ಲಿ ಬಿತ್ತಿ. ರಾಗಿಗೆ ಕಡಿಮೆ ನೀರಿದ್ದರೂ ಉತ್ತಮ ಇಳುವರಿ ಬರುತ್ತದೆ.'
  },
  'Paddy (Rice)': {
    kannadaName: 'ಭತ್ತ (Paddy / Rice)',
    botanicalName: 'Oryza sativa',
    category: 'Cereals (ಧಾನ್ಯ)',
    localKarnatakaRelevance: 'Grown extensively in Cauvery/Hemavathi irrigated command areas and coastal Karnataka.',
    seasons: ['kharif', 'rabi'],
    soils: ['clayey', 'alluvial', 'loamy'],
    idealNPK: { n: [80, 150], p: [40, 80], k: [40, 80] },
    idealPH: [5.5, 7.2],
    waterRequirement: 'High (1100 - 1400 mm)',
    dailyWaterConsumptionMm: 7.5,
    criticalStages: ['Panicle initiation', 'Flowering', 'Milk stage'],
    summary: 'Thrives in water-retentive clayey or alluvial soils with high nitrogen and sustained moisture.',
    simpleInstructionEn: 'Level field for uniform water standing. Apply nitrogen fertilizer in two split doses.',
    simpleInstructionKn: 'ಗದ್ದೆಯಲ್ಲಿ ಸಮನಾಗಿ ನೀರು ನಿಲ್ಲಿಸಿ. ರೋಗ ಬರದಂತೆ ನಿಗದಿತ ಅಂತರದಲ್ಲಿ ನಾಟಿ ಮಾಡಿ.'
  },
  'Maize (Corn)': {
    kannadaName: 'ಮೆಕ್ಕೆಜೋಳ (Maize / Corn)',
    botanicalName: 'Zea mays',
    category: 'Cereals (ಧಾನ್ಯ)',
    localKarnatakaRelevance: 'Major commercial crop in Hassan, Davangere, and Belagavi districts.',
    seasons: ['kharif', 'rabi', 'zaid'],
    soils: ['red_loamy', 'loamy', 'alluvial', 'black_regur'],
    idealNPK: { n: [100, 150], p: [50, 75], k: [40, 60] },
    idealPH: [6.0, 7.5],
    waterRequirement: 'Moderate (500 - 650 mm)',
    dailyWaterConsumptionMm: 5.0,
    criticalStages: ['Tasseling', 'Silking', 'Grain formation'],
    summary: 'High feeder crop requiring fertile, well-drained loamy soils and warm growing conditions.',
    simpleInstructionEn: 'Maintain 60cm row spacing; avoid water logging near stem base.',
    simpleInstructionKn: 'ಸಾಲುಗಳ ನಡುವೆ ೬೦ ಸೆಂ.ಮೀ ಅಂತರವಿರಲಿ. ಬುಡದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆ ಇರಲಿ.'
  },
  'Groundnut (Peanut)': {
    kannadaName: 'ಕಡಲೆಕಾಯಿ (Groundnut / Shenga)',
    botanicalName: 'Arachis hypogaea',
    category: 'Oilseeds / Legumes (ಎಣ್ಣೆಕಾಳು)',
    localKarnatakaRelevance: 'Widespread in rainfed areas of Chitradurga, Tumakuru, and Belagavi.',
    seasons: ['kharif', 'rabi', 'zaid'],
    soils: ['red_loamy', 'sandy', 'loamy'],
    idealNPK: { n: [20, 40], p: [40, 70], k: [30, 60] },
    idealPH: [6.0, 7.0],
    waterRequirement: 'Moderate (450 - 550 mm)',
    dailyWaterConsumptionMm: 4.0,
    criticalStages: ['Flowering', 'Pegging', 'Pod development'],
    summary: 'Nitrogen-fixing legume; prefers friable, well-aerated sandy-loam soil for optimal peg penetration.',
    simpleInstructionEn: 'Keep soil loose so pegs enter easily. Provide light irrigation at pod filling stage.',
    simpleInstructionKn: 'ಕಾಯಿ ಚೆನ್ನಾಗಿ ಮಣ್ಣಿನಲ್ಲಿ ಕಟ್ಟಲು ಮಣ್ಣು ಸಡಿಲವಾಗಿರಬೇಕು. ಹೂ ಬಿಡುವಾಗ ಲಘು ನೀರು ಕೊಡಿ.'
  },
  'Cotton': {
    kannadaName: 'ಹತ್ತಿ (Cotton)',
    botanicalName: 'Gossypium hirsutum',
    category: 'Commercial / Fiber (ವಾಣಿಜ್ಯ ಬೆಳೆ)',
    localKarnatakaRelevance: 'Predominantly grown in North Karnataka black soil belts (Dharwad, Belagavi, Ballari).',
    seasons: ['kharif'],
    soils: ['black_regur', 'alluvial', 'loamy'],
    idealNPK: { n: [80, 130], p: [40, 60], k: [40, 70] },
    idealPH: [6.5, 8.0],
    waterRequirement: 'Moderate to High (600 - 800 mm)',
    dailyWaterConsumptionMm: 5.5,
    criticalStages: ['Square formation', 'Flowering', 'Boll development'],
    summary: 'Deep-rooted commercial crop requiring deep moisture-retaining black soil and warm temperatures.',
    simpleInstructionEn: 'Ideal for deep black soils. Monitor for sucking pests and bollworms.',
    simpleInstructionKn: 'ಕಪ್ಪು ಎರೇ ಮಣ್ಣಿನಲ್ಲಿ ಉತ್ತಮವಾಗಿ ಬೆಳೆಯುತ್ತದೆ. ಕಾಯಿಕೊರೆಯುವ ಹುಳುಗಳಿಂದ ರಕ್ಷಿಸಿ.'
  },
  'Sugarcane': {
    kannadaName: 'ಕಬ್ಬು (Sugarcane)',
    botanicalName: 'Saccharum officinarum',
    category: 'Cash / Perennial (ವಾಣಿಜ್ಯ ವಾರ್ಷಿಕ)',
    localKarnatakaRelevance: 'Prominent along river basins (Mandya, Belagavi, Hassan Hemavathi canal belts).',
    seasons: ['whole_year', 'kharif'],
    soils: ['alluvial', 'loamy', 'black_regur', 'clayey'],
    idealNPK: { n: [150, 250], p: [60, 100], k: [80, 150] },
    idealPH: [6.5, 7.8],
    waterRequirement: 'Very High (1500 - 2200 mm)',
    dailyWaterConsumptionMm: 8.5,
    criticalStages: ['Formative phase', 'Grand growth phase', 'Ripening'],
    summary: 'Heavy nutrient and water demanding annual crop; thrives in rich loams with constant irrigation.',
    simpleInstructionEn: 'Requires regular canal or drip water. Earth up rows after 90 days of planting.',
    simpleInstructionKn: 'ಹೆಚ್ಚು ನೀರು ಮತ್ತು ಗೊಬ್ಬರ ಅಗತ್ಯವಿರುತ್ತದೆ. ನಾಟಿಯಾದ ೯೦ ದಿನಗಳ ನಂತರ ಸಾಲಿಗೆ ಮಣ್ಣು ಏರಿಸಿ.'
  },
  'Coffee (Arabica / Robusta)': {
    kannadaName: 'ಕಾಫಿ (Coffee)',
    botanicalName: 'Coffea arabica / canephora',
    category: 'Plantation (ತೋಟಗಾರಿಕಾ ಬೆಳೆ)',
    localKarnatakaRelevance: 'The jewel of Malnad region (Chikkamagaluru, Kodagu, Sakleshpur in Hassan district).',
    seasons: ['whole_year'],
    soils: ['laterite', 'red_loamy'],
    idealNPK: { n: [80, 120], p: [40, 80], k: [80, 120] },
    idealPH: [5.5, 6.5],
    waterRequirement: 'High, well-distributed (1200 - 1800 mm)',
    dailyWaterConsumptionMm: 4.8,
    criticalStages: ['Blossom showers (March)', 'Backing showers', 'Berry expansion'],
    summary: 'Shade-grown plantation crop indigenous to Western Ghats lateritic soils; requires gentle drainage and forest humus.',
    simpleInstructionEn: 'Maintain two-tier shade trees. Ensure blossom irrigation in March if summer rains delay.',
    simpleInstructionKn: 'ಮಲೆನಾಡಿನ ನೆರಳಿನ ತೋಟಗಳಲ್ಲಿ ಉತ್ತಮ. ಮಾರ್ಚ್‌ನಲ್ಲಿ ಹೂ ಮಳೆ ಬರದಿದ್ದರೆ ತುಂತುರು ನೀರಾವರಿ ಒದಗಿಸಿ.'
  },
  'Chickpea (Bengal Gram)': {
    kannadaName: 'ಕಡಲೆ (Bengal Gram / Chana)',
    botanicalName: 'Cicer arietinum',
    category: 'Pulses (ದ್ವಿದಳ ಧಾನ್ಯ)',
    localKarnatakaRelevance: 'Grown extensively as a post-monsoon Rabi crop in northern and central Karnataka.',
    seasons: ['rabi'],
    soils: ['black_regur', 'loamy'],
    idealNPK: { n: [15, 30], p: [35, 60], k: [20, 40] },
    idealPH: [6.0, 7.8],
    waterRequirement: 'Low (250 - 350 mm)',
    dailyWaterConsumptionMm: 2.8,
    criticalStages: ['Pre-flowering', 'Pod formation'],
    summary: 'Cool-season legume requiring residual moisture in heavy black soils; fixing atmospheric nitrogen.',
    simpleInstructionEn: 'Grown on residual soil moisture during winter. Does not need excess surface watering.',
    simpleInstructionKn: 'ಹಿಂಗಾರಿನಲ್ಲಿ ಮಣ್ಣಿನ ತೇವಾಂಶದಲ್ಲೇ ಬೆಳೆಯುತ್ತದೆ. ಹೆಚ್ಚು ನೀರು ಹಾಯಿಸಬೇಡಿ.'
  },
  'Sorghum (Jowar)': {
    kannadaName: 'ಜೋಳ (Jowar / Sorghum)',
    botanicalName: 'Sorghum bicolor',
    category: 'Millets / Coarse Cereals (ಕಿರುಧಾನ್ಯ)',
    localKarnatakaRelevance: 'Staple food grain in North Karnataka; cultivated across both Kharif and Rabi.',
    seasons: ['kharif', 'rabi'],
    soils: ['black_regur', 'red_loamy', 'loamy'],
    idealNPK: { n: [50, 90], p: [30, 50], k: [25, 45] },
    idealPH: [6.0, 7.5],
    waterRequirement: 'Low to Moderate (350 - 500 mm)',
    dailyWaterConsumptionMm: 3.8,
    criticalStages: ['Knee-high', 'Booting', 'Grain milk stage'],
    summary: 'Exceptional drought tolerance; highly suitable for rainfed tracts with clay or loamy profiles.',
    simpleInstructionEn: 'Highly drought resilient. Excellent source of food grain and livestock fodder.',
    simpleInstructionKn: 'ಅತ್ಯಂತ ಬರ ನಿರೋಧಕ ಬೆಳೆ. ಕಡಿಮೆ ಖರ್ಚಿನಲ್ಲಿ ಉತ್ತಮ ಧಾನ್ಯ ಮತ್ತು ದನಗಳಿಗೆ ಮೇವು ಸಿಗುತ್ತದೆ.'
  },
  'Sunflower': {
    kannadaName: 'ಸೂರ್ಯಕಾಂತಿ (Sunflower)',
    botanicalName: 'Helianthus annuus',
    category: 'Oilseeds (ಎಣ್ಣೆಕಾಳು)',
    localKarnatakaRelevance: 'Karnataka is among the leading sunflower producing states in India.',
    seasons: ['kharif', 'rabi', 'zaid'],
    soils: ['black_regur', 'loamy', 'alluvial'],
    idealNPK: { n: [50, 80], p: [45, 70], k: [30, 50] },
    idealPH: [6.5, 7.5],
    waterRequirement: 'Moderate (450 - 550 mm)',
    dailyWaterConsumptionMm: 4.2,
    criticalStages: ['Button stage', 'Flowering', 'Seed development'],
    summary: 'Deep taproot system allows moisture extraction from deeper soil layers; prefers neutral to slightly alkaline soils.',
    simpleInstructionEn: 'Deep rooted crop. Ensure adequate irrigation when flower heads form and seeds fill.',
    simpleInstructionKn: 'ಹೂವು ಅರಳುವ ಮತ್ತು ಕಾಳು ತುಂಬುವ ಸಮಯದಲ್ಲಿ ನೀರಿನ ಕೊರತೆಯಾಗದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.'
  }
};
