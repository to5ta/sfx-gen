export const SAMPLE_RATE = 44100;
const MIN_RAMP = 0.002;
const TARGET_RMS = 10 ** (-20 / 20);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const oscSample = (type, phase) => {
  if (type === 'sine') return Math.sin(phase);
  if (type === 'square') return Math.sin(phase) >= 0 ? 1 : -1;
  if (type === 'saw') {
    const x = phase / (Math.PI * 2);
    return 2 * (x - Math.floor(x + 0.5));
  }
  if (type === 'triangle') {
    const x = phase / (Math.PI * 2);
    return 2 * Math.abs(2 * (x - Math.floor(x + 0.5))) - 1;
  }
  return Math.random() * 2 - 1;
};

const raisedCosRise = (p) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(p, 0, 1));
const raisedCosFall = (p) => 0.5 + 0.5 * Math.cos(Math.PI * clamp(p, 0, 1));

const envelope = (localTime, attack, decay) => {
  if (localTime < 0) return 0;
  const a = Math.max(MIN_RAMP, attack);
  const d = Math.max(MIN_RAMP, decay);
  if (localTime <= a) return raisedCosRise(localTime / a);
  if (localTime <= a + d) return raisedCosFall((localTime - a) / d);
  return 0;
};

const freqAt = (freq, localTime, eventDuration) => {
  if (typeof freq === 'number') return Math.max(1, freq);
  const curve = freq.curve === 'exp' ? 'exp' : 'linear';
  const u = clamp(localTime / Math.max(eventDuration, 1e-6), 0, 1);
  if (curve === 'linear' || freq.start <= 0 || freq.end <= 0) {
    return Math.max(1, freq.start + (freq.end - freq.start) * u);
  }
  return Math.max(1, freq.start * (freq.end / freq.start) ** u);
};

const applyOnePole = (buffer, filter, sampleRate) => {
  if (!filter) return buffer;
  const out = new Float32Array(buffer.length);
  const cutoff = clamp(filter.cutoff || 1000, 20, sampleRate * 0.45);
  const dt = 1 / sampleRate;
  const rc = 1 / (2 * Math.PI * cutoff);

  if (filter.type === 'lowpass') {
    const alpha = dt / (rc + dt);
    let y = 0;
    for (let i = 0; i < buffer.length; i += 1) {
      y = y + alpha * (buffer[i] - y);
      out[i] = y;
    }
    return out;
  }

  const alpha = rc / (rc + dt);
  let y = 0;
  let prevX = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    const x = buffer[i];
    y = alpha * (y + x - prevX);
    prevX = x;
    out[i] = y;
  }
  return out;
};

const renderLayer = (layer, totalSamples, sampleRate) => {
  const out = new Float32Array(totalSamples);
  const eventDuration = Math.max(MIN_RAMP * 2, layer.attack + layer.decay);
  const offsetSamples = Math.max(0, Math.floor(layer.offset * sampleRate));

  let phase = 0;
  for (let i = offsetSamples; i < totalSamples; i += 1) {
    const localTime = (i - offsetSamples) / sampleRate;
    const env = envelope(localTime, layer.attack, layer.decay);
    if (env <= 1e-8) continue;

    const hz = freqAt(layer.freq, localTime, eventDuration);
    phase += (2 * Math.PI * hz) / sampleRate;
    const osc = oscSample(layer.type, phase);
    out[i] = osc * env;
  }

  const filtered = applyOnePole(out, layer.filter, sampleRate);
  const gain = Number.isFinite(layer.gain) ? layer.gain : 0.5;
  for (let i = 0; i < filtered.length; i += 1) {
    filtered[i] *= gain;
  }
  return filtered;
};

const postProcess = (buffer, sampleRate) => {
  let out = applyOnePole(buffer, { type: 'highpass', cutoff: 20 }, sampleRate);
  out = applyOnePole(out, { type: 'lowpass', cutoff: 10000 }, sampleRate);

  let sumSq = 0;
  for (let i = 0; i < out.length; i += 1) {
    sumSq += out[i] * out[i];
  }
  const rms = Math.sqrt(sumSq / Math.max(1, out.length));
  if (rms > 1e-9) {
    const scale = TARGET_RMS / rms;
    for (let i = 0; i < out.length; i += 1) out[i] *= scale;
  }

  for (let i = 0; i < out.length; i += 1) {
    out[i] = 0.95 * Math.tanh(out[i] / 0.95);
  }

  const fadeSamples = Math.max(1, Math.floor(MIN_RAMP * sampleRate));
  for (let i = 0; i < fadeSamples && i < out.length; i += 1) {
    const p = i / fadeSamples;
    out[i] *= raisedCosRise(p);
    out[out.length - 1 - i] *= raisedCosRise(p);
  }

  return out;
};

export const renderSpec = (spec, sampleRate = SAMPLE_RATE) => {
  const totalSamples = Math.max(1, Math.floor(spec.duration * sampleRate));
  const mix = new Float32Array(totalSamples);

  for (const layer of spec.layers) {
    const rendered = renderLayer(layer, totalSamples, sampleRate);
    for (let i = 0; i < totalSamples; i += 1) {
      mix[i] += rendered[i];
    }
  }

  return postProcess(mix, sampleRate);
};

export const encodeWavPCM16 = (floatData, sampleRate = SAMPLE_RATE) => {
  const byteRate = sampleRate * 2;
  const dataSize = floatData.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < floatData.length; i += 1) {
    const s = clamp(floatData[i], -1, 1);
    const int = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, int, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
};
