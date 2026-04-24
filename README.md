# UX SFX Generator

Browser-based additive synth for generating polished UI sound effects.

## Features

- Single-source data model: `Spec = { name, duration, layers[] }`
- Layer synthesis: oscillator (including sweeps) -> raised-cosine AD envelope -> optional 1-pole filter -> gain
- Post chain: DC-block HP (20 Hz) -> de-harsh LP (10 kHz) -> RMS normalize to -20 dBFS -> soft-clip -> edge fade
- Live preview with waveform and spectrogram (radix-2 FFT, Hann window, magma colormap)
- Presets: `click`, `confirm`, `error`, `notify`
- Randomize mode (1-3 layers)
- In-browser PCM16 mono WAV export

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output is generated in `dist/`.

## GitHub Pages (Branch Root Strategy)

This repository is configured for static deployment. To prepare `gh-pages` with built files at branch root:

```bash
npm run build
git worktree add ../sfx-gen-gh-pages gh-pages
rm -rf ../sfx-gen-gh-pages/*
cp -r dist/. ../sfx-gen-gh-pages/
touch ../sfx-gen-gh-pages/.nojekyll
cd ../sfx-gen-gh-pages
git add .
git commit -m "Deploy site"
git push origin gh-pages
```

Then set GitHub Pages source to `gh-pages` branch root in repository settings.