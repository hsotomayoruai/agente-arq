/**
 * Simulated AI waste classification provider.
 * In production, replace analyze() with a real vision API call.
 */

const WASTE_CATALOG = [
  {
    keywords: ['plastic', 'bottle', 'bag', 'polystyrene', 'foam', 'straw', 'wrapper', 'packaging'],
    wasteType: 'Plástico',
    containerColor: 'yellow',
    containerLabel: 'Contenedor Amarillo',
    containerIcon: '🟡',
    points: 10,
  },
  {
    keywords: ['paper', 'cardboard', 'newspaper', 'magazine', 'book', 'carton', 'box'],
    wasteType: 'Papel y Cartón',
    containerColor: 'blue',
    containerLabel: 'Contenedor Azul',
    containerIcon: '🔵',
    points: 8,
  },
  {
    keywords: ['glass', 'bottle', 'jar', 'crystal', 'window'],
    wasteType: 'Vidrio',
    containerColor: 'green',
    containerLabel: 'Contenedor Verde',
    containerIcon: '🟢',
    points: 12,
  },
  {
    keywords: ['metal', 'can', 'tin', 'aluminum', 'steel', 'iron', 'foil'],
    wasteType: 'Metal',
    containerColor: 'gray',
    containerLabel: 'Contenedor Gris',
    containerIcon: '⚫',
    points: 15,
  },
  {
    keywords: ['food', 'organic', 'fruit', 'vegetable', 'peel', 'coffee', 'eggshell', 'garden', 'leaf', 'grass'],
    wasteType: 'Orgánico',
    containerColor: 'brown',
    containerLabel: 'Contenedor Marrón',
    containerIcon: '🟤',
    points: 5,
  },
  {
    keywords: ['battery', 'electronic', 'phone', 'computer', 'cable', 'bulb', 'medicine', 'chemical', 'paint', 'oil'],
    wasteType: 'Residuo Especial',
    containerColor: 'orange',
    containerLabel: 'Contenedor Naranja',
    containerIcon: '🟠',
    points: 20,
  },
];

const DEFAULT_RESULT = {
  wasteType: 'Residuo General',
  containerColor: 'black',
  containerLabel: 'Contenedor Negro',
  containerIcon: '⬛',
  points: 2,
  confidence: 0.5,
};

/**
 * Simulates image analysis by using image filename/mimetype hints.
 * Returns classification result.
 * @param {string} imageFilename - original filename of uploaded image
 * @param {Buffer|null} _imageBuffer - image buffer (unused in simulation)
 * @returns {object} classification result
 */
function analyze(imageFilename, _imageBuffer) {
  const name = (imageFilename || '').toLowerCase();

  for (const entry of WASTE_CATALOG) {
    for (const keyword of entry.keywords) {
      if (name.includes(keyword)) {
        return {
          wasteType: entry.wasteType,
          containerColor: entry.containerColor,
          containerLabel: entry.containerLabel,
          containerIcon: entry.containerIcon,
          points: entry.points,
          confidence: 0.85 + Math.random() * 0.1,
          provider: 'simulated',
        };
      }
    }
  }

  // Random classification when no keyword matches (realistic simulation)
  const random = WASTE_CATALOG[Math.floor(Math.random() * WASTE_CATALOG.length)];
  return {
    wasteType: random.wasteType,
    containerColor: random.containerColor,
    containerLabel: random.containerLabel,
    containerIcon: random.containerIcon,
    points: random.points,
    confidence: 0.6 + Math.random() * 0.15,
    provider: 'simulated',
  };
}

module.exports = { analyze, WASTE_CATALOG, DEFAULT_RESULT };
