const RECYCLING_RULES = {
  plastic: {
    container: 'blue',
    containerName: 'Contenedor Azul',
    label: 'Plástico',
    emoji: '🔵',
    points: 10
  },
  glass: {
    container: 'green',
    containerName: 'Contenedor Verde',
    label: 'Vidrio',
    emoji: '🟢',
    points: 15
  },
  paper: {
    container: 'yellow',
    containerName: 'Contenedor Amarillo',
    label: 'Papel/Cartón',
    emoji: '🟡',
    points: 8
  },
  metal: {
    container: 'gray',
    containerName: 'Contenedor Gris',
    label: 'Metal',
    emoji: '⚫',
    points: 20
  },
  organic: {
    container: 'brown',
    containerName: 'Contenedor Marrón',
    label: 'Orgánico',
    emoji: '🟤',
    points: 5
  }
};

function getRuleForWasteType(wasteType) {
  return RECYCLING_RULES[wasteType] || null;
}

function getAllRules() {
  return RECYCLING_RULES;
}

function getSupportedWasteTypes() {
  return Object.keys(RECYCLING_RULES);
}

module.exports = { getRuleForWasteType, getAllRules, getSupportedWasteTypes, RECYCLING_RULES };
