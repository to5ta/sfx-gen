const mkSweep = (start, end, curve = 'exp') => ({ start, end, curve });

export const PRESETS = {
  click: {
    name: 'click',
    duration: 0.12,
    layers: [
      {
        type: 'triangle',
        freq: 1800,
        attack: 0.003,
        decay: 0.06,
        gain: 0.65,
        offset: 0,
        filter: { type: 'highpass', cutoff: 900 }
      },
      {
        type: 'noise',
        freq: 1200,
        attack: 0.002,
        decay: 0.03,
        gain: 0.2,
        offset: 0,
        filter: { type: 'highpass', cutoff: 1500 }
      }
    ]
  },
  confirm: {
    name: 'confirm',
    duration: 0.24,
    layers: [
      {
        type: 'sine',
        freq: mkSweep(640, 960, 'exp'),
        attack: 0.005,
        decay: 0.14,
        gain: 0.52,
        offset: 0,
        filter: null
      },
      {
        type: 'triangle',
        freq: 1280,
        attack: 0.004,
        decay: 0.11,
        gain: 0.22,
        offset: 0.02,
        filter: { type: 'lowpass', cutoff: 5200 }
      }
    ]
  },
  error: {
    name: 'error',
    duration: 0.36,
    layers: [
      {
        type: 'saw',
        freq: mkSweep(520, 180, 'linear'),
        attack: 0.004,
        decay: 0.2,
        gain: 0.62,
        offset: 0,
        filter: { type: 'lowpass', cutoff: 2900 }
      },
      {
        type: 'square',
        freq: 160,
        attack: 0.006,
        decay: 0.24,
        gain: 0.35,
        offset: 0.04,
        filter: { type: 'highpass', cutoff: 80 }
      }
    ]
  },
  notify: {
    name: 'notify',
    duration: 0.42,
    layers: [
      {
        type: 'sine',
        freq: mkSweep(480, 740, 'exp'),
        attack: 0.007,
        decay: 0.18,
        gain: 0.46,
        offset: 0,
        filter: null
      },
      {
        type: 'triangle',
        freq: mkSweep(740, 990, 'linear'),
        attack: 0.004,
        decay: 0.16,
        gain: 0.31,
        offset: 0.1,
        filter: { type: 'lowpass', cutoff: 6000 }
      }
    ]
  }
};

const WAVES = ['sine', 'square', 'saw', 'triangle', 'noise'];
const CURVES = ['linear', 'exp'];
const FILTER_TYPES = ['lowpass', 'highpass'];

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomFreq = () => {
  if (Math.random() < 0.45) {
    const base = rand(120, 2200);
    return Math.round(base);
  }
  const start = rand(100, 1800);
  const ratio = rand(0.4, 2.5);
  const end = Math.max(40, start * ratio);
  return {
    start: Math.round(start),
    end: Math.round(end),
    curve: pick(CURVES)
  };
};

const randomFilter = () => {
  if (Math.random() < 0.45) {
    return null;
  }
  return {
    type: pick(FILTER_TYPES),
    cutoff: Math.round(rand(120, 9000))
  };
};

const randomLayer = () => ({
  type: pick(WAVES),
  freq: randomFreq(),
  attack: Number(rand(0.002, 0.04).toFixed(3)),
  decay: Number(rand(0.04, 0.35).toFixed(3)),
  gain: Number(rand(0.15, 0.9).toFixed(2)),
  offset: Number(rand(0, 0.14).toFixed(3)),
  filter: randomFilter()
});

export const randomSpec = () => {
  const layerCount = 1 + Math.floor(Math.random() * 3);
  const layers = Array.from({ length: layerCount }, randomLayer);
  const maxEnd = Math.max(...layers.map((layer) => layer.offset + layer.attack + layer.decay), 0.18);

  return {
    name: `rand-${Date.now().toString().slice(-4)}`,
    duration: Number(Math.max(0.1, Math.min(1.2, maxEnd + rand(0.02, 0.18))).toFixed(3)),
    layers
  };
};

export const cloneSpec = (spec) => JSON.parse(JSON.stringify(spec));
