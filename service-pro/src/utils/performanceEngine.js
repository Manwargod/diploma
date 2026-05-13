const cpuScores = {
  'Intel Core i5-13400': 110,
  'AMD Ryzen 5 5500': 95,
  'Intel Core i7-13700K': 170,
  'AMD Ryzen 7 5800X': 155,
  'Intel Core i9-14900K': 220,
  'AMD Ryzen 9 7950X': 230,
  'Intel Core i7-14700K': 190,
  'AMD Ryzen 7 7700X': 175
};

const gpuScores = {
  'RTX 3060': 120,
  'RTX 4060': 135,
  'RTX 4070': 180,
  'RTX 4070 Ti': 205,
  'RTX 4090': 280,
  'RTX 6000 ADA': 300,
  'RTX 4080 Super': 240,
  'RTX 4070 Super': 195
};

const ramScores = {
  'DDR4 16GB': 40,
  'DDR4 32GB': 60,
  'DDR5 32GB': 75,
  'DDR5 64GB': 100,
  'DDR5 128GB': 130
};

const games = [
  { id: 'cyberpunk', name: 'Cyberpunk 2077' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'cs2', name: 'CS2' },
  { id: 'gta', name: 'GTA V' },
  { id: 'fortnite', name: 'Fortnite' }
];

const creative = [
  { id: 'blender', name: 'Blender Render (min)' },
  { id: 'premiere', name: 'Premiere Pro Export (min)' },
  { id: 'resolve', name: 'DaVinci Resolve Render (min)' }
];

const getScore = (map, key, fallback) => map[key] || fallback;

export const estimatePerformance = ({ cpu, gpu, ram }) => {
  const cpuScore = getScore(cpuScores, cpu, 120);
  const gpuScore = getScore(gpuScores, gpu, 140);
  const ramScore = getScore(ramScores, ram, 50);

  const baseScore = Math.round(cpuScore * 0.4 + gpuScore * 0.45 + ramScore * 0.15);

  const fps1080 = (mult) => Math.round(baseScore * mult);
  const fps1440 = (mult) => Math.round(baseScore * mult * 0.72);

  const fps = games.map((game, index) => {
    const multiplier = 0.9 + index * 0.08;
    return {
      ...game,
      fps1080: fps1080(multiplier),
      fps1440: fps1440(multiplier)
    };
  });

  const benchmarks = creative.map((task, index) => {
    const time = Math.max(3, Math.round(60 - baseScore * (0.15 + index * 0.03)));
    return {
      ...task,
      time
    };
  });

  return { fps, benchmarks, baseScore };
};

const performanceEngine = { estimatePerformance };

export default performanceEngine;
