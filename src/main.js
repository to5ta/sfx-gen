import './styles.css';
import { PRESETS, cloneSpec, randomSpec } from './presets.js';
import { SAMPLE_RATE, encodeWavPCM16, renderSpec } from './dsp.js';

const DEFAULT_PRESET = 'click';
const WAVE_TYPES = ['sine', 'square', 'saw', 'triangle', 'noise'];
const FILTER_TYPES = ['lowpass', 'highpass'];

const state = {
  spec: cloneSpec(PRESETS[DEFAULT_PRESET]),
  selectedPreset: DEFAULT_PRESET,
  previewMode: 'wave',
  rendered: null,
  audioContext: null,
  sourceNode: null,
  isPlaying: false
};

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <section class="panel panel-sidebar">
      <h1>UX SFX Generator</h1>
      <p class="tagline">Browser additive synth for UI sonification</p>
      <div class="control-group">
        <label for="presetSelect">Preset</label>
        <select id="presetSelect"></select>
      </div>
      <div class="row-buttons">
        <button id="loadPresetBtn" type="button">Load</button>
        <button id="randomizeBtn" type="button">Randomize</button>
      </div>
      <div class="control-group">
        <label for="nameInput">Name</label>
        <input id="nameInput" type="text" />
      </div>
      <div class="control-group">
        <label for="durationInput">Duration (s)</label>
        <div class="dual-input">
          <input id="durationSlider" type="range" min="0.03" max="2.5" step="0.001" />
          <input id="durationInput" type="number" min="0.03" max="2.5" step="0.01" />
        </div>
      </div>
      <button id="addLayerBtn" type="button">Add Layer</button>
      <p class="hint">Single source of truth: one controlled <code>spec</code> object drives all widgets.</p>
    </section>

    <section class="panel panel-layers">
      <div class="section-head">
        <h2>Layers</h2>
        <span id="layerCount"></span>
      </div>
      <div id="layersContainer"></div>
    </section>

    <section class="panel panel-preview">
      <div class="section-head">
        <h2>Preview</h2>
      </div>
      <div class="row-buttons">
        <button id="playBtn" type="button">Play</button>
        <button id="stopBtn" type="button">Stop</button>
        <button id="downloadBtn" type="button">WAV Download</button>
      </div>
      <div class="preview-stack">
        <canvas id="waveCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
        <canvas id="specCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
        <button id="canvasToggleHint" class="inline-hint" type="button">toggle view</button>
      </div>
      <div class="row-buttons json-actions">
        <button id="applyJsonBtn" type="button">Apply JSON</button>
        <button id="copyJsonBtn" type="button">Copy JSON</button>
      </div>
      <textarea id="jsonEditor" spellcheck="false"></textarea>
      <p id="jsonStatus" class="hint"></p>
    </section>
  </main>
`;

const ui = {
  presetSelect: document.getElementById('presetSelect'),
  loadPresetBtn: document.getElementById('loadPresetBtn'),
  randomizeBtn: document.getElementById('randomizeBtn'),
  nameInput: document.getElementById('nameInput'),
  durationInput: document.getElementById('durationInput'),
  durationSlider: document.getElementById('durationSlider'),
  addLayerBtn: document.getElementById('addLayerBtn'),
  layersContainer: document.getElementById('layersContainer'),
  layerCount: document.getElementById('layerCount'),
  playBtn: document.getElementById('playBtn'),
  stopBtn: document.getElementById('stopBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  canvasToggleHint: document.getElementById('canvasToggleHint'),
  waveCanvas: document.getElementById('waveCanvas'),
  specCanvas: document.getElementById('specCanvas'),
  applyJsonBtn: document.getElementById('applyJsonBtn'),
  copyJsonBtn: document.getElementById('copyJsonBtn'),
  jsonEditor: document.getElementById('jsonEditor'),
  jsonStatus: document.getElementById('jsonStatus')
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const defaultLayer = () => ({
  type: 'sine',
  freq: 880,
  attack: 0.004,
  decay: 0.12,
  gain: 0.5,
  offset: 0,
  filter: null
});

const setSpec = (updater) => {
  const next = typeof updater === 'function' ? updater(state.spec) : updater;
  state.spec = deepClone(next);
  render();
};

const ensureRendered = () => {
  state.rendered = renderSpec(state.spec, SAMPLE_RATE);
  return state.rendered;
};

const formatNum = (value, digits = 3) => Number(value).toFixed(digits);

const freqLabel = (freq) => {
  if (typeof freq === 'number') return `${Math.round(freq)} Hz`;
  return `${Math.round(freq.start)} -> ${Math.round(freq.end)} (${freq.curve})`;
};

const updateLayerField = (index, key, value) => {
  setSpec((spec) => {
    const next = deepClone(spec);
    next.layers[index][key] = value;
    return next;
  });
};

const populatePresetSelect = () => {
  ui.presetSelect.innerHTML = Object.keys(PRESETS)
    .map((name) => `<option value="${name}">${name}</option>`)
    .join('');
  ui.presetSelect.value = state.selectedPreset;
};

const createLayerCard = (layer, idx) => {
  const card = document.createElement('article');
  card.className = 'layer-card';

  const freqIsSweep = typeof layer.freq === 'object';
  const filterEnabled = layer.filter !== null;

  card.innerHTML = `
    <div class="layer-head">
      <strong>Layer ${idx + 1}</strong>
      <div class="row-buttons">
        <button type="button" data-action="duplicate" data-layer="${idx}">Duplicate</button>
        <button type="button" data-action="remove" data-layer="${idx}">Remove</button>
      </div>
    </div>

    <div class="grid-two">
      <label>Wave
        <select data-key="type" data-layer="${idx}">
          ${WAVE_TYPES.map((t) => `<option value="${t}" ${t === layer.type ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </label>

      <label>Gain
        <div class="dual-input">
          <input data-key="gain" data-layer="${idx}" type="range" step="0.01" min="0" max="2" value="${formatNum(layer.gain, 2)}" />
          <input data-key="gain" data-layer="${idx}" type="number" step="0.01" min="0" max="2" value="${formatNum(layer.gain, 2)}" />
        </div>
      </label>

      <label>Attack (s)
        <div class="dual-input">
          <input data-key="attack" data-layer="${idx}" type="range" step="0.001" min="0.002" max="1" value="${formatNum(layer.attack)}" />
          <input data-key="attack" data-layer="${idx}" type="number" step="0.001" min="0.002" max="1" value="${formatNum(layer.attack)}" />
        </div>
      </label>

      <label>Decay (s)
        <div class="dual-input">
          <input data-key="decay" data-layer="${idx}" type="range" step="0.001" min="0.002" max="2" value="${formatNum(layer.decay)}" />
          <input data-key="decay" data-layer="${idx}" type="number" step="0.001" min="0.002" max="2" value="${formatNum(layer.decay)}" />
        </div>
      </label>

      <label>Offset (s)
        <div class="dual-input">
          <input data-key="offset" data-layer="${idx}" type="range" step="0.001" min="0" max="2" value="${formatNum(layer.offset)}" />
          <input data-key="offset" data-layer="${idx}" type="number" step="0.001" min="0" max="2" value="${formatNum(layer.offset)}" />
        </div>
      </label>

      <label>Freq mode
        <select data-key="freqMode" data-layer="${idx}">
          <option value="fixed" ${freqIsSweep ? '' : 'selected'}>fixed</option>
          <option value="sweep" ${freqIsSweep ? 'selected' : ''}>sweep</option>
        </select>
      </label>

      ${
        freqIsSweep
          ? `
      <label>Start (Hz)
        <input data-key="freqStart" data-layer="${idx}" type="number" step="1" min="20" max="20000" value="${formatNum(layer.freq.start, 0)}" />
      </label>
      <label>End (Hz)
        <input data-key="freqEnd" data-layer="${idx}" type="number" step="1" min="20" max="20000" value="${formatNum(layer.freq.end, 0)}" />
      </label>
      <label>Sweep curve
        <select data-key="freqCurve" data-layer="${idx}">
          <option value="linear" ${layer.freq.curve === 'linear' ? 'selected' : ''}>linear</option>
          <option value="exp" ${layer.freq.curve === 'exp' ? 'selected' : ''}>exp</option>
        </select>
      </label>
      `
          : `
      <label>Freq (Hz)
        <input data-key="freq" data-layer="${idx}" type="number" step="1" min="20" max="20000" value="${formatNum(layer.freq, 0)}" />
      </label>
      <label class="meta-pill">${freqLabel(layer.freq)}</label>
      `
      }

      <label>Filter
        <select data-key="filterEnabled" data-layer="${idx}">
          <option value="off" ${filterEnabled ? '' : 'selected'}>off</option>
          <option value="on" ${filterEnabled ? 'selected' : ''}>on</option>
        </select>
      </label>

      ${
        filterEnabled
          ? `
      <label>Filter type
        <select data-key="filterType" data-layer="${idx}">
          ${FILTER_TYPES.map((t) => `<option value="${t}" ${layer.filter.type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </label>
      <label>Cutoff (Hz)
        <input data-key="filterCutoff" data-layer="${idx}" type="number" min="20" max="20000" step="1" value="${formatNum(layer.filter.cutoff, 0)}" />
      </label>
      `
          : ''
      }
    </div>
  `;

  return card;
};

const renderWaveform = (data) => {
  const ctx = ui.waveCanvas.getContext('2d');
  const w = ui.waveCanvas.width;
  const h = ui.waveCanvas.height;

  ctx.fillStyle = '#11131b';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#2f354a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 1) {
    const idx = Math.floor((x / (w - 1)) * (data.length - 1));
    const y = h * 0.5 - data[idx] * (h * 0.44);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
};

const hann = (n, size) => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (size - 1));

const fftRadix2 = (real, imag) => {
  const n = real.length;
  const levels = Math.log2(n);
  if (Math.floor(levels) !== levels) throw new Error('FFT size must be power of 2');

  for (let i = 0; i < n; i += 1) {
    let j = 0;
    for (let bit = 0; bit < levels; bit += 1) {
      j = (j << 1) | ((i >>> bit) & 1);
    }
    if (j > i) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }

  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const step = (2 * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let j = i; j < i + half; j += 1) {
        const k = j - i;
        const angle = -k * step;
        const wr = Math.cos(angle);
        const wi = Math.sin(angle);

        const tr = wr * real[j + half] - wi * imag[j + half];
        const ti = wr * imag[j + half] + wi * real[j + half];

        real[j + half] = real[j] - tr;
        imag[j + half] = imag[j] - ti;
        real[j] += tr;
        imag[j] += ti;
      }
    }
  }
};

const magmaColor = (t) => {
  const stops = [
    [0, 0, 4],
    [27, 18, 84],
    [80, 18, 123],
    [129, 37, 129],
    [181, 54, 122],
    [229, 80, 100],
    [251, 135, 97],
    [254, 194, 135],
    [252, 253, 191]
  ];

  const p = clamp(t, 0, 1) * (stops.length - 1);
  const i = Math.floor(p);
  const f = p - i;
  const c0 = stops[i];
  const c1 = stops[Math.min(stops.length - 1, i + 1)];

  return [
    Math.round(c0[0] + (c1[0] - c0[0]) * f),
    Math.round(c0[1] + (c1[1] - c0[1]) * f),
    Math.round(c0[2] + (c1[2] - c0[2]) * f)
  ];
};

const renderSpectrogram = (data) => {
  const canvas = ui.specCanvas;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = '#0f0f13';
  ctx.fillRect(0, 0, w, h);

  const fftSize = 1024;
  const hop = 256;
  const bins = fftSize / 2;
  const frames = Math.max(1, Math.floor((data.length - fftSize) / hop) + 1);
  const image = ctx.createImageData(w, h);

  const mags = [];
  let maxDb = -120;

  for (let frame = 0; frame < frames; frame += 1) {
    const offset = frame * hop;
    const real = new Float32Array(fftSize);
    const imag = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i += 1) {
      real[i] = (data[offset + i] || 0) * hann(i, fftSize);
    }
    fftRadix2(real, imag);

    const col = new Float32Array(bins);
    for (let b = 0; b < bins; b += 1) {
      const mag = Math.sqrt(real[b] ** 2 + imag[b] ** 2);
      const db = 20 * Math.log10(mag + 1e-9);
      col[b] = db;
      if (db > maxDb) maxDb = db;
    }
    mags.push(col);
  }

  for (let x = 0; x < w; x += 1) {
    const frameIdx = Math.min(frames - 1, Math.floor((x / (w - 1)) * (frames - 1)));
    const col = mags[frameIdx];
    for (let y = 0; y < h; y += 1) {
      const bin = Math.floor(((h - 1 - y) / (h - 1)) * (bins - 1));
      const db = col?.[bin] ?? -120;
      const norm = clamp((db - (maxDb - 80)) / 80, 0, 1);
      const [r, g, b] = magmaColor(norm);
      const idx = (y * w + x) * 4;
      image.data[idx] = r;
      image.data[idx + 1] = g;
      image.data[idx + 2] = b;
      image.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
};

const stopPlayback = () => {
  if (state.sourceNode) {
    state.sourceNode.stop();
    state.sourceNode.disconnect();
    state.sourceNode = null;
  }
  state.isPlaying = false;
};

const play = async () => {
  const data = ensureRendered();
  if (!state.audioContext) state.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });

  if (state.audioContext.state === 'suspended') {
    await state.audioContext.resume();
  }

  stopPlayback();

  const buffer = state.audioContext.createBuffer(1, data.length, SAMPLE_RATE);
  buffer.copyToChannel(data, 0, 0);

  const source = state.audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(state.audioContext.destination);
  source.onended = () => {
    if (state.sourceNode === source) {
      state.sourceNode = null;
      state.isPlaying = false;
    }
  };
  source.start();

  state.sourceNode = source;
  state.isPlaying = true;
};

const downloadWav = () => {
  const data = ensureRendered();
  const blob = encodeWavPCM16(data, SAMPLE_RATE);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.spec.name || 'sfx'}.wav`;
  a.click();
  URL.revokeObjectURL(url);
};

const renderLayerList = () => {
  ui.layersContainer.innerHTML = '';
  state.spec.layers.forEach((layer, idx) => {
    ui.layersContainer.appendChild(createLayerCard(layer, idx));
  });
};

const setPreviewMode = (mode) => {
  state.previewMode = mode;
  const showingWave = mode === 'wave';
  ui.waveCanvas.style.display = showingWave ? 'block' : 'none';
  ui.specCanvas.style.display = showingWave ? 'none' : 'block';
};

const togglePreviewMode = () => {
  setPreviewMode(state.previewMode === 'wave' ? 'spec' : 'wave');
};

const render = () => {
  ui.nameInput.value = state.spec.name;
  ui.durationInput.value = formatNum(state.spec.duration, 3);
  ui.durationSlider.value = formatNum(state.spec.duration, 3);
  ui.layerCount.textContent = `${state.spec.layers.length} layer${state.spec.layers.length === 1 ? '' : 's'}`;
  renderLayerList();

  const rendered = ensureRendered();
  renderWaveform(rendered);
  renderSpectrogram(rendered);
  setPreviewMode(state.previewMode);
  ui.jsonEditor.value = JSON.stringify(state.spec, null, 2);
  ui.jsonStatus.textContent = '';
};

ui.loadPresetBtn.addEventListener('click', () => {
  const picked = ui.presetSelect.value;
  state.selectedPreset = picked;
  setSpec(cloneSpec(PRESETS[picked]));
});

ui.randomizeBtn.addEventListener('click', () => {
  setSpec(randomSpec());
});

ui.nameInput.addEventListener('input', (event) => {
  setSpec((spec) => ({ ...spec, name: event.target.value }));
});

ui.durationInput.addEventListener('input', (event) => {
  const value = clamp(Number(event.target.value) || 0.1, 0.03, 2.5);
  setSpec((spec) => ({ ...spec, duration: Number(value.toFixed(3)) }));
});

ui.durationSlider.addEventListener('input', (event) => {
  const value = clamp(Number(event.target.value) || 0.1, 0.03, 2.5);
  setSpec((spec) => ({ ...spec, duration: Number(value.toFixed(3)) }));
});

ui.addLayerBtn.addEventListener('click', () => {
  setSpec((spec) => ({ ...spec, layers: [...spec.layers, defaultLayer()] }));
});

ui.layersContainer.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const layer = Number(target.dataset.layer);
  if (!Number.isInteger(layer)) return;

  if (target.dataset.action === 'remove') {
    setSpec((spec) => {
      if (spec.layers.length === 1) return spec;
      const next = deepClone(spec);
      next.layers.splice(layer, 1);
      return next;
    });
  }

  if (target.dataset.action === 'duplicate') {
    setSpec((spec) => {
      const next = deepClone(spec);
      next.layers.splice(layer + 1, 0, deepClone(next.layers[layer]));
      return next;
    });
  }
});

ui.layersContainer.addEventListener('input', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

  const layerIdx = Number(target.dataset.layer);
  const key = target.dataset.key;
  if (!Number.isInteger(layerIdx) || !key) return;

  if (key === 'type') {
    updateLayerField(layerIdx, 'type', target.value);
    return;
  }

  if (key === 'gain' || key === 'attack' || key === 'decay' || key === 'offset') {
    updateLayerField(layerIdx, key, Number(target.value));
    return;
  }

  if (key === 'freq') {
    updateLayerField(layerIdx, 'freq', Number(target.value));
    return;
  }

  if (key === 'freqMode') {
    setSpec((spec) => {
      const next = deepClone(spec);
      next.layers[layerIdx].freq =
        target.value === 'sweep'
          ? { start: 440, end: 880, curve: 'exp' }
          : Number(typeof next.layers[layerIdx].freq === 'number' ? next.layers[layerIdx].freq : next.layers[layerIdx].freq.start);
      return next;
    });
    return;
  }

  if (key === 'freqStart' || key === 'freqEnd' || key === 'freqCurve') {
    setSpec((spec) => {
      const next = deepClone(spec);
      const freq = typeof next.layers[layerIdx].freq === 'object' ? next.layers[layerIdx].freq : { start: 440, end: 880, curve: 'exp' };
      if (key === 'freqStart') freq.start = Number(target.value);
      if (key === 'freqEnd') freq.end = Number(target.value);
      if (key === 'freqCurve') freq.curve = target.value;
      next.layers[layerIdx].freq = freq;
      return next;
    });
    return;
  }

  if (key === 'filterEnabled') {
    setSpec((spec) => {
      const next = deepClone(spec);
      next.layers[layerIdx].filter = target.value === 'on' ? { type: 'lowpass', cutoff: 2600 } : null;
      return next;
    });
    return;
  }

  if (key === 'filterType' || key === 'filterCutoff') {
    setSpec((spec) => {
      const next = deepClone(spec);
      if (!next.layers[layerIdx].filter) {
        next.layers[layerIdx].filter = { type: 'lowpass', cutoff: 2600 };
      }
      if (key === 'filterType') next.layers[layerIdx].filter.type = target.value;
      if (key === 'filterCutoff') next.layers[layerIdx].filter.cutoff = Number(target.value);
      return next;
    });
  }
});

ui.playBtn.addEventListener('click', () => {
  play();
});

ui.stopBtn.addEventListener('click', () => {
  stopPlayback();
});

ui.downloadBtn.addEventListener('click', () => {
  downloadWav();
});

ui.canvasToggleHint.addEventListener('click', () => {
  togglePreviewMode();
});

ui.waveCanvas.addEventListener('click', () => {
  togglePreviewMode();
});

ui.specCanvas.addEventListener('click', () => {
  togglePreviewMode();
});

ui.copyJsonBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(ui.jsonEditor.value);
    ui.jsonStatus.textContent = 'JSON copied to clipboard.';
  } catch {
    ui.jsonStatus.textContent = 'Clipboard copy failed.';
  }
});

ui.applyJsonBtn.addEventListener('click', () => {
  try {
    const parsed = JSON.parse(ui.jsonEditor.value);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.layers)) {
      throw new Error('Invalid spec shape');
    }
    setSpec(parsed);
    ui.jsonStatus.textContent = 'Spec applied.';
  } catch {
    ui.jsonStatus.textContent = 'Invalid JSON. Expected a Spec object.';
  }
});

populatePresetSelect();
render();
