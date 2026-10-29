/**
 * KrishiMitra (ಕೃಷಿಮಿತ್ರ) - Client-side Agricultural Intelligence Engine
 * Pure Vanilla JavaScript: Runs directly in any browser and on GitHub Pages!
 * Provides dynamic crop evaluation, live Open-Meteo weather feeds, and smart irrigation calculations.
 */

const DISTRICT_DATA = {
  'Hassan': { lat: 13.0033, lon: 76.1004, kannada: 'ಹಾಸನ', zone: 'Southern Transition Zone' },
  'Mandya': { lat: 12.5226, lon: 76.8973, kannada: 'ಮಂಡ್ಯ', zone: 'Southern Dry / Cauvery Basin' },
  'Mysuru': { lat: 12.2958, lon: 76.6394, kannada: 'ಮೈಸೂರು', zone: 'Southern Dry Zone' },
  'Shivamogga': { lat: 13.9299, lon: 75.5681, kannada: 'ಶಿವಮೊಗ್ಗ', zone: 'Malnad / Central Zone' },
  'Chikkamagaluru': { lat: 13.3161, lon: 75.7720, kannada: 'ಚಿಕ್ಕಮಗಳೂರು', zone: 'Hill / Coffee Tract' },
  'Belagavi': { lat: 15.8497, lon: 74.4977, kannada: 'ಬೆಳಗಾವಿ', zone: 'Northern Transition Zone' },
  'Dharwad': { lat: 15.4589, lon: 75.0078, kannada: 'ಧಾರವಾಡ', zone: 'Northern Transition / Black Soil' },
  'Tumakuru': { lat: 13.3409, lon: 77.1006, kannada: 'ತುಮಕೂರು', zone: 'Eastern Dry Zone' },
  'Davangere': { lat: 14.4644, lon: 75.9218, kannada: 'ದಾವಣಗೆರೆ', zone: 'Central Dry Zone' },
  'Bengaluru Rural': { lat: 13.2846, lon: 77.5684, kannada: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ', zone: 'Eastern Dry Zone' },
  'Bagalkot': { lat: 16.1817, lon: 75.6958, kannada: 'ಬಾಗಲಕೋಟೆ', zone: 'Northern Dry Zone' },
  'Ballari': { lat: 15.1394, lon: 76.9214, kannada: 'ಬಳ್ಳಾರಿ', zone: 'Northeastern Dry Zone' },
  'Kalaburagi': { lat: 17.3297, lon: 76.8343, kannada: 'ಕಲಬುರಗಿ', zone: 'Northeastern Transition Zone' },
  'Vijayapura': { lat: 16.8302, lon: 75.7100, kannada: 'ವಿಜಯಪುರ', zone: 'Northern Dry Zone' },
  'Kodagu': { lat: 12.4244, lon: 75.7382, kannada: 'ಕೊಡಗು', zone: 'Western Ghats / Plantation' },
  'Udupi': { lat: 13.3409, lon: 74.7421, kannada: 'ಉಡುಪಿ', zone: 'Coastal Zone' },
  'Chitradurga': { lat: 14.2251, lon: 76.3980, kannada: 'ಚಿತ್ರದುರ್ಗ', zone: 'Central Dry Zone' }
};

const CROP_PROFILES = {
  'Finger Millet (Ragi)': {
    kannadaName: 'ರಾಗಿ (Ragi)',
    botanicalName: 'Eleusine coracana',
    category: 'Millets / Coarse Cereals (ಕಿರುಧಾನ್ಯ)',
    localKarnatakaRelevance: 'Primary staple of Southern Karnataka (Hassan, Mandya, Tumakuru). Extremely drought-resilient and nutritious.',
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
    localKarnatakaRelevance: 'Grown extensively in Cauvery & Hemavathi river basins, coastal plains, and canal-irrigated command belts.',
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
    localKarnatakaRelevance: 'Major high-yielding commercial crop in Hassan, Davangere, Belagavi, and Haveri districts.',
    seasons: ['kharif', 'rabi', 'zaid'],
    soils: ['red_loamy', 'loamy', 'alluvial', 'black_regur'],
    idealNPK: { n: [100, 150], p: [50, 75], k: [40, 60] },
    idealPH: [6.0, 7.5],
    waterRequirement: 'Moderate (500 - 650 mm)',
    dailyWaterConsumptionMm: 5.0,
    criticalStages: ['Tasseling', 'Silking', 'Grain formation'],
    summary: 'High feeder cereal requiring fertile, well-drained loamy soils and warm growing conditions.',
    simpleInstructionEn: 'Maintain 60cm row spacing; ensure drainage to avoid water logging near stem base.',
    simpleInstructionKn: 'ಸಾಲುಗಳ ನಡುವೆ ೬೦ ಸೆಂ.ಮೀ ಅಂತರವಿರಲಿ. ಬುಡದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆ ಇರಲಿ.'
  },
  'Cotton': {
    kannadaName: 'ಹತ್ತಿ (Cotton)',
    botanicalName: 'Gossypium hirsutum',
    category: 'Commercial / Fiber (ವಾಣಿಜ್ಯ ಬೆಳೆ)',
    localKarnatakaRelevance: 'Predominantly grown across the North Karnataka black soil belts (Dharwad, Belagavi, Ballari, Raichur).',
    seasons: ['kharif'],
    soils: ['black_regur', 'alluvial', 'loamy'],
    idealNPK: { n: [80, 130], p: [40, 60], k: [40, 70] },
    idealPH: [6.5, 8.0],
    waterRequirement: 'Moderate to High (600 - 800 mm)',
    dailyWaterConsumptionMm: 5.5,
    criticalStages: ['Square formation', 'Flowering', 'Boll development'],
    summary: 'Deep-rooted commercial fiber crop requiring deep, moisture-retaining black soil and warm temperatures.',
    simpleInstructionEn: 'Ideal for deep black soils. Monitor regularly for sucking pests and bollworms.',
    simpleInstructionKn: 'ಕಪ್ಪು ಎರೇ ಮಣ್ಣಿನಲ್ಲಿ ಉತ್ತಮವಾಗಿ ಬೆಳೆಯುತ್ತದೆ. ಕಾಯಿಕೊರೆಯುವ ಹುಳುಗಳಿಂದ ರಕ್ಷಿಸಿ.'
  },
  'Groundnut (Peanut)': {
    kannadaName: 'ಕಡಲೆಕಾಯಿ (Groundnut / Shenga)',
    botanicalName: 'Arachis hypogaea',
    category: 'Oilseeds / Legumes (ಎಣ್ಣೆಕಾಳು)',
    localKarnatakaRelevance: 'Widespread in rainfed sandy-loam tracts of Tumakuru, Chitradurga, and Belagavi.',
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
  'Coffee (Arabica / Robusta)': {
    kannadaName: 'ಕಾಫಿ (Coffee)',
    botanicalName: 'Coffea arabica / canephora',
    category: 'Plantation (ತೋಟಗಾರಿಕಾ ಬೆಳೆ)',
    localKarnatakaRelevance: 'The jewel of Malnad region (Chikkamagaluru, Kodagu, and Sakleshpur in Hassan district).',
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
    localKarnatakaRelevance: 'Major post-monsoon Rabi crop cultivated extensively in Dharwad, Belagavi, and Kalaburagi black soils.',
    seasons: ['rabi'],
    soils: ['black_regur', 'loamy'],
    idealNPK: { n: [15, 30], p: [35, 60], k: [20, 40] },
    idealPH: [6.0, 7.8],
    waterRequirement: 'Low (250 - 350 mm)',
    dailyWaterConsumptionMm: 2.8,
    criticalStages: ['Pre-flowering', 'Pod formation'],
    summary: 'Cool-season legume requiring residual moisture in heavy black soils; fixes atmospheric nitrogen.',
    simpleInstructionEn: 'Grown on residual soil moisture during winter. Does not need excess surface watering.',
    simpleInstructionKn: 'ಹಿಂಗಾರಿನಲ್ಲಿ ಮಣ್ಣಿನ ತೇವಾಂಶದಲ್ಲೇ ಬೆಳೆಯುತ್ತದೆ. ಹೆಚ್ಚು ನೀರು ಹಾಯಿಸಬೇಡಿ.'
  },
  'Sorghum (Jowar)': {
    kannadaName: 'ಜೋಳ (Jowar / Sorghum)',
    botanicalName: 'Sorghum bicolor',
    category: 'Millets / Coarse Cereals (ಕಿರುಧಾನ್ಯ)',
    localKarnatakaRelevance: 'The primary staple food grain of North Karnataka; cultivated across both Kharif and Rabi.',
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
  'Sugarcane': {
    kannadaName: 'ಕಬ್ಬು (Sugarcane)',
    botanicalName: 'Saccharum officinarum',
    category: 'Cash / Perennial (ವಾಣಿಜ್ಯ ವಾರ್ಷಿಕ)',
    localKarnatakaRelevance: 'Prominent along river basins and canal command areas (Mandya, Belagavi, Bagalkot, Hassan Hemavathi belt).',
    seasons: ['whole_year', 'kharif'],
    soils: ['alluvial', 'loamy', 'black_regur', 'clayey'],
    idealNPK: { n: [150, 250], p: [60, 100], k: [80, 150] },
    idealPH: [6.5, 7.8],
    waterRequirement: 'Very High (1500 - 2200 mm)',
    dailyWaterConsumptionMm: 8.5,
    criticalStages: ['Formative phase', 'Grand growth phase', 'Ripening'],
    summary: 'Heavy nutrient and water demanding annual crop; thrives in rich alluvial and clay loams with constant irrigation.',
    simpleInstructionEn: 'Requires regular canal or drip water. Earth up rows after 90 days of planting.',
    simpleInstructionKn: 'ಹೆಚ್ಚು ನೀರು ಮತ್ತು ಗೊಬ್ಬರ ಅಗತ್ಯವಿರುತ್ತದೆ. ನಾಟಿಯಾದ ೯೦ ದಿನಗಳ ನಂತರ ಸಾಲಿಗೆ ಮಣ್ಣು ಏರಿಸಿ.'
  },
  'Sunflower': {
    kannadaName: 'ಸೂರ್ಯಕಾಂತಿ (Sunflower)',
    botanicalName: 'Helianthus annuus',
    category: 'Oilseeds (ಎಣ್ಣೆಕಾಳು)',
    localKarnatakaRelevance: 'Karnataka is among the leading sunflower producing states in India, centered in dry interior districts.',
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

/**
 * Evaluates inputs and returns scored crop recommendations
 */
function evaluateCrop(inputs) {
  const {
    soilType = 'red_loamy',
    season = 'kharif',
    location = 'Hassan, Karnataka',
    nitrogen = null,
    phosphorus = null,
    potassium = null,
    ph = null
  } = inputs;

  const locLower = (location || '').toLowerCase();
  const scores = [];

  for (const [cropName, profile] of Object.entries(CROP_PROFILES)) {
    let score = 0;
    const matchReasons = [];

    // 1. Season Matching (+35 / -35)
    if (profile.seasons.includes(season) || profile.seasons.includes('whole_year')) {
      score += 35;
      matchReasons.push(`Naturally suited for the ${season.toUpperCase()} cultivation window`);
    } else {
      score -= 35; // Strict seasonal penalty
    }

    // 2. Soil Texture Matching (+30 / -20)
    if (profile.soils.includes(soilType)) {
      score += 30;
      matchReasons.push(`Thrives in ${soilType.replace('_', ' ')} soil profile`);
    } else {
      score -= 20;
    }

    // 3. Regional Agro-Climatic Alignment (+15 bonus)
    if (cropName.includes('Coffee') && (locLower.includes('chik') || locLower.includes('sakle') || locLower.includes('koda') || locLower.includes('shiva'))) {
      score += 25;
      matchReasons.push(`Highly indigenous to Malnad & Western Ghats coffee belt`);
    } else if (cropName.includes('Cotton') && (locLower.includes('dhar') || locLower.includes('bela') || locLower.includes('ball') || locLower.includes('kala') || locLower.includes('vija') || locLower.includes('baga'))) {
      score += 20;
      matchReasons.push(`Leading commercial cash crop of North Karnataka black soil belts`);
    } else if (cropName.includes('Chickpea') && season === 'rabi' && (locLower.includes('dhar') || locLower.includes('bela') || locLower.includes('kala') || locLower.includes('baga'))) {
      score += 20;
      matchReasons.push(`Premier post-monsoon Rabi pulse of Northern Karnataka`);
    } else if (cropName.includes('Paddy') && (locLower.includes('mand') || locLower.includes('mys') || locLower.includes('udupi') || locLower.includes('shiva') || locLower.includes('hema') || locLower.includes('cauvery'))) {
      score += 20;
      matchReasons.push(`Optimal for irrigated river command basins`);
    } else if (cropName.includes('Finger Millet') && (locLower.includes('hassan') || locLower.includes('tuma') || locLower.includes('beng') || locLower.includes('mand') || locLower.includes('kola') || locLower.includes('chitra'))) {
      score += 20;
      matchReasons.push(`Primary staple crop of Southern Karnataka dry tracts`);
    }

    // 4. N-P-K Nutrient Scoring (if provided)
    const hasN = nitrogen != null && !isNaN(Number(nitrogen)) && Number(nitrogen) > 0;
    const hasP = phosphorus != null && !isNaN(Number(phosphorus)) && Number(phosphorus) > 0;
    const hasK = potassium != null && !isNaN(Number(potassium)) && Number(potassium) > 0;

    if (hasN || hasP || hasK) {
      if (hasN) {
        const n = Number(nitrogen);
        const [minN, maxN] = profile.idealNPK.n;
        if (n >= minN && n <= maxN) {
          score += 12;
          matchReasons.push(`Soil Nitrogen (${n} kg/ha) matches target [${minN}-${maxN}]`);
        } else {
          const dist = Math.min(Math.abs(n - minN), Math.abs(n - maxN));
          score += Math.max(0, 12 - (dist / 10));
        }
      }
      if (hasP) {
        const p = Number(phosphorus);
        const [minP, maxP] = profile.idealNPK.p;
        if (p >= minP && p <= maxP) {
          score += 8;
          matchReasons.push(`Phosphorus (${p} kg/ha) satisfies requirement [${minP}-${maxP}]`);
        }
      }
      if (hasK) {
        const k = Number(potassium);
        const [minK, maxK] = profile.idealNPK.k;
        if (k >= minK && k <= maxK) {
          score += 8;
          matchReasons.push(`Potassium (${k} kg/ha) satisfies target [${minK}-${maxK}]`);
        }
      }
    } else {
      score += 10;
      matchReasons.push(`Evaluated via soil texture, season cycle & regional agro-ecological suitability.`);
    }

    // 5. pH Scoring
    if (ph != null && !isNaN(Number(ph)) && Number(ph) > 0) {
      const phVal = Number(ph);
      const [minPh, maxPh] = profile.idealPH;
      if (phVal >= minPh && phVal <= maxPh) {
        score += 8;
        matchReasons.push(`Soil pH (${phVal}) falls within ideal range (${minPh} - ${maxPh})`);
      } else {
        score -= 6;
      }
    }

    scores.push({
      crop: cropName,
      profile,
      score: Math.round(score),
      matchReasons
    });
  }

  // Sort descending
  scores.sort((a, b) => b.score - a.score);

  const topMatch = scores[0];
  const alternatives = scores.slice(1, 3).map(s => s.crop);

  const explanations = [
    `Recommended crop '${topMatch.crop}' achieved the highest agronomic compatibility score (${topMatch.score}/100) based on your selected ${soilType.replace('_', ' ')} soil and ${season.toUpperCase()} seasonal cycle.`,
    ...topMatch.matchReasons.slice(0, 3),
    `Agronomic summary: ${topMatch.profile.summary}`
  ];

  return {
    crop: topMatch.crop,
    profile: topMatch.profile,
    score: topMatch.score,
    explanation: explanations,
    suitableAlternatives: alternatives,
    evaluatedAt: new Date().toISOString()
  };
}

/**
 * Fetches Live Open-Meteo Weather for any Karnataka District with automatic fallback
 */
async function fetchDistrictWeather(districtName) {
  // Find matching district
  let cleanName = 'Hassan';
  for (const name of Object.keys(DISTRICT_DATA)) {
    if (districtName.toLowerCase().includes(name.toLowerCase())) {
      cleanName = name;
      break;
    }
  }

  const district = DISTRICT_DATA[cleanName] || DISTRICT_DATA['Hassan'];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${district.lat}&longitude=${district.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    const curr = data.current;
    const daily = data.daily;

    const weatherCodeDesc = decodeWeatherCode(curr.weather_code);

    const forecastDays = [];
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
      const codeInfo = decodeWeatherCode(daily.weather_code[i]);
      const dateObj = new Date(daily.time[i]);
      const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      forecastDays.push({
        dayName,
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        rainChance: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 20,
        precipMm: daily.precipitation_sum ? Math.round(daily.precipitation_sum[i] * 10) / 10 : 0,
        icon: codeInfo.icon,
        desc: codeInfo.textEn
      });
    }

    return {
      location: `${cleanName}, Karnataka`,
      districtName: cleanName,
      kannadaName: district.kannada,
      zone: district.zone,
      temperature: Math.round(curr.temperature_2m * 10) / 10,
      apparentTemperature: Math.round(curr.apparent_temperature * 10) / 10,
      humidity: Math.round(curr.relative_humidity_2m),
      precipitation: curr.precipitation || 0,
      rainChance: daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 30,
      windSpeed: Math.round(curr.wind_speed_10m * 10) / 10,
      pressure: Math.round(curr.surface_pressure),
      conditionText: weatherCodeDesc.textEn,
      conditionKn: weatherCodeDesc.textKn,
      icon: weatherCodeDesc.icon,
      forecast: forecastDays,
      isLive: true,
      observationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (err) {
    console.warn('Open-Meteo live feed error, loading high-fidelity regional baseline:', err);
    return getFallbackWeather(cleanName);
  }
}

function decodeWeatherCode(code) {
  if (code === 0) return { textEn: 'Clear Skies', textKn: 'ಬಿಸಿಲು / ನಿರ್ಮಲ ಆಕಾಶ', icon: '☀️' };
  if (code === 1 || code === 2) return { textEn: 'Partly Cloudy', textKn: 'ಭಾಗಶಃ ಮೋಡ', icon: '⛅' };
  if (code === 3) return { textEn: 'Overcast', textKn: 'ಮೋಡ ಕವಿದ ವಾತಾವರಣ', icon: '☁️' };
  if (code >= 45 && code <= 48) return { textEn: 'Foggy / Mist', textKn: 'ದಟ್ಟ ಮಂಜು', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { textEn: 'Light Drizzle', textKn: 'ತುಂತುರು ಮಳೆ', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { textEn: 'Moderate Rain', textKn: 'ಸಾಧಾರಣ ಮಳೆ', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { textEn: 'Scattered Showers', textKn: 'ಚದುರಿದ ಮಳೆ', icon: '🌧️' };
  if (code >= 95) return { textEn: 'Thunderstorm', textKn: 'ಗುಡುಗು ಸಹಿತ ಮಳೆ', icon: '⛈️' };
  return { textEn: 'Mild Weather', textKn: 'ಸಾಧಾರಣ ಹವಾಮಾನ', icon: '🌤️' };
}

function getFallbackWeather(districtName) {
  const district = DISTRICT_DATA[districtName] || DISTRICT_DATA['Hassan'];
  const baselines = {
    'Hassan': { temp: 26.8, hum: 74, rain: 45, wind: 12.4, condEn: 'Light Drizzle', condKn: 'ತುಂತುರು ಮಳೆ', icon: '🌦️' },
    'Dharwad': { temp: 29.5, hum: 58, rain: 20, wind: 14.1, condEn: 'Partly Cloudy', condKn: 'ಭಾಗಶಃ ಮೋಡ', icon: '⛅' },
    'Belagavi': { temp: 27.2, hum: 68, rain: 35, wind: 13.0, condEn: 'Scattered Clouds', condKn: 'ಮೋಡ ಕವಿದ ವಾತಾವರಣ', icon: '☁️' },
    'Mandya': { temp: 28.6, hum: 66, rain: 25, wind: 10.2, condEn: 'Warm & Sunny', condKn: 'ಬಿಸಿಲು', icon: '☀️' },
    'Mysuru': { temp: 28.0, hum: 70, rain: 30, wind: 11.0, condEn: 'Partly Cloudy', condKn: 'ಭಾಗಶಃ ಮೋಡ', icon: '⛅' },
    'Shivamogga': { temp: 27.0, hum: 78, rain: 55, wind: 11.5, condEn: 'Intermittent Showers', condKn: 'ಚದುರಿದ ಮಳೆ', icon: '🌧️' },
    'Chikkamagaluru': { temp: 24.2, hum: 82, rain: 60, wind: 13.8, condEn: 'Mist & Showers', condKn: 'ಮಂಜು ಮತ್ತು ತುಂತುರು ಮಳೆ', icon: '🌦️' },
    'Ballari': { temp: 32.4, hum: 44, rain: 10, wind: 15.0, condEn: 'Dry & Sunny', condKn: 'ಒಣ ಬಿಸಿಲು', icon: '☀️' }
  };

  const b = baselines[districtName] || { temp: 27.5, hum: 65, rain: 30, wind: 12.0, condEn: 'Mild Weather', condKn: 'ಸಾಧಾರಣ ಹವಾಮಾನ', icon: '🌤️' };

  return {
    location: `${districtName}, Karnataka`,
    districtName,
    kannadaName: district.kannada,
    zone: district.zone,
    temperature: b.temp,
    apparentTemperature: b.temp + 1.2,
    humidity: b.hum,
    precipitation: b.rain > 40 ? 3.5 : 0.4,
    rainChance: b.rain,
    windSpeed: b.wind,
    pressure: 1012,
    conditionText: b.condEn,
    conditionKn: b.condKn,
    icon: b.icon,
    forecast: [
      { dayName: 'Today', date: 'Oct 29', maxTemp: Math.round(b.temp + 2), minTemp: Math.round(b.temp - 6), rainChance: b.rain, icon: b.icon },
      { dayName: 'Fri', date: 'Oct 30', maxTemp: Math.round(b.temp + 3), minTemp: Math.round(b.temp - 5), rainChance: Math.max(10, b.rain - 10), icon: '⛅' },
      { dayName: 'Sat', date: 'Oct 31', maxTemp: Math.round(b.temp + 3), minTemp: Math.round(b.temp - 5), rainChance: 15, icon: '☀️' },
      { dayName: 'Sun', date: 'Nov 01', maxTemp: Math.round(b.temp + 4), minTemp: Math.round(b.temp - 4), rainChance: 10, icon: '☀️' },
      { dayName: 'Mon', date: 'Nov 02', maxTemp: Math.round(b.temp + 3), minTemp: Math.round(b.temp - 5), rainChance: 20, icon: '🌤️' }
    ],
    isLive: false,
    observationTime: 'Current Regional Model'
  };
}
