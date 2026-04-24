(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const B=(t,e,n="exp")=>({start:t,end:e,curve:n}),F={click:{name:"click",duration:.12,layers:[{type:"triangle",freq:1800,attack:.003,decay:.06,gain:.65,offset:0,filter:{type:"highpass",cutoff:900}},{type:"noise",freq:1200,attack:.002,decay:.03,gain:.2,offset:0,filter:{type:"highpass",cutoff:1500}}]},confirm:{name:"confirm",duration:.24,layers:[{type:"sine",freq:B(640,960,"exp"),attack:.005,decay:.14,gain:.52,offset:0,filter:null},{type:"triangle",freq:1280,attack:.004,decay:.11,gain:.22,offset:.02,filter:{type:"lowpass",cutoff:5200}}]},error:{name:"error",duration:.36,layers:[{type:"saw",freq:B(520,180,"linear"),attack:.004,decay:.2,gain:.62,offset:0,filter:{type:"lowpass",cutoff:2900}},{type:"square",freq:160,attack:.006,decay:.24,gain:.35,offset:.04,filter:{type:"highpass",cutoff:80}}]},notify:{name:"notify",duration:.42,layers:[{type:"sine",freq:B(480,740,"exp"),attack:.007,decay:.18,gain:.46,offset:0,filter:null},{type:"triangle",freq:B(740,990,"linear"),attack:.004,decay:.16,gain:.31,offset:.1,filter:{type:"lowpass",cutoff:6e3}}]}},Y=["sine","square","saw","triangle","noise"],K=["linear","exp"],Q=["lowpass","highpass"],b=(t,e)=>t+Math.random()*(e-t),j=t=>t[Math.floor(Math.random()*t.length)],Z=()=>{if(Math.random()<.45){const a=b(120,2200);return Math.round(a)}const t=b(100,1800),e=b(.4,2.5),n=Math.max(40,t*e);return{start:Math.round(t),end:Math.round(n),curve:j(K)}},tt=()=>Math.random()<.45?null:{type:j(Q),cutoff:Math.round(b(120,9e3))},et=()=>({type:j(Y),freq:Z(),attack:Number(b(.002,.04).toFixed(3)),decay:Number(b(.04,.35).toFixed(3)),gain:Number(b(.15,.9).toFixed(2)),offset:Number(b(0,.14).toFixed(3)),filter:tt()}),nt=()=>{const t=1+Math.floor(Math.random()*3),e=Array.from({length:t},et),n=Math.max(...e.map(a=>a.offset+a.attack+a.decay),.18);return{name:`rand-${Date.now().toString().slice(-4)}`,duration:Number(Math.max(.1,Math.min(1.2,n+b(.02,.18))).toFixed(3)),layers:e}},U=t=>JSON.parse(JSON.stringify(t)),S=44100,I=.002,at=10**(-20/20),$=(t,e,n)=>Math.min(n,Math.max(e,t)),ot=(t,e)=>{if(t==="sine")return Math.sin(e);if(t==="square")return Math.sin(e)>=0?1:-1;if(t==="saw"){const n=e/(Math.PI*2);return 2*(n-Math.floor(n+.5))}if(t==="triangle"){const n=e/(Math.PI*2);return 2*Math.abs(2*(n-Math.floor(n+.5)))-1}return Math.random()*2-1},q=t=>.5-.5*Math.cos(Math.PI*$(t,0,1)),rt=t=>.5+.5*Math.cos(Math.PI*$(t,0,1)),st=(t,e,n)=>{if(t<0)return 0;const a=Math.max(I,e),r=Math.max(I,n);return t<=a?q(t/a):t<=a+r?rt((t-a)/r):0},it=(t,e,n)=>{if(typeof t=="number")return Math.max(1,t);const a=t.curve==="exp"?"exp":"linear",r=$(e/Math.max(n,1e-6),0,1);return a==="linear"||t.start<=0||t.end<=0?Math.max(1,t.start+(t.end-t.start)*r):Math.max(1,t.start*(t.end/t.start)**r)},T=(t,e,n)=>{if(!e)return t;const a=new Float32Array(t.length),r=$(e.cutoff||1e3,20,n*.45),o=1/n,s=1/(2*Math.PI*r);if(e.type==="lowpass"){const f=o/(s+o);let y=0;for(let p=0;p<t.length;p+=1)y=y+f*(t[p]-y),a[p]=y;return a}const d=s/(s+o);let c=0,u=0;for(let f=0;f<t.length;f+=1){const y=t[f];c=d*(c+y-u),u=y,a[f]=c}return a},lt=(t,e,n)=>{const a=new Float32Array(e),r=Math.max(I*2,t.attack+t.decay),o=Math.max(0,Math.floor(t.offset*n));let s=0;for(let u=o;u<e;u+=1){const f=(u-o)/n,y=st(f,t.attack,t.decay);if(y<=1e-8)continue;const p=it(t.freq,f,r);s+=2*Math.PI*p/n;const M=ot(t.type,s);a[u]=M*y}const d=T(a,t.filter,n),c=Number.isFinite(t.gain)?t.gain:.5;for(let u=0;u<d.length;u+=1)d[u]*=c;return d},ct=(t,e)=>{let n=T(t,{type:"highpass",cutoff:20},e);n=T(n,{type:"lowpass",cutoff:1e4},e);let a=0;for(let s=0;s<n.length;s+=1)a+=n[s]*n[s];const r=Math.sqrt(a/Math.max(1,n.length));if(r>1e-9){const s=at/r;for(let d=0;d<n.length;d+=1)n[d]*=s}for(let s=0;s<n.length;s+=1)n[s]=.95*Math.tanh(n[s]/.95);const o=Math.max(1,Math.floor(I*e));for(let s=0;s<o&&s<n.length;s+=1){const d=s/o;n[s]*=q(d),n[n.length-1-s]*=q(d)}return n},dt=(t,e=S)=>{const n=Math.max(1,Math.floor(t.duration*e)),a=new Float32Array(n);for(const r of t.layers){const o=lt(r,n,e);for(let s=0;s<n;s+=1)a[s]+=o[s]}return ct(a,e)},ut=(t,e=S)=>{const n=e*2,a=t.length*2,r=new ArrayBuffer(44+a),o=new DataView(r),s=(c,u)=>{for(let f=0;f<u.length;f+=1)o.setUint8(c+f,u.charCodeAt(f))};s(0,"RIFF"),o.setUint32(4,36+a,!0),s(8,"WAVE"),s(12,"fmt "),o.setUint32(16,16,!0),o.setUint16(20,1,!0),o.setUint16(22,1,!0),o.setUint32(24,e,!0),o.setUint32(28,n,!0),o.setUint16(32,2,!0),o.setUint16(34,16,!0),s(36,"data"),o.setUint32(40,a,!0);let d=44;for(let c=0;c<t.length;c+=1){const u=$(t[c],-1,1),f=u<0?u*32768:u*32767;o.setInt16(d,f,!0),d+=2}return new Blob([r],{type:"audio/wav"})},J="click",R="1.0.0",ft=["sine","square","saw","triangle","noise"],pt=["lowpass","highpass"],w=t=>JSON.parse(JSON.stringify(t)),A=()=>`sfx-${Math.random().toString(36).slice(2,6)}`,z=(t,e=null)=>{const n=w(t),a=typeof n.createdAt=="string"&&n.createdAt||e&&typeof e.createdAt=="string"&&e.createdAt||new Date().toISOString();return{...n,name:typeof n.name=="string"&&n.name.trim()?n.name:A(),duration:Number.isFinite(n.duration)?n.duration:.2,layers:Array.isArray(n.layers)?n.layers:[],createdAt:a,version:R}},l={spec:z(U(F[J])),selectedPreset:J,previewMode:"wave",activeLayerDot:0,rendered:null,audioContext:null,sourceNode:null,isPlaying:!1},yt=document.querySelector("#app");yt.innerHTML=`
  <main class="shell">
    <section class="panel panel-sidebar">
      <h1>UX SFX Generator</h1>
      <p class="tagline">Browser additive synth for UI sonification</p>
      <p class="app-version">v${R}</p>
      <div class="settings-compact">
      <div class="preset-row">
        <select id="presetSelect" class="compact-select" aria-label="Preset"></select>
        <button id="loadPresetBtn" type="button">Load</button>
        <button id="randomizeBtn" type="button">Rand</button>
      </div>
      <div class="duration-row">
        <label for="durationInput">Duration</label>
        <div class="dual-input">
          <input id="durationSlider" type="range" min="0.03" max="2.5" step="0.001" />
          <input id="durationInput" type="number" min="0.03" max="2.5" step="0.01" />
        </div>
      </div>
      <p class="hint">Single source of truth: one controlled <code>spec</code> object drives all widgets.</p>
      </div>

      <div class="section-head">
        <h2>Preview</h2>
      </div>
      <div class="row-buttons">
        <button id="playToggleBtn" type="button">Play</button>
      </div>
      <div class="preview-stack">
        <canvas id="waveCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
        <canvas id="specCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
        <button id="canvasToggleHint" class="inline-hint" type="button">toggle view</button>
      </div>
      <button id="downloadInlineBtn" class="inline-hint inline-download" type="button">download wav</button>
      <div class="row-buttons json-actions">
        <button id="applyJsonBtn" type="button">Apply JSON</button>
        <button id="copyJsonBtn" type="button">Copy JSON</button>
      </div>
      <textarea id="jsonEditor" spellcheck="false"></textarea>
      <p id="jsonStatus" class="hint"></p>
    </section>

    <section class="panel panel-layers">
      <div class="section-head">
        <h2>Layers</h2>
        <div class="section-head-actions">
          <span id="layerCount"></span>
          <button id="addLayerBtn" type="button">Add Layer</button>
        </div>
      </div>
      <div id="layersContainer"></div>
      <div id="layerDots" class="layer-dots"></div>
    </section>
  </main>
`;const i={presetSelect:document.getElementById("presetSelect"),loadPresetBtn:document.getElementById("loadPresetBtn"),randomizeBtn:document.getElementById("randomizeBtn"),durationInput:document.getElementById("durationInput"),durationSlider:document.getElementById("durationSlider"),addLayerBtn:document.getElementById("addLayerBtn"),layersContainer:document.getElementById("layersContainer"),layerDots:document.getElementById("layerDots"),layerCount:document.getElementById("layerCount"),playToggleBtn:document.getElementById("playToggleBtn"),downloadInlineBtn:document.getElementById("downloadInlineBtn"),canvasToggleHint:document.getElementById("canvasToggleHint"),waveCanvas:document.getElementById("waveCanvas"),specCanvas:document.getElementById("specCanvas"),applyJsonBtn:document.getElementById("applyJsonBtn"),copyJsonBtn:document.getElementById("copyJsonBtn"),jsonEditor:document.getElementById("jsonEditor"),jsonStatus:document.getElementById("jsonStatus")},E=(t,e,n)=>Math.min(n,Math.max(e,t)),mt=()=>({type:"sine",freq:880,attack:.004,decay:.12,gain:.5,offset:0,filter:null}),h=t=>{const e=typeof t=="function"?t(l.spec):t;l.spec=z(e,l.spec),V()},D=()=>(l.rendered=dt(l.spec,S),l.rendered),m=(t,e=3)=>Number(t).toFixed(e),vt=t=>typeof t=="number"?`${Math.round(t)} Hz`:`${Math.round(t.start)} -> ${Math.round(t.end)} (${t.curve})`,P=(t,e,n)=>{h(a=>{const r=w(a);return r.layers[t][e]=n,r})},ht=()=>{i.presetSelect.innerHTML=Object.keys(F).map(t=>`<option value="${t}">${t}</option>`).join(""),i.presetSelect.value=l.selectedPreset},gt=(t,e)=>{const n=document.createElement("article");n.className="layer-card";const a=typeof t.freq=="object",r=t.filter!==null;return n.innerHTML=`
    <div class="layer-head">
      <strong>Layer ${e+1}</strong>
      <div class="row-buttons">
        <button type="button" data-action="duplicate" data-layer="${e}">Duplicate</button>
        <button type="button" data-action="remove" data-layer="${e}">Remove</button>
      </div>
    </div>

    <div class="grid-two">
      <label>Wave
        <select data-key="type" data-layer="${e}">
          ${ft.map(o=>`<option value="${o}" ${o===t.type?"selected":""}>${o}</option>`).join("")}
        </select>
      </label>

      <label>Gain
        <div class="dual-input">
          <input data-key="gain" data-layer="${e}" type="range" step="0.01" min="0" max="2" value="${m(t.gain,2)}" />
          <input data-key="gain" data-layer="${e}" type="number" step="0.01" min="0" max="2" value="${m(t.gain,2)}" />
        </div>
      </label>

      <label>Attack (s)
        <div class="dual-input">
          <input data-key="attack" data-layer="${e}" type="range" step="0.001" min="0.002" max="1" value="${m(t.attack)}" />
          <input data-key="attack" data-layer="${e}" type="number" step="0.001" min="0.002" max="1" value="${m(t.attack)}" />
        </div>
      </label>

      <label>Decay (s)
        <div class="dual-input">
          <input data-key="decay" data-layer="${e}" type="range" step="0.001" min="0.002" max="2" value="${m(t.decay)}" />
          <input data-key="decay" data-layer="${e}" type="number" step="0.001" min="0.002" max="2" value="${m(t.decay)}" />
        </div>
      </label>

      <label>Offset (s)
        <div class="dual-input">
          <input data-key="offset" data-layer="${e}" type="range" step="0.001" min="0" max="2" value="${m(t.offset)}" />
          <input data-key="offset" data-layer="${e}" type="number" step="0.001" min="0" max="2" value="${m(t.offset)}" />
        </div>
      </label>

      <label>Freq mode
        <select data-key="freqMode" data-layer="${e}">
          <option value="fixed" ${a?"":"selected"}>fixed</option>
          <option value="sweep" ${a?"selected":""}>sweep</option>
        </select>
      </label>

      ${a?`
      <label>Start (Hz)
        <input data-key="freqStart" data-layer="${e}" type="number" step="1" min="20" max="20000" value="${m(t.freq.start,0)}" />
      </label>
      <label>End (Hz)
        <input data-key="freqEnd" data-layer="${e}" type="number" step="1" min="20" max="20000" value="${m(t.freq.end,0)}" />
      </label>
      <label>Sweep curve
        <select data-key="freqCurve" data-layer="${e}">
          <option value="linear" ${t.freq.curve==="linear"?"selected":""}>linear</option>
          <option value="exp" ${t.freq.curve==="exp"?"selected":""}>exp</option>
        </select>
      </label>
      `:`
      <label>Freq (Hz)
        <input data-key="freq" data-layer="${e}" type="number" step="1" min="20" max="20000" value="${m(t.freq,0)}" />
      </label>
      <label class="meta-pill">${vt(t.freq)}</label>
      `}

      <label>Filter
        <select data-key="filterEnabled" data-layer="${e}">
          <option value="off" ${r?"":"selected"}>off</option>
          <option value="on" ${r?"selected":""}>on</option>
        </select>
      </label>

      ${r?`
      <label>Filter type
        <select data-key="filterType" data-layer="${e}">
          ${pt.map(o=>`<option value="${o}" ${t.filter.type===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </label>
      <label>Cutoff (Hz)
        <input data-key="filterCutoff" data-layer="${e}" type="number" min="20" max="20000" step="1" value="${m(t.filter.cutoff,0)}" />
      </label>
      `:""}
    </div>
  `,n},bt=t=>{const e=i.waveCanvas.getContext("2d"),n=i.waveCanvas.width,a=i.waveCanvas.height;e.fillStyle="#11131b",e.fillRect(0,0,n,a),e.strokeStyle="#2f354a",e.lineWidth=1,e.beginPath(),e.moveTo(0,a/2),e.lineTo(n,a/2),e.stroke(),e.strokeStyle="#fef08a",e.lineWidth=2,e.beginPath();for(let r=0;r<n;r+=1){const o=Math.floor(r/(n-1)*(t.length-1)),s=a*.5-t[o]*(a*.44);r===0?e.moveTo(r,s):e.lineTo(r,s)}e.stroke()},wt=(t,e)=>.5-.5*Math.cos(2*Math.PI*t/(e-1)),Mt=(t,e)=>{const n=t.length,a=Math.log2(n);if(Math.floor(a)!==a)throw new Error("FFT size must be power of 2");for(let r=0;r<n;r+=1){let o=0;for(let s=0;s<a;s+=1)o=o<<1|r>>>s&1;o>r&&([t[r],t[o]]=[t[o],t[r]],[e[r],e[o]]=[e[o],e[r]])}for(let r=2;r<=n;r<<=1){const o=r>>1,s=2*Math.PI/r;for(let d=0;d<n;d+=r)for(let c=d;c<d+o;c+=1){const f=-(c-d)*s,y=Math.cos(f),p=Math.sin(f),M=y*t[c+o]-p*e[c+o],g=y*e[c+o]+p*t[c+o];t[c+o]=t[c]-M,e[c+o]=e[c]-g,t[c]+=M,e[c]+=g}}},xt=t=>{const e=[[0,0,4],[27,18,84],[80,18,123],[129,37,129],[181,54,122],[229,80,100],[251,135,97],[254,194,135],[252,253,191]],n=E(t,0,1)*(e.length-1),a=Math.floor(n),r=n-a,o=e[a],s=e[Math.min(e.length-1,a+1)];return[Math.round(o[0]+(s[0]-o[0])*r),Math.round(o[1]+(s[1]-o[1])*r),Math.round(o[2]+(s[2]-o[2])*r)]},St=t=>{const e=i.specCanvas,n=e.getContext("2d"),a=e.width,r=e.height;n.fillStyle="#0f0f13",n.fillRect(0,0,a,r);const o=1024,s=256,d=o/2,c=Math.max(1,Math.floor((t.length-o)/s)+1),u=n.createImageData(a,r),f=[];let y=-120;for(let p=0;p<c;p+=1){const M=p*s,g=new Float32Array(o),x=new Float32Array(o);for(let v=0;v<o;v+=1)g[v]=(t[M+v]||0)*wt(v,o);Mt(g,x);const k=new Float32Array(d);for(let v=0;v<d;v+=1){const N=Math.sqrt(g[v]**2+x[v]**2),C=20*Math.log10(N+1e-9);k[v]=C,C>y&&(y=C)}f.push(k)}for(let p=0;p<a;p+=1){const M=Math.min(c-1,Math.floor(p/(a-1)*(c-1))),g=f[M];for(let x=0;x<r;x+=1){const k=Math.floor((r-1-x)/(r-1)*(d-1)),v=(g==null?void 0:g[k])??-120,N=E((v-(y-80))/80,0,1),[C,G,X]=xt(N),L=(x*a+p)*4;u.data[L]=C,u.data[L+1]=G,u.data[L+2]=X,u.data[L+3]=255}}n.putImageData(u,0,0)},W=()=>{l.sourceNode&&(l.sourceNode.stop(),l.sourceNode.disconnect(),l.sourceNode=null),l.isPlaying=!1,i.playToggleBtn.textContent="Play"},Et=async()=>{const t=D();l.audioContext||(l.audioContext=new AudioContext({sampleRate:S})),l.audioContext.state==="suspended"&&await l.audioContext.resume(),W();const e=l.audioContext.createBuffer(1,t.length,S);e.copyToChannel(t,0,0);const n=l.audioContext.createBufferSource();n.buffer=e,n.connect(l.audioContext.destination),n.onended=()=>{l.sourceNode===n&&(l.sourceNode=null,l.isPlaying=!1,i.playToggleBtn.textContent="Play")},n.start(),l.sourceNode=n,l.isPlaying=!0,i.playToggleBtn.textContent="Stop"},Ct=()=>{const t=D(),e=ut(t,S),n=URL.createObjectURL(e),a=document.createElement("a");a.href=n,a.download=`${(l.spec.name||A()).trim()||A()}.wav`,a.click(),URL.revokeObjectURL(n)},$t=()=>{i.layersContainer.innerHTML="",l.spec.layers.forEach((t,e)=>{i.layersContainer.appendChild(gt(t,e))})},O=()=>{i.layerDots.innerHTML=l.spec.layers.map((t,e)=>`<button type="button" data-dot="${e}" class="${e===l.activeLayerDot?"active":""}" aria-label="Layer ${e+1}"></button>`).join("")},kt=()=>{const t=i.layersContainer.querySelector(".layer-card");if(!t)return;const e=t.getBoundingClientRect().width+10,n=Math.round(i.layersContainer.scrollLeft/Math.max(1,e)),a=E(n,0,Math.max(0,l.spec.layers.length-1));a!==l.activeLayerDot&&(l.activeLayerDot=a,O())},_=t=>{l.previewMode=t;const e=t==="wave";i.waveCanvas.style.display=e?"block":"none",i.specCanvas.style.display=e?"none":"block"},H=()=>{_(l.previewMode==="wave"?"spec":"wave")},V=()=>{i.durationInput.value=m(l.spec.duration,3),i.durationSlider.value=m(l.spec.duration,3),i.playToggleBtn.textContent=l.isPlaying?"Stop":"Play",i.layerCount.textContent=`${l.spec.layers.length} layer${l.spec.layers.length===1?"":"s"}`,$t(),l.activeLayerDot=E(l.activeLayerDot,0,Math.max(0,l.spec.layers.length-1)),O();const t=D();bt(t),St(t),_(l.previewMode),i.jsonEditor.value=JSON.stringify(l.spec,null,2),i.jsonStatus.textContent=""};i.loadPresetBtn.addEventListener("click",()=>{const t=i.presetSelect.value;l.selectedPreset=t;const e=U(F[t]);h(e)});i.randomizeBtn.addEventListener("click",()=>{h(nt())});i.durationInput.addEventListener("input",t=>{const e=E(Number(t.target.value)||.1,.03,2.5);h(n=>({...n,duration:Number(e.toFixed(3))}))});i.durationSlider.addEventListener("input",t=>{const e=E(Number(t.target.value)||.1,.03,2.5);h(n=>({...n,duration:Number(e.toFixed(3))}))});i.addLayerBtn.addEventListener("click",()=>{h(t=>({...t,layers:[...t.layers,mt()]}))});i.layersContainer.addEventListener("scroll",()=>{kt()});i.layerDots.addEventListener("click",t=>{const e=t.target;if(!(e instanceof HTMLButtonElement))return;const n=Number(e.dataset.dot);if(!Number.isInteger(n))return;const a=i.layersContainer.querySelector(".layer-card");if(!a)return;const r=a.getBoundingClientRect().width+10;i.layersContainer.scrollTo({left:n*r,behavior:"smooth"}),l.activeLayerDot=n,O()});i.layersContainer.addEventListener("click",t=>{const e=t.target;if(!(e instanceof HTMLButtonElement))return;const n=Number(e.dataset.layer);Number.isInteger(n)&&(e.dataset.action==="remove"&&h(a=>{if(a.layers.length===1)return a;const r=w(a);return r.layers.splice(n,1),r}),e.dataset.action==="duplicate"&&h(a=>{const r=w(a);return r.layers.splice(n+1,0,w(r.layers[n])),r}))});i.layersContainer.addEventListener("input",t=>{const e=t.target;if(!(e instanceof HTMLInputElement||e instanceof HTMLSelectElement))return;const n=Number(e.dataset.layer),a=e.dataset.key;if(!(!Number.isInteger(n)||!a)){if(a==="type"){P(n,"type",e.value);return}if(a==="gain"||a==="attack"||a==="decay"||a==="offset"){P(n,a,Number(e.value));return}if(a==="freq"){P(n,"freq",Number(e.value));return}if(a==="freqMode"){h(r=>{const o=w(r);return o.layers[n].freq=e.value==="sweep"?{start:440,end:880,curve:"exp"}:Number(typeof o.layers[n].freq=="number"?o.layers[n].freq:o.layers[n].freq.start),o});return}if(a==="freqStart"||a==="freqEnd"||a==="freqCurve"){h(r=>{const o=w(r),s=typeof o.layers[n].freq=="object"?o.layers[n].freq:{start:440,end:880,curve:"exp"};return a==="freqStart"&&(s.start=Number(e.value)),a==="freqEnd"&&(s.end=Number(e.value)),a==="freqCurve"&&(s.curve=e.value),o.layers[n].freq=s,o});return}if(a==="filterEnabled"){h(r=>{const o=w(r);return o.layers[n].filter=e.value==="on"?{type:"lowpass",cutoff:2600}:null,o});return}(a==="filterType"||a==="filterCutoff")&&h(r=>{const o=w(r);return o.layers[n].filter||(o.layers[n].filter={type:"lowpass",cutoff:2600}),a==="filterType"&&(o.layers[n].filter.type=e.value),a==="filterCutoff"&&(o.layers[n].filter.cutoff=Number(e.value)),o})}});i.playToggleBtn.addEventListener("click",()=>{if(l.isPlaying){W();return}Et()});i.downloadInlineBtn.addEventListener("click",()=>{Ct()});i.canvasToggleHint.addEventListener("click",()=>{H()});i.waveCanvas.addEventListener("click",()=>{H()});i.specCanvas.addEventListener("click",()=>{H()});i.copyJsonBtn.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(i.jsonEditor.value),i.jsonStatus.textContent="JSON copied to clipboard."}catch{i.jsonStatus.textContent="Clipboard copy failed."}});i.applyJsonBtn.addEventListener("click",()=>{try{const t=JSON.parse(i.jsonEditor.value);if(!t||typeof t!="object"||!Array.isArray(t.layers))throw new Error("Invalid spec shape");h(t),i.jsonStatus.textContent="Spec applied."}catch{i.jsonStatus.textContent="Invalid JSON. Expected a Spec object."}});ht();V();
