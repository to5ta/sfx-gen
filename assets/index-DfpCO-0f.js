(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=n(r);fetch(r.href,a)}})();const $=(t,e,n="exp")=>({start:t,end:e,curve:n}),B={click:{name:"click",duration:.12,layers:[{type:"triangle",freq:1800,attack:.003,decay:.06,gain:.65,offset:0,filter:{type:"highpass",cutoff:900}},{type:"noise",freq:1200,attack:.002,decay:.03,gain:.2,offset:0,filter:{type:"highpass",cutoff:1500}}]},confirm:{name:"confirm",duration:.24,layers:[{type:"sine",freq:$(640,960,"exp"),attack:.005,decay:.14,gain:.52,offset:0,filter:null},{type:"triangle",freq:1280,attack:.004,decay:.11,gain:.22,offset:.02,filter:{type:"lowpass",cutoff:5200}}]},error:{name:"error",duration:.36,layers:[{type:"saw",freq:$(520,180,"linear"),attack:.004,decay:.2,gain:.62,offset:0,filter:{type:"lowpass",cutoff:2900}},{type:"square",freq:160,attack:.006,decay:.24,gain:.35,offset:.04,filter:{type:"highpass",cutoff:80}}]},notify:{name:"notify",duration:.42,layers:[{type:"sine",freq:$(480,740,"exp"),attack:.007,decay:.18,gain:.46,offset:0,filter:null},{type:"triangle",freq:$(740,990,"linear"),attack:.004,decay:.16,gain:.31,offset:.1,filter:{type:"lowpass",cutoff:6e3}}]}},G=["sine","square","saw","triangle","noise"],X=["linear","exp"],Y=["lowpass","highpass"],g=(t,e)=>t+Math.random()*(e-t),O=t=>t[Math.floor(Math.random()*t.length)],K=()=>{if(Math.random()<.45){const o=g(120,2200);return Math.round(o)}const t=g(100,1800),e=g(.4,2.5),n=Math.max(40,t*e);return{start:Math.round(t),end:Math.round(n),curve:O(X)}},Q=()=>Math.random()<.45?null:{type:O(Y),cutoff:Math.round(g(120,9e3))},Z=()=>({type:O(G),freq:K(),attack:Number(g(.002,.04).toFixed(3)),decay:Number(g(.04,.35).toFixed(3)),gain:Number(g(.15,.9).toFixed(2)),offset:Number(g(0,.14).toFixed(3)),filter:Q()}),tt=()=>{const t=1+Math.floor(Math.random()*3),e=Array.from({length:t},Z),n=Math.max(...e.map(o=>o.offset+o.attack+o.decay),.18);return{name:`rand-${Date.now().toString().slice(-4)}`,duration:Number(Math.max(.1,Math.min(1.2,n+g(.02,.18))).toFixed(3)),layers:e}},F=t=>JSON.parse(JSON.stringify(t)),E=44100,I=.002,et=10**(-20/20),k=(t,e,n)=>Math.min(n,Math.max(e,t)),nt=(t,e)=>{if(t==="sine")return Math.sin(e);if(t==="square")return Math.sin(e)>=0?1:-1;if(t==="saw"){const n=e/(Math.PI*2);return 2*(n-Math.floor(n+.5))}if(t==="triangle"){const n=e/(Math.PI*2);return 2*Math.abs(2*(n-Math.floor(n+.5)))-1}return Math.random()*2-1},T=t=>.5-.5*Math.cos(Math.PI*k(t,0,1)),at=t=>.5+.5*Math.cos(Math.PI*k(t,0,1)),ot=(t,e,n)=>{if(t<0)return 0;const o=Math.max(I,e),r=Math.max(I,n);return t<=o?T(t/o):t<=o+r?at((t-o)/r):0},rt=(t,e,n)=>{if(typeof t=="number")return Math.max(1,t);const o=t.curve==="exp"?"exp":"linear",r=k(e/Math.max(n,1e-6),0,1);return o==="linear"||t.start<=0||t.end<=0?Math.max(1,t.start+(t.end-t.start)*r):Math.max(1,t.start*(t.end/t.start)**r)},j=(t,e,n)=>{if(!e)return t;const o=new Float32Array(t.length),r=k(e.cutoff||1e3,20,n*.45),a=1/n,s=1/(2*Math.PI*r);if(e.type==="lowpass"){const p=a/(s+a);let y=0;for(let f=0;f<t.length;f+=1)y=y+p*(t[f]-y),o[f]=y;return o}const d=s/(s+a);let c=0,u=0;for(let p=0;p<t.length;p+=1){const y=t[p];c=d*(c+y-u),u=y,o[p]=c}return o},st=(t,e,n)=>{const o=new Float32Array(e),r=Math.max(I*2,t.attack+t.decay),a=Math.max(0,Math.floor(t.offset*n));let s=0;for(let u=a;u<e;u+=1){const p=(u-a)/n,y=ot(p,t.attack,t.decay);if(y<=1e-8)continue;const f=rt(t.freq,p,r);s+=2*Math.PI*f/n;const w=nt(t.type,s);o[u]=w*y}const d=j(o,t.filter,n),c=Number.isFinite(t.gain)?t.gain:.5;for(let u=0;u<d.length;u+=1)d[u]*=c;return d},it=(t,e)=>{let n=j(t,{type:"highpass",cutoff:20},e);n=j(n,{type:"lowpass",cutoff:1e4},e);let o=0;for(let s=0;s<n.length;s+=1)o+=n[s]*n[s];const r=Math.sqrt(o/Math.max(1,n.length));if(r>1e-9){const s=et/r;for(let d=0;d<n.length;d+=1)n[d]*=s}for(let s=0;s<n.length;s+=1)n[s]=.95*Math.tanh(n[s]/.95);const a=Math.max(1,Math.floor(I*e));for(let s=0;s<a&&s<n.length;s+=1){const d=s/a;n[s]*=T(d),n[n.length-1-s]*=T(d)}return n},lt=(t,e=E)=>{const n=Math.max(1,Math.floor(t.duration*e)),o=new Float32Array(n);for(const r of t.layers){const a=st(r,n,e);for(let s=0;s<n;s+=1)o[s]+=a[s]}return it(o,e)},ct=(t,e=E)=>{const n=e*2,o=t.length*2,r=new ArrayBuffer(44+o),a=new DataView(r),s=(c,u)=>{for(let p=0;p<u.length;p+=1)a.setUint8(c+p,u.charCodeAt(p))};s(0,"RIFF"),a.setUint32(4,36+o,!0),s(8,"WAVE"),s(12,"fmt "),a.setUint32(16,16,!0),a.setUint16(20,1,!0),a.setUint16(22,1,!0),a.setUint32(24,e,!0),a.setUint32(28,n,!0),a.setUint16(32,2,!0),a.setUint16(34,16,!0),s(36,"data"),a.setUint32(40,o,!0);let d=44;for(let c=0;c<t.length;c+=1){const u=k(t[c],-1,1),p=u<0?u*32768:u*32767;a.setInt16(d,p,!0),d+=2}return new Blob([r],{type:"audio/wav"})},q="click",z="1.0.0",dt=["sine","square","saw","triangle","noise"],ut=["lowpass","highpass"],x=t=>JSON.parse(JSON.stringify(t)),H=(t,e=null)=>{const n=x(t),o=typeof n.createdAt=="string"&&n.createdAt||e&&typeof e.createdAt=="string"&&e.createdAt||new Date().toISOString();return{...n,name:typeof n.name=="string"?n.name:"sfx",duration:Number.isFinite(n.duration)?n.duration:.2,layers:Array.isArray(n.layers)?n.layers:[],createdAt:o,version:z}},i={spec:H(F(B[q])),selectedPreset:q,previewMode:"wave",exportName:F(B[q]).name,rendered:null,audioContext:null,sourceNode:null,isPlaying:!1},pt=document.querySelector("#app");pt.innerHTML=`
  <main class="shell">
    <section class="panel panel-sidebar">
      <h1>UX SFX Generator</h1>
      <p class="tagline">Browser additive synth for UI sonification</p>
      <p class="app-version">v${z}</p>
      <div class="control-group">
        <label for="presetSelect">Preset</label>
        <select id="presetSelect" class="compact-select"></select>
      </div>
      <div class="column-buttons">
        <button id="loadPresetBtn" type="button">Load</button>
        <button id="randomizeBtn" type="button">Randomize</button>
      </div>
      <div class="control-group">
        <label for="durationInput">Duration (s)</label>
        <div class="dual-input">
          <input id="durationSlider" type="range" min="0.03" max="2.5" step="0.001" />
          <input id="durationInput" type="number" min="0.03" max="2.5" step="0.01" />
        </div>
      </div>
      <p class="hint">Single source of truth: one controlled <code>spec</code> object drives all widgets.</p>

      <div class="section-head">
        <h2>Preview</h2>
      </div>
      <div class="row-buttons">
        <button id="playBtn" type="button">Play</button>
        <button id="stopBtn" type="button">Stop</button>
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
      <div class="export-row">
        <label for="exportNameInput">Export Name</label>
        <input id="exportNameInput" type="text" placeholder="sfx" />
        <button id="downloadBtn" type="button">WAV Download</button>
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
    </section>
  </main>
`;const l={presetSelect:document.getElementById("presetSelect"),loadPresetBtn:document.getElementById("loadPresetBtn"),randomizeBtn:document.getElementById("randomizeBtn"),durationInput:document.getElementById("durationInput"),durationSlider:document.getElementById("durationSlider"),addLayerBtn:document.getElementById("addLayerBtn"),layersContainer:document.getElementById("layersContainer"),layerCount:document.getElementById("layerCount"),playBtn:document.getElementById("playBtn"),stopBtn:document.getElementById("stopBtn"),downloadBtn:document.getElementById("downloadBtn"),canvasToggleHint:document.getElementById("canvasToggleHint"),waveCanvas:document.getElementById("waveCanvas"),specCanvas:document.getElementById("specCanvas"),applyJsonBtn:document.getElementById("applyJsonBtn"),copyJsonBtn:document.getElementById("copyJsonBtn"),exportNameInput:document.getElementById("exportNameInput"),jsonEditor:document.getElementById("jsonEditor"),jsonStatus:document.getElementById("jsonStatus")},L=(t,e,n)=>Math.min(n,Math.max(e,t)),ft=()=>({type:"sine",freq:880,attack:.004,decay:.12,gain:.5,offset:0,filter:null}),h=t=>{const e=i.spec.name,n=typeof t=="function"?t(i.spec):t;i.spec=H(n,i.spec),(!i.exportName||i.exportName===e)&&(i.exportName=i.spec.name),D()},J=()=>(i.rendered=lt(i.spec,E),i.rendered),m=(t,e=3)=>Number(t).toFixed(e),yt=t=>typeof t=="number"?`${Math.round(t)} Hz`:`${Math.round(t.start)} -> ${Math.round(t.end)} (${t.curve})`,A=(t,e,n)=>{h(o=>{const r=x(o);return r.layers[t][e]=n,r})},mt=()=>{l.presetSelect.innerHTML=Object.keys(B).map(t=>`<option value="${t}">${t}</option>`).join(""),l.presetSelect.value=i.selectedPreset},vt=(t,e)=>{const n=document.createElement("article");n.className="layer-card";const o=typeof t.freq=="object",r=t.filter!==null;return n.innerHTML=`
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
          ${dt.map(a=>`<option value="${a}" ${a===t.type?"selected":""}>${a}</option>`).join("")}
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
          <option value="fixed" ${o?"":"selected"}>fixed</option>
          <option value="sweep" ${o?"selected":""}>sweep</option>
        </select>
      </label>

      ${o?`
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
      <label class="meta-pill">${yt(t.freq)}</label>
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
          ${ut.map(a=>`<option value="${a}" ${t.filter.type===a?"selected":""}>${a}</option>`).join("")}
        </select>
      </label>
      <label>Cutoff (Hz)
        <input data-key="filterCutoff" data-layer="${e}" type="number" min="20" max="20000" step="1" value="${m(t.filter.cutoff,0)}" />
      </label>
      `:""}
    </div>
  `,n},ht=t=>{const e=l.waveCanvas.getContext("2d"),n=l.waveCanvas.width,o=l.waveCanvas.height;e.fillStyle="#11131b",e.fillRect(0,0,n,o),e.strokeStyle="#2f354a",e.lineWidth=1,e.beginPath(),e.moveTo(0,o/2),e.lineTo(n,o/2),e.stroke(),e.strokeStyle="#fef08a",e.lineWidth=2,e.beginPath();for(let r=0;r<n;r+=1){const a=Math.floor(r/(n-1)*(t.length-1)),s=o*.5-t[a]*(o*.44);r===0?e.moveTo(r,s):e.lineTo(r,s)}e.stroke()},bt=(t,e)=>.5-.5*Math.cos(2*Math.PI*t/(e-1)),gt=(t,e)=>{const n=t.length,o=Math.log2(n);if(Math.floor(o)!==o)throw new Error("FFT size must be power of 2");for(let r=0;r<n;r+=1){let a=0;for(let s=0;s<o;s+=1)a=a<<1|r>>>s&1;a>r&&([t[r],t[a]]=[t[a],t[r]],[e[r],e[a]]=[e[a],e[r]])}for(let r=2;r<=n;r<<=1){const a=r>>1,s=2*Math.PI/r;for(let d=0;d<n;d+=r)for(let c=d;c<d+a;c+=1){const p=-(c-d)*s,y=Math.cos(p),f=Math.sin(p),w=y*t[c+a]-f*e[c+a],b=y*e[c+a]+f*t[c+a];t[c+a]=t[c]-w,e[c+a]=e[c]-b,t[c]+=w,e[c]+=b}}},xt=t=>{const e=[[0,0,4],[27,18,84],[80,18,123],[129,37,129],[181,54,122],[229,80,100],[251,135,97],[254,194,135],[252,253,191]],n=L(t,0,1)*(e.length-1),o=Math.floor(n),r=n-o,a=e[o],s=e[Math.min(e.length-1,o+1)];return[Math.round(a[0]+(s[0]-a[0])*r),Math.round(a[1]+(s[1]-a[1])*r),Math.round(a[2]+(s[2]-a[2])*r)]},wt=t=>{const e=l.specCanvas,n=e.getContext("2d"),o=e.width,r=e.height;n.fillStyle="#0f0f13",n.fillRect(0,0,o,r);const a=1024,s=256,d=a/2,c=Math.max(1,Math.floor((t.length-a)/s)+1),u=n.createImageData(o,r),p=[];let y=-120;for(let f=0;f<c;f+=1){const w=f*s,b=new Float32Array(a),M=new Float32Array(a);for(let v=0;v<a;v+=1)b[v]=(t[w+v]||0)*bt(v,a);gt(b,M);const C=new Float32Array(d);for(let v=0;v<d;v+=1){const P=Math.sqrt(b[v]**2+M[v]**2),S=20*Math.log10(P+1e-9);C[v]=S,S>y&&(y=S)}p.push(C)}for(let f=0;f<o;f+=1){const w=Math.min(c-1,Math.floor(f/(o-1)*(c-1))),b=p[w];for(let M=0;M<r;M+=1){const C=Math.floor((r-1-M)/(r-1)*(d-1)),v=(b==null?void 0:b[C])??-120,P=L((v-(y-80))/80,0,1),[S,_,V]=xt(P),N=(M*o+f)*4;u.data[N]=S,u.data[N+1]=_,u.data[N+2]=V,u.data[N+3]=255}}n.putImageData(u,0,0)},R=()=>{i.sourceNode&&(i.sourceNode.stop(),i.sourceNode.disconnect(),i.sourceNode=null),i.isPlaying=!1},Mt=async()=>{const t=J();i.audioContext||(i.audioContext=new AudioContext({sampleRate:E})),i.audioContext.state==="suspended"&&await i.audioContext.resume(),R();const e=i.audioContext.createBuffer(1,t.length,E);e.copyToChannel(t,0,0);const n=i.audioContext.createBufferSource();n.buffer=e,n.connect(i.audioContext.destination),n.onended=()=>{i.sourceNode===n&&(i.sourceNode=null,i.isPlaying=!1)},n.start(),i.sourceNode=n,i.isPlaying=!0},Et=()=>{const t=J(),e=ct(t,E),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=`${(i.exportName||i.spec.name||"sfx").trim()||"sfx"}.wav`,o.click(),URL.revokeObjectURL(n)},St=()=>{l.layersContainer.innerHTML="",i.spec.layers.forEach((t,e)=>{l.layersContainer.appendChild(vt(t,e))})},W=t=>{i.previewMode=t;const e=t==="wave";l.waveCanvas.style.display=e?"block":"none",l.specCanvas.style.display=e?"none":"block"},U=()=>{W(i.previewMode==="wave"?"spec":"wave")},D=()=>{l.durationInput.value=m(i.spec.duration,3),l.durationSlider.value=m(i.spec.duration,3),l.exportNameInput.value=i.exportName||i.spec.name,l.layerCount.textContent=`${i.spec.layers.length} layer${i.spec.layers.length===1?"":"s"}`,St();const t=J();ht(t),wt(t),W(i.previewMode),l.jsonEditor.value=JSON.stringify(i.spec,null,2),l.jsonStatus.textContent=""};l.loadPresetBtn.addEventListener("click",()=>{const t=l.presetSelect.value;i.selectedPreset=t;const e=F(B[t]);i.exportName=e.name,h(e)});l.randomizeBtn.addEventListener("click",()=>{const t=tt();i.exportName=t.name,h(t)});l.durationInput.addEventListener("input",t=>{const e=L(Number(t.target.value)||.1,.03,2.5);h(n=>({...n,duration:Number(e.toFixed(3))}))});l.durationSlider.addEventListener("input",t=>{const e=L(Number(t.target.value)||.1,.03,2.5);h(n=>({...n,duration:Number(e.toFixed(3))}))});l.exportNameInput.addEventListener("input",t=>{i.exportName=t.target.value});l.addLayerBtn.addEventListener("click",()=>{h(t=>({...t,layers:[...t.layers,ft()]}))});l.layersContainer.addEventListener("click",t=>{const e=t.target;if(!(e instanceof HTMLButtonElement))return;const n=Number(e.dataset.layer);Number.isInteger(n)&&(e.dataset.action==="remove"&&h(o=>{if(o.layers.length===1)return o;const r=x(o);return r.layers.splice(n,1),r}),e.dataset.action==="duplicate"&&h(o=>{const r=x(o);return r.layers.splice(n+1,0,x(r.layers[n])),r}))});l.layersContainer.addEventListener("input",t=>{const e=t.target;if(!(e instanceof HTMLInputElement||e instanceof HTMLSelectElement))return;const n=Number(e.dataset.layer),o=e.dataset.key;if(!(!Number.isInteger(n)||!o)){if(o==="type"){A(n,"type",e.value);return}if(o==="gain"||o==="attack"||o==="decay"||o==="offset"){A(n,o,Number(e.value));return}if(o==="freq"){A(n,"freq",Number(e.value));return}if(o==="freqMode"){h(r=>{const a=x(r);return a.layers[n].freq=e.value==="sweep"?{start:440,end:880,curve:"exp"}:Number(typeof a.layers[n].freq=="number"?a.layers[n].freq:a.layers[n].freq.start),a});return}if(o==="freqStart"||o==="freqEnd"||o==="freqCurve"){h(r=>{const a=x(r),s=typeof a.layers[n].freq=="object"?a.layers[n].freq:{start:440,end:880,curve:"exp"};return o==="freqStart"&&(s.start=Number(e.value)),o==="freqEnd"&&(s.end=Number(e.value)),o==="freqCurve"&&(s.curve=e.value),a.layers[n].freq=s,a});return}if(o==="filterEnabled"){h(r=>{const a=x(r);return a.layers[n].filter=e.value==="on"?{type:"lowpass",cutoff:2600}:null,a});return}(o==="filterType"||o==="filterCutoff")&&h(r=>{const a=x(r);return a.layers[n].filter||(a.layers[n].filter={type:"lowpass",cutoff:2600}),o==="filterType"&&(a.layers[n].filter.type=e.value),o==="filterCutoff"&&(a.layers[n].filter.cutoff=Number(e.value)),a})}});l.playBtn.addEventListener("click",()=>{Mt()});l.stopBtn.addEventListener("click",()=>{R()});l.downloadBtn.addEventListener("click",()=>{Et()});l.canvasToggleHint.addEventListener("click",()=>{U()});l.waveCanvas.addEventListener("click",()=>{U()});l.specCanvas.addEventListener("click",()=>{U()});l.copyJsonBtn.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(l.jsonEditor.value),l.jsonStatus.textContent="JSON copied to clipboard."}catch{l.jsonStatus.textContent="Clipboard copy failed."}});l.applyJsonBtn.addEventListener("click",()=>{try{const t=JSON.parse(l.jsonEditor.value);if(!t||typeof t!="object"||!Array.isArray(t.layers))throw new Error("Invalid spec shape");h(t),l.jsonStatus.textContent="Spec applied."}catch{l.jsonStatus.textContent="Invalid JSON. Expected a Spec object."}});mt();D();
