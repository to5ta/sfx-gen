(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();const B=(e,t,n="exp")=>({start:e,end:t,curve:n}),T={click:{name:"click",duration:.12,layers:[{type:"triangle",freq:1800,attack:.003,decay:.06,gain:.65,offset:0,filter:{type:"highpass",cutoff:900}},{type:"noise",freq:1200,attack:.002,decay:.03,gain:.2,offset:0,filter:{type:"highpass",cutoff:1500}}]},confirm:{name:"confirm",duration:.24,layers:[{type:"sine",freq:B(640,960,"exp"),attack:.005,decay:.14,gain:.52,offset:0,filter:null},{type:"triangle",freq:1280,attack:.004,decay:.11,gain:.22,offset:.02,filter:{type:"lowpass",cutoff:5200}}]},error:{name:"error",duration:.36,layers:[{type:"saw",freq:B(520,180,"linear"),attack:.004,decay:.2,gain:.62,offset:0,filter:{type:"lowpass",cutoff:2900}},{type:"square",freq:160,attack:.006,decay:.24,gain:.35,offset:.04,filter:{type:"highpass",cutoff:80}}]},notify:{name:"notify",duration:.42,layers:[{type:"sine",freq:B(480,740,"exp"),attack:.007,decay:.18,gain:.46,offset:0,filter:null},{type:"triangle",freq:B(740,990,"linear"),attack:.004,decay:.16,gain:.31,offset:.1,filter:{type:"lowpass",cutoff:6e3}}]}},_=["sine","square","saw","triangle","noise"],J=["linear","exp"],G=["lowpass","highpass"],b=(e,t)=>e+Math.random()*(t-e),A=e=>e[Math.floor(Math.random()*e.length)],X=()=>{if(Math.random()<.45){const o=b(120,2200);return Math.round(o)}const e=b(100,1800),t=b(.4,2.5),n=Math.max(40,e*t);return{start:Math.round(e),end:Math.round(n),curve:A(J)}},Y=()=>Math.random()<.45?null:{type:A(G),cutoff:Math.round(b(120,9e3))},K=()=>({type:A(_),freq:X(),attack:Number(b(.002,.04).toFixed(3)),decay:Number(b(.04,.35).toFixed(3)),gain:Number(b(.15,.9).toFixed(2)),offset:Number(b(0,.14).toFixed(3)),filter:Y()}),Q=()=>{const e=1+Math.floor(Math.random()*3),t=Array.from({length:e},K),n=Math.max(...t.map(o=>o.offset+o.attack+o.decay),.18);return{name:`rand-${Date.now().toString().slice(-4)}`,duration:Number(Math.max(.1,Math.min(1.2,n+b(.02,.18))).toFixed(3)),layers:t}},z=e=>JSON.parse(JSON.stringify(e)),S=44100,I=.002,Z=10**(-20/20),E=(e,t,n)=>Math.min(n,Math.max(t,e)),ee=(e,t)=>{if(e==="sine")return Math.sin(t);if(e==="square")return Math.sin(t)>=0?1:-1;if(e==="saw"){const n=t/(Math.PI*2);return 2*(n-Math.floor(n+.5))}if(e==="triangle"){const n=t/(Math.PI*2);return 2*Math.abs(2*(n-Math.floor(n+.5)))-1}return Math.random()*2-1},N=e=>.5-.5*Math.cos(Math.PI*E(e,0,1)),te=e=>.5+.5*Math.cos(Math.PI*E(e,0,1)),ne=(e,t,n)=>{if(e<0)return 0;const o=Math.max(I,t),r=Math.max(I,n);return e<=o?N(e/o):e<=o+r?te((e-o)/r):0},ae=(e,t,n)=>{if(typeof e=="number")return Math.max(1,e);const o=e.curve==="exp"?"exp":"linear",r=E(t/Math.max(n,1e-6),0,1);return o==="linear"||e.start<=0||e.end<=0?Math.max(1,e.start+(e.end-e.start)*r):Math.max(1,e.start*(e.end/e.start)**r)},F=(e,t,n)=>{if(!t)return e;const o=new Float32Array(e.length),r=E(t.cutoff||1e3,20,n*.45),a=1/n,s=1/(2*Math.PI*r);if(t.type==="lowpass"){const f=a/(s+a);let y=0;for(let p=0;p<e.length;p+=1)y=y+f*(e[p]-y),o[p]=y;return o}const d=s/(s+a);let c=0,u=0;for(let f=0;f<e.length;f+=1){const y=e[f];c=d*(c+y-u),u=y,o[f]=c}return o},oe=(e,t,n)=>{const o=new Float32Array(t),r=Math.max(I*2,e.attack+e.decay),a=Math.max(0,Math.floor(e.offset*n));let s=0;for(let u=a;u<t;u+=1){const f=(u-a)/n,y=ne(f,e.attack,e.decay);if(y<=1e-8)continue;const p=ae(e.freq,f,r);s+=2*Math.PI*p/n;const M=ee(e.type,s);o[u]=M*y}const d=F(o,e.filter,n),c=Number.isFinite(e.gain)?e.gain:.5;for(let u=0;u<d.length;u+=1)d[u]*=c;return d},re=(e,t)=>{let n=F(e,{type:"highpass",cutoff:20},t);n=F(n,{type:"lowpass",cutoff:1e4},t);let o=0;for(let s=0;s<n.length;s+=1)o+=n[s]*n[s];const r=Math.sqrt(o/Math.max(1,n.length));if(r>1e-9){const s=Z/r;for(let d=0;d<n.length;d+=1)n[d]*=s}for(let s=0;s<n.length;s+=1)n[s]=.95*Math.tanh(n[s]/.95);const a=Math.max(1,Math.floor(I*t));for(let s=0;s<a&&s<n.length;s+=1){const d=s/a;n[s]*=N(d),n[n.length-1-s]*=N(d)}return n},se=(e,t=S)=>{const n=Math.max(1,Math.floor(e.duration*t)),o=new Float32Array(n);for(const r of e.layers){const a=oe(r,n,t);for(let s=0;s<n;s+=1)o[s]+=a[s]}return re(o,t)},le=(e,t=S)=>{const n=t*2,o=e.length*2,r=new ArrayBuffer(44+o),a=new DataView(r),s=(c,u)=>{for(let f=0;f<u.length;f+=1)a.setUint8(c+f,u.charCodeAt(f))};s(0,"RIFF"),a.setUint32(4,36+o,!0),s(8,"WAVE"),s(12,"fmt "),a.setUint32(16,16,!0),a.setUint16(20,1,!0),a.setUint16(22,1,!0),a.setUint32(24,t,!0),a.setUint32(28,n,!0),a.setUint16(32,2,!0),a.setUint16(34,16,!0),s(36,"data"),a.setUint32(40,o,!0);let d=44;for(let c=0;c<e.length;c+=1){const u=E(e[c],-1,1),f=u<0?u*32768:u*32767;a.setInt16(d,f,!0),d+=2}return new Blob([r],{type:"audio/wav"})},j="click",ie=["sine","square","saw","triangle","noise"],ce=["lowpass","highpass"],l={spec:z(T[j]),selectedPreset:j,previewMode:"wave",rendered:null,audioContext:null,sourceNode:null,isPlaying:!1},de=document.querySelector("#app");de.innerHTML=`
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
        <button id="toggleViewBtn" type="button">Show Spectrogram</button>
      </div>
      <div class="row-buttons">
        <button id="playBtn" type="button">Play</button>
        <button id="stopBtn" type="button">Stop</button>
        <button id="downloadBtn" type="button">WAV Download</button>
      </div>
      <canvas id="waveCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
      <canvas id="specCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
      <pre id="jsonView"></pre>
    </section>
  </main>
`;const i={presetSelect:document.getElementById("presetSelect"),loadPresetBtn:document.getElementById("loadPresetBtn"),randomizeBtn:document.getElementById("randomizeBtn"),nameInput:document.getElementById("nameInput"),durationInput:document.getElementById("durationInput"),durationSlider:document.getElementById("durationSlider"),addLayerBtn:document.getElementById("addLayerBtn"),layersContainer:document.getElementById("layersContainer"),layerCount:document.getElementById("layerCount"),playBtn:document.getElementById("playBtn"),stopBtn:document.getElementById("stopBtn"),downloadBtn:document.getElementById("downloadBtn"),toggleViewBtn:document.getElementById("toggleViewBtn"),waveCanvas:document.getElementById("waveCanvas"),specCanvas:document.getElementById("specCanvas"),jsonView:document.getElementById("jsonView")},w=e=>JSON.parse(JSON.stringify(e)),L=(e,t,n)=>Math.min(n,Math.max(t,e)),ue=()=>({type:"sine",freq:880,attack:.004,decay:.12,gain:.5,offset:0,filter:null}),h=e=>{const t=typeof e=="function"?e(l.spec):e;l.spec=w(t),H()},U=()=>(l.rendered=se(l.spec,S),l.rendered),m=(e,t=3)=>Number(e).toFixed(t),fe=e=>typeof e=="number"?`${Math.round(e)} Hz`:`${Math.round(e.start)} -> ${Math.round(e.end)} (${e.curve})`,q=(e,t,n)=>{h(o=>{const r=w(o);return r.layers[e][t]=n,r})},pe=()=>{i.presetSelect.innerHTML=Object.keys(T).map(e=>`<option value="${e}">${e}</option>`).join(""),i.presetSelect.value=l.selectedPreset},ye=(e,t)=>{const n=document.createElement("article");n.className="layer-card";const o=typeof e.freq=="object",r=e.filter!==null;return n.innerHTML=`
    <div class="layer-head">
      <strong>Layer ${t+1}</strong>
      <div class="row-buttons">
        <button type="button" data-action="duplicate" data-layer="${t}">Duplicate</button>
        <button type="button" data-action="remove" data-layer="${t}">Remove</button>
      </div>
    </div>

    <div class="grid-two">
      <label>Wave
        <select data-key="type" data-layer="${t}">
          ${ie.map(a=>`<option value="${a}" ${a===e.type?"selected":""}>${a}</option>`).join("")}
        </select>
      </label>

      <label>Gain
        <div class="dual-input">
          <input data-key="gain" data-layer="${t}" type="range" step="0.01" min="0" max="2" value="${m(e.gain,2)}" />
          <input data-key="gain" data-layer="${t}" type="number" step="0.01" min="0" max="2" value="${m(e.gain,2)}" />
        </div>
      </label>

      <label>Attack (s)
        <div class="dual-input">
          <input data-key="attack" data-layer="${t}" type="range" step="0.001" min="0.002" max="1" value="${m(e.attack)}" />
          <input data-key="attack" data-layer="${t}" type="number" step="0.001" min="0.002" max="1" value="${m(e.attack)}" />
        </div>
      </label>

      <label>Decay (s)
        <div class="dual-input">
          <input data-key="decay" data-layer="${t}" type="range" step="0.001" min="0.002" max="2" value="${m(e.decay)}" />
          <input data-key="decay" data-layer="${t}" type="number" step="0.001" min="0.002" max="2" value="${m(e.decay)}" />
        </div>
      </label>

      <label>Offset (s)
        <div class="dual-input">
          <input data-key="offset" data-layer="${t}" type="range" step="0.001" min="0" max="2" value="${m(e.offset)}" />
          <input data-key="offset" data-layer="${t}" type="number" step="0.001" min="0" max="2" value="${m(e.offset)}" />
        </div>
      </label>

      <label>Freq mode
        <select data-key="freqMode" data-layer="${t}">
          <option value="fixed" ${o?"":"selected"}>fixed</option>
          <option value="sweep" ${o?"selected":""}>sweep</option>
        </select>
      </label>

      ${o?`
      <label>Start (Hz)
        <input data-key="freqStart" data-layer="${t}" type="number" step="1" min="20" max="20000" value="${m(e.freq.start,0)}" />
      </label>
      <label>End (Hz)
        <input data-key="freqEnd" data-layer="${t}" type="number" step="1" min="20" max="20000" value="${m(e.freq.end,0)}" />
      </label>
      <label>Sweep curve
        <select data-key="freqCurve" data-layer="${t}">
          <option value="linear" ${e.freq.curve==="linear"?"selected":""}>linear</option>
          <option value="exp" ${e.freq.curve==="exp"?"selected":""}>exp</option>
        </select>
      </label>
      `:`
      <label>Freq (Hz)
        <input data-key="freq" data-layer="${t}" type="number" step="1" min="20" max="20000" value="${m(e.freq,0)}" />
      </label>
      <label class="meta-pill">${fe(e.freq)}</label>
      `}

      <label>Filter
        <select data-key="filterEnabled" data-layer="${t}">
          <option value="off" ${r?"":"selected"}>off</option>
          <option value="on" ${r?"selected":""}>on</option>
        </select>
      </label>

      ${r?`
      <label>Filter type
        <select data-key="filterType" data-layer="${t}">
          ${ce.map(a=>`<option value="${a}" ${e.filter.type===a?"selected":""}>${a}</option>`).join("")}
        </select>
      </label>
      <label>Cutoff (Hz)
        <input data-key="filterCutoff" data-layer="${t}" type="number" min="20" max="20000" step="1" value="${m(e.filter.cutoff,0)}" />
      </label>
      `:""}
    </div>
  `,n},me=e=>{const t=i.waveCanvas.getContext("2d"),n=i.waveCanvas.width,o=i.waveCanvas.height;t.fillStyle="#11131b",t.fillRect(0,0,n,o),t.strokeStyle="#2f354a",t.lineWidth=1,t.beginPath(),t.moveTo(0,o/2),t.lineTo(n,o/2),t.stroke(),t.strokeStyle="#fef08a",t.lineWidth=2,t.beginPath();for(let r=0;r<n;r+=1){const a=Math.floor(r/(n-1)*(e.length-1)),s=o*.5-e[a]*(o*.44);r===0?t.moveTo(r,s):t.lineTo(r,s)}t.stroke()},ve=(e,t)=>.5-.5*Math.cos(2*Math.PI*e/(t-1)),he=(e,t)=>{const n=e.length,o=Math.log2(n);if(Math.floor(o)!==o)throw new Error("FFT size must be power of 2");for(let r=0;r<n;r+=1){let a=0;for(let s=0;s<o;s+=1)a=a<<1|r>>>s&1;a>r&&([e[r],e[a]]=[e[a],e[r]],[t[r],t[a]]=[t[a],t[r]])}for(let r=2;r<=n;r<<=1){const a=r>>1,s=2*Math.PI/r;for(let d=0;d<n;d+=r)for(let c=d;c<d+a;c+=1){const f=-(c-d)*s,y=Math.cos(f),p=Math.sin(f),M=y*e[c+a]-p*t[c+a],g=y*t[c+a]+p*e[c+a];e[c+a]=e[c]-M,t[c+a]=t[c]-g,e[c]+=M,t[c]+=g}}},ge=e=>{const t=[[0,0,4],[27,18,84],[80,18,123],[129,37,129],[181,54,122],[229,80,100],[251,135,97],[254,194,135],[252,253,191]],n=L(e,0,1)*(t.length-1),o=Math.floor(n),r=n-o,a=t[o],s=t[Math.min(t.length-1,o+1)];return[Math.round(a[0]+(s[0]-a[0])*r),Math.round(a[1]+(s[1]-a[1])*r),Math.round(a[2]+(s[2]-a[2])*r)]},be=e=>{const t=i.specCanvas,n=t.getContext("2d"),o=t.width,r=t.height;n.fillStyle="#0f0f13",n.fillRect(0,0,o,r);const a=1024,s=256,d=a/2,c=Math.max(1,Math.floor((e.length-a)/s)+1),u=n.createImageData(o,r),f=[];let y=-120;for(let p=0;p<c;p+=1){const M=p*s,g=new Float32Array(a),x=new Float32Array(a);for(let v=0;v<a;v+=1)g[v]=(e[M+v]||0)*ve(v,a);he(g,x);const $=new Float32Array(d);for(let v=0;v<d;v+=1){const P=Math.sqrt(g[v]**2+x[v]**2),k=20*Math.log10(P+1e-9);$[v]=k,k>y&&(y=k)}f.push($)}for(let p=0;p<o;p+=1){const M=Math.min(c-1,Math.floor(p/(o-1)*(c-1))),g=f[M];for(let x=0;x<r;x+=1){const $=Math.floor((r-1-x)/(r-1)*(d-1)),v=(g==null?void 0:g[$])??-120,P=L((v-(y-80))/80,0,1),[k,W,D]=ge(P),C=(x*o+p)*4;u.data[C]=k,u.data[C+1]=W,u.data[C+2]=D,u.data[C+3]=255}}n.putImageData(u,0,0)},V=()=>{l.sourceNode&&(l.sourceNode.stop(),l.sourceNode.disconnect(),l.sourceNode=null),l.isPlaying=!1},we=async()=>{const e=U();l.audioContext||(l.audioContext=new AudioContext({sampleRate:S})),l.audioContext.state==="suspended"&&await l.audioContext.resume(),V();const t=l.audioContext.createBuffer(1,e.length,S);t.copyToChannel(e,0,0);const n=l.audioContext.createBufferSource();n.buffer=t,n.connect(l.audioContext.destination),n.onended=()=>{l.sourceNode===n&&(l.sourceNode=null,l.isPlaying=!1)},n.start(),l.sourceNode=n,l.isPlaying=!0},Me=()=>{const e=U(),t=le(e,S),n=URL.createObjectURL(t),o=document.createElement("a");o.href=n,o.download=`${l.spec.name||"sfx"}.wav`,o.click(),URL.revokeObjectURL(n)},xe=()=>{i.layersContainer.innerHTML="",l.spec.layers.forEach((e,t)=>{i.layersContainer.appendChild(ye(e,t))})},R=e=>{l.previewMode=e;const t=e==="wave";i.waveCanvas.style.display=t?"block":"none",i.specCanvas.style.display=t?"none":"block",i.toggleViewBtn.textContent=t?"Show Spectrogram":"Show Curve"},O=()=>{R(l.previewMode==="wave"?"spec":"wave")},H=()=>{i.nameInput.value=l.spec.name,i.durationInput.value=m(l.spec.duration,3),i.durationSlider.value=m(l.spec.duration,3),i.layerCount.textContent=`${l.spec.layers.length} layer${l.spec.layers.length===1?"":"s"}`,xe();const e=U();me(e),be(e),R(l.previewMode),i.jsonView.textContent=JSON.stringify(l.spec,null,2)};i.loadPresetBtn.addEventListener("click",()=>{const e=i.presetSelect.value;l.selectedPreset=e,h(z(T[e]))});i.randomizeBtn.addEventListener("click",()=>{h(Q())});i.nameInput.addEventListener("input",e=>{h(t=>({...t,name:e.target.value}))});i.durationInput.addEventListener("input",e=>{const t=L(Number(e.target.value)||.1,.03,2.5);h(n=>({...n,duration:Number(t.toFixed(3))}))});i.durationSlider.addEventListener("input",e=>{const t=L(Number(e.target.value)||.1,.03,2.5);h(n=>({...n,duration:Number(t.toFixed(3))}))});i.addLayerBtn.addEventListener("click",()=>{h(e=>({...e,layers:[...e.layers,ue()]}))});i.layersContainer.addEventListener("click",e=>{const t=e.target;if(!(t instanceof HTMLButtonElement))return;const n=Number(t.dataset.layer);Number.isInteger(n)&&(t.dataset.action==="remove"&&h(o=>{if(o.layers.length===1)return o;const r=w(o);return r.layers.splice(n,1),r}),t.dataset.action==="duplicate"&&h(o=>{const r=w(o);return r.layers.splice(n+1,0,w(r.layers[n])),r}))});i.layersContainer.addEventListener("input",e=>{const t=e.target;if(!(t instanceof HTMLInputElement||t instanceof HTMLSelectElement))return;const n=Number(t.dataset.layer),o=t.dataset.key;if(!(!Number.isInteger(n)||!o)){if(o==="type"){q(n,"type",t.value);return}if(o==="gain"||o==="attack"||o==="decay"||o==="offset"){q(n,o,Number(t.value));return}if(o==="freq"){q(n,"freq",Number(t.value));return}if(o==="freqMode"){h(r=>{const a=w(r);return a.layers[n].freq=t.value==="sweep"?{start:440,end:880,curve:"exp"}:Number(typeof a.layers[n].freq=="number"?a.layers[n].freq:a.layers[n].freq.start),a});return}if(o==="freqStart"||o==="freqEnd"||o==="freqCurve"){h(r=>{const a=w(r),s=typeof a.layers[n].freq=="object"?a.layers[n].freq:{start:440,end:880,curve:"exp"};return o==="freqStart"&&(s.start=Number(t.value)),o==="freqEnd"&&(s.end=Number(t.value)),o==="freqCurve"&&(s.curve=t.value),a.layers[n].freq=s,a});return}if(o==="filterEnabled"){h(r=>{const a=w(r);return a.layers[n].filter=t.value==="on"?{type:"lowpass",cutoff:2600}:null,a});return}(o==="filterType"||o==="filterCutoff")&&h(r=>{const a=w(r);return a.layers[n].filter||(a.layers[n].filter={type:"lowpass",cutoff:2600}),o==="filterType"&&(a.layers[n].filter.type=t.value),o==="filterCutoff"&&(a.layers[n].filter.cutoff=Number(t.value)),a})}});i.playBtn.addEventListener("click",()=>{we()});i.stopBtn.addEventListener("click",()=>{V()});i.downloadBtn.addEventListener("click",()=>{Me()});i.toggleViewBtn.addEventListener("click",()=>{O()});i.waveCanvas.addEventListener("click",()=>{O()});i.specCanvas.addEventListener("click",()=>{O()});pe();H();
