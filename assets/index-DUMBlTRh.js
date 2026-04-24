(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();const B=(t,e,n="exp")=>({start:t,end:e,curve:n}),T={click:{name:"click",duration:.12,layers:[{type:"triangle",freq:1800,attack:.003,decay:.06,gain:.65,offset:0,filter:{type:"highpass",cutoff:900}},{type:"noise",freq:1200,attack:.002,decay:.03,gain:.2,offset:0,filter:{type:"highpass",cutoff:1500}}]},confirm:{name:"confirm",duration:.24,layers:[{type:"sine",freq:B(640,960,"exp"),attack:.005,decay:.14,gain:.52,offset:0,filter:null},{type:"triangle",freq:1280,attack:.004,decay:.11,gain:.22,offset:.02,filter:{type:"lowpass",cutoff:5200}}]},error:{name:"error",duration:.36,layers:[{type:"saw",freq:B(520,180,"linear"),attack:.004,decay:.2,gain:.62,offset:0,filter:{type:"lowpass",cutoff:2900}},{type:"square",freq:160,attack:.006,decay:.24,gain:.35,offset:.04,filter:{type:"highpass",cutoff:80}}]},notify:{name:"notify",duration:.42,layers:[{type:"sine",freq:B(480,740,"exp"),attack:.007,decay:.18,gain:.46,offset:0,filter:null},{type:"triangle",freq:B(740,990,"linear"),attack:.004,decay:.16,gain:.31,offset:.1,filter:{type:"lowpass",cutoff:6e3}}]}},_=["sine","square","saw","triangle","noise"],V=["linear","exp"],G=["lowpass","highpass"],g=(t,e)=>t+Math.random()*(e-t),j=t=>t[Math.floor(Math.random()*t.length)],X=()=>{if(Math.random()<.45){const o=g(120,2200);return Math.round(o)}const t=g(100,1800),e=g(.4,2.5),n=Math.max(40,t*e);return{start:Math.round(t),end:Math.round(n),curve:j(V)}},Y=()=>Math.random()<.45?null:{type:j(G),cutoff:Math.round(g(120,9e3))},K=()=>({type:j(_),freq:X(),attack:Number(g(.002,.04).toFixed(3)),decay:Number(g(.04,.35).toFixed(3)),gain:Number(g(.15,.9).toFixed(2)),offset:Number(g(0,.14).toFixed(3)),filter:Y()}),Q=()=>{const t=1+Math.floor(Math.random()*3),e=Array.from({length:t},K),n=Math.max(...e.map(o=>o.offset+o.attack+o.decay),.18);return{name:`rand-${Date.now().toString().slice(-4)}`,duration:Number(Math.max(.1,Math.min(1.2,n+g(.02,.18))).toFixed(3)),layers:e}},U=t=>JSON.parse(JSON.stringify(t)),E=44100,I=.002,Z=10**(-20/20),k=(t,e,n)=>Math.min(n,Math.max(e,t)),tt=(t,e)=>{if(t==="sine")return Math.sin(e);if(t==="square")return Math.sin(e)>=0?1:-1;if(t==="saw"){const n=e/(Math.PI*2);return 2*(n-Math.floor(n+.5))}if(t==="triangle"){const n=e/(Math.PI*2);return 2*Math.abs(2*(n-Math.floor(n+.5)))-1}return Math.random()*2-1},q=t=>.5-.5*Math.cos(Math.PI*k(t,0,1)),et=t=>.5+.5*Math.cos(Math.PI*k(t,0,1)),nt=(t,e,n)=>{if(t<0)return 0;const o=Math.max(I,e),s=Math.max(I,n);return t<=o?q(t/o):t<=o+s?et((t-o)/s):0},at=(t,e,n)=>{if(typeof t=="number")return Math.max(1,t);const o=t.curve==="exp"?"exp":"linear",s=k(e/Math.max(n,1e-6),0,1);return o==="linear"||t.start<=0||t.end<=0?Math.max(1,t.start+(t.end-t.start)*s):Math.max(1,t.start*(t.end/t.start)**s)},F=(t,e,n)=>{if(!e)return t;const o=new Float32Array(t.length),s=k(e.cutoff||1e3,20,n*.45),a=1/n,r=1/(2*Math.PI*s);if(e.type==="lowpass"){const p=a/(r+a);let y=0;for(let f=0;f<t.length;f+=1)y=y+p*(t[f]-y),o[f]=y;return o}const d=r/(r+a);let c=0,u=0;for(let p=0;p<t.length;p+=1){const y=t[p];c=d*(c+y-u),u=y,o[p]=c}return o},ot=(t,e,n)=>{const o=new Float32Array(e),s=Math.max(I*2,t.attack+t.decay),a=Math.max(0,Math.floor(t.offset*n));let r=0;for(let u=a;u<e;u+=1){const p=(u-a)/n,y=nt(p,t.attack,t.decay);if(y<=1e-8)continue;const f=at(t.freq,p,s);r+=2*Math.PI*f/n;const M=tt(t.type,r);o[u]=M*y}const d=F(o,t.filter,n),c=Number.isFinite(t.gain)?t.gain:.5;for(let u=0;u<d.length;u+=1)d[u]*=c;return d},st=(t,e)=>{let n=F(t,{type:"highpass",cutoff:20},e);n=F(n,{type:"lowpass",cutoff:1e4},e);let o=0;for(let r=0;r<n.length;r+=1)o+=n[r]*n[r];const s=Math.sqrt(o/Math.max(1,n.length));if(s>1e-9){const r=Z/s;for(let d=0;d<n.length;d+=1)n[d]*=r}for(let r=0;r<n.length;r+=1)n[r]=.95*Math.tanh(n[r]/.95);const a=Math.max(1,Math.floor(I*e));for(let r=0;r<a&&r<n.length;r+=1){const d=r/a;n[r]*=q(d),n[n.length-1-r]*=q(d)}return n},rt=(t,e=E)=>{const n=Math.max(1,Math.floor(t.duration*e)),o=new Float32Array(n);for(const s of t.layers){const a=ot(s,n,e);for(let r=0;r<n;r+=1)o[r]+=a[r]}return st(o,e)},lt=(t,e=E)=>{const n=e*2,o=t.length*2,s=new ArrayBuffer(44+o),a=new DataView(s),r=(c,u)=>{for(let p=0;p<u.length;p+=1)a.setUint8(c+p,u.charCodeAt(p))};r(0,"RIFF"),a.setUint32(4,36+o,!0),r(8,"WAVE"),r(12,"fmt "),a.setUint32(16,16,!0),a.setUint16(20,1,!0),a.setUint16(22,1,!0),a.setUint32(24,e,!0),a.setUint32(28,n,!0),a.setUint16(32,2,!0),a.setUint16(34,16,!0),r(36,"data"),a.setUint32(40,o,!0);let d=44;for(let c=0;c<t.length;c+=1){const u=k(t[c],-1,1),p=u<0?u*32768:u*32767;a.setInt16(d,p,!0),d+=2}return new Blob([s],{type:"audio/wav"})},J="click",it=["sine","square","saw","triangle","noise"],ct=["lowpass","highpass"],i={spec:U(T[J]),selectedPreset:J,previewMode:"wave",rendered:null,audioContext:null,sourceNode:null,isPlaying:!1},dt=document.querySelector("#app");dt.innerHTML=`
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
      <button id="canvasToggleHint" class="inline-hint" type="button">Click canvas to toggle view</button>
      <canvas id="waveCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
      <canvas id="specCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
      <div class="row-buttons json-actions">
        <button id="applyJsonBtn" type="button">Apply JSON</button>
        <button id="copyJsonBtn" type="button">Copy JSON</button>
      </div>
      <textarea id="jsonEditor" spellcheck="false"></textarea>
      <p id="jsonStatus" class="hint"></p>
    </section>
  </main>
`;const l={presetSelect:document.getElementById("presetSelect"),loadPresetBtn:document.getElementById("loadPresetBtn"),randomizeBtn:document.getElementById("randomizeBtn"),nameInput:document.getElementById("nameInput"),durationInput:document.getElementById("durationInput"),durationSlider:document.getElementById("durationSlider"),addLayerBtn:document.getElementById("addLayerBtn"),layersContainer:document.getElementById("layersContainer"),layerCount:document.getElementById("layerCount"),playBtn:document.getElementById("playBtn"),stopBtn:document.getElementById("stopBtn"),downloadBtn:document.getElementById("downloadBtn"),canvasToggleHint:document.getElementById("canvasToggleHint"),waveCanvas:document.getElementById("waveCanvas"),specCanvas:document.getElementById("specCanvas"),applyJsonBtn:document.getElementById("applyJsonBtn"),copyJsonBtn:document.getElementById("copyJsonBtn"),jsonEditor:document.getElementById("jsonEditor"),jsonStatus:document.getElementById("jsonStatus")},w=t=>JSON.parse(JSON.stringify(t)),L=(t,e,n)=>Math.min(n,Math.max(e,t)),ut=()=>({type:"sine",freq:880,attack:.004,decay:.12,gain:.5,offset:0,filter:null}),v=t=>{const e=typeof t=="function"?t(i.spec):t;i.spec=w(e),R()},A=()=>(i.rendered=rt(i.spec,E),i.rendered),m=(t,e=3)=>Number(t).toFixed(e),pt=t=>typeof t=="number"?`${Math.round(t)} Hz`:`${Math.round(t.start)} -> ${Math.round(t.end)} (${t.curve})`,P=(t,e,n)=>{v(o=>{const s=w(o);return s.layers[t][e]=n,s})},ft=()=>{l.presetSelect.innerHTML=Object.keys(T).map(t=>`<option value="${t}">${t}</option>`).join(""),l.presetSelect.value=i.selectedPreset},yt=(t,e)=>{const n=document.createElement("article");n.className="layer-card";const o=typeof t.freq=="object",s=t.filter!==null;return n.innerHTML=`
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
          ${it.map(a=>`<option value="${a}" ${a===t.type?"selected":""}>${a}</option>`).join("")}
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
      <label class="meta-pill">${pt(t.freq)}</label>
      `}

      <label>Filter
        <select data-key="filterEnabled" data-layer="${e}">
          <option value="off" ${s?"":"selected"}>off</option>
          <option value="on" ${s?"selected":""}>on</option>
        </select>
      </label>

      ${s?`
      <label>Filter type
        <select data-key="filterType" data-layer="${e}">
          ${ct.map(a=>`<option value="${a}" ${t.filter.type===a?"selected":""}>${a}</option>`).join("")}
        </select>
      </label>
      <label>Cutoff (Hz)
        <input data-key="filterCutoff" data-layer="${e}" type="number" min="20" max="20000" step="1" value="${m(t.filter.cutoff,0)}" />
      </label>
      `:""}
    </div>
  `,n},mt=t=>{const e=l.waveCanvas.getContext("2d"),n=l.waveCanvas.width,o=l.waveCanvas.height;e.fillStyle="#11131b",e.fillRect(0,0,n,o),e.strokeStyle="#2f354a",e.lineWidth=1,e.beginPath(),e.moveTo(0,o/2),e.lineTo(n,o/2),e.stroke(),e.strokeStyle="#fef08a",e.lineWidth=2,e.beginPath();for(let s=0;s<n;s+=1){const a=Math.floor(s/(n-1)*(t.length-1)),r=o*.5-t[a]*(o*.44);s===0?e.moveTo(s,r):e.lineTo(s,r)}e.stroke()},vt=(t,e)=>.5-.5*Math.cos(2*Math.PI*t/(e-1)),ht=(t,e)=>{const n=t.length,o=Math.log2(n);if(Math.floor(o)!==o)throw new Error("FFT size must be power of 2");for(let s=0;s<n;s+=1){let a=0;for(let r=0;r<o;r+=1)a=a<<1|s>>>r&1;a>s&&([t[s],t[a]]=[t[a],t[s]],[e[s],e[a]]=[e[a],e[s]])}for(let s=2;s<=n;s<<=1){const a=s>>1,r=2*Math.PI/s;for(let d=0;d<n;d+=s)for(let c=d;c<d+a;c+=1){const p=-(c-d)*r,y=Math.cos(p),f=Math.sin(p),M=y*t[c+a]-f*e[c+a],b=y*e[c+a]+f*t[c+a];t[c+a]=t[c]-M,e[c+a]=e[c]-b,t[c]+=M,e[c]+=b}}},bt=t=>{const e=[[0,0,4],[27,18,84],[80,18,123],[129,37,129],[181,54,122],[229,80,100],[251,135,97],[254,194,135],[252,253,191]],n=L(t,0,1)*(e.length-1),o=Math.floor(n),s=n-o,a=e[o],r=e[Math.min(e.length-1,o+1)];return[Math.round(a[0]+(r[0]-a[0])*s),Math.round(a[1]+(r[1]-a[1])*s),Math.round(a[2]+(r[2]-a[2])*s)]},gt=t=>{const e=l.specCanvas,n=e.getContext("2d"),o=e.width,s=e.height;n.fillStyle="#0f0f13",n.fillRect(0,0,o,s);const a=1024,r=256,d=a/2,c=Math.max(1,Math.floor((t.length-a)/r)+1),u=n.createImageData(o,s),p=[];let y=-120;for(let f=0;f<c;f+=1){const M=f*r,b=new Float32Array(a),x=new Float32Array(a);for(let h=0;h<a;h+=1)b[h]=(t[M+h]||0)*vt(h,a);ht(b,x);const C=new Float32Array(d);for(let h=0;h<d;h+=1){const N=Math.sqrt(b[h]**2+x[h]**2),S=20*Math.log10(N+1e-9);C[h]=S,S>y&&(y=S)}p.push(C)}for(let f=0;f<o;f+=1){const M=Math.min(c-1,Math.floor(f/(o-1)*(c-1))),b=p[M];for(let x=0;x<s;x+=1){const C=Math.floor((s-1-x)/(s-1)*(d-1)),h=(b==null?void 0:b[C])??-120,N=L((h-(y-80))/80,0,1),[S,W,D]=bt(N),$=(x*o+f)*4;u.data[$]=S,u.data[$+1]=W,u.data[$+2]=D,u.data[$+3]=255}}n.putImageData(u,0,0)},H=()=>{i.sourceNode&&(i.sourceNode.stop(),i.sourceNode.disconnect(),i.sourceNode=null),i.isPlaying=!1},wt=async()=>{const t=A();i.audioContext||(i.audioContext=new AudioContext({sampleRate:E})),i.audioContext.state==="suspended"&&await i.audioContext.resume(),H();const e=i.audioContext.createBuffer(1,t.length,E);e.copyToChannel(t,0,0);const n=i.audioContext.createBufferSource();n.buffer=e,n.connect(i.audioContext.destination),n.onended=()=>{i.sourceNode===n&&(i.sourceNode=null,i.isPlaying=!1)},n.start(),i.sourceNode=n,i.isPlaying=!0},Mt=()=>{const t=A(),e=lt(t,E),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=`${i.spec.name||"sfx"}.wav`,o.click(),URL.revokeObjectURL(n)},xt=()=>{l.layersContainer.innerHTML="",i.spec.layers.forEach((t,e)=>{l.layersContainer.appendChild(yt(t,e))})},z=t=>{i.previewMode=t;const e=t==="wave";l.waveCanvas.style.display=e?"block":"none",l.specCanvas.style.display=e?"none":"block"},O=()=>{z(i.previewMode==="wave"?"spec":"wave")},R=()=>{l.nameInput.value=i.spec.name,l.durationInput.value=m(i.spec.duration,3),l.durationSlider.value=m(i.spec.duration,3),l.layerCount.textContent=`${i.spec.layers.length} layer${i.spec.layers.length===1?"":"s"}`,xt();const t=A();mt(t),gt(t),z(i.previewMode),l.jsonEditor.value=JSON.stringify(i.spec,null,2),l.jsonStatus.textContent=""};l.loadPresetBtn.addEventListener("click",()=>{const t=l.presetSelect.value;i.selectedPreset=t,v(U(T[t]))});l.randomizeBtn.addEventListener("click",()=>{v(Q())});l.nameInput.addEventListener("input",t=>{v(e=>({...e,name:t.target.value}))});l.durationInput.addEventListener("input",t=>{const e=L(Number(t.target.value)||.1,.03,2.5);v(n=>({...n,duration:Number(e.toFixed(3))}))});l.durationSlider.addEventListener("input",t=>{const e=L(Number(t.target.value)||.1,.03,2.5);v(n=>({...n,duration:Number(e.toFixed(3))}))});l.addLayerBtn.addEventListener("click",()=>{v(t=>({...t,layers:[...t.layers,ut()]}))});l.layersContainer.addEventListener("click",t=>{const e=t.target;if(!(e instanceof HTMLButtonElement))return;const n=Number(e.dataset.layer);Number.isInteger(n)&&(e.dataset.action==="remove"&&v(o=>{if(o.layers.length===1)return o;const s=w(o);return s.layers.splice(n,1),s}),e.dataset.action==="duplicate"&&v(o=>{const s=w(o);return s.layers.splice(n+1,0,w(s.layers[n])),s}))});l.layersContainer.addEventListener("input",t=>{const e=t.target;if(!(e instanceof HTMLInputElement||e instanceof HTMLSelectElement))return;const n=Number(e.dataset.layer),o=e.dataset.key;if(!(!Number.isInteger(n)||!o)){if(o==="type"){P(n,"type",e.value);return}if(o==="gain"||o==="attack"||o==="decay"||o==="offset"){P(n,o,Number(e.value));return}if(o==="freq"){P(n,"freq",Number(e.value));return}if(o==="freqMode"){v(s=>{const a=w(s);return a.layers[n].freq=e.value==="sweep"?{start:440,end:880,curve:"exp"}:Number(typeof a.layers[n].freq=="number"?a.layers[n].freq:a.layers[n].freq.start),a});return}if(o==="freqStart"||o==="freqEnd"||o==="freqCurve"){v(s=>{const a=w(s),r=typeof a.layers[n].freq=="object"?a.layers[n].freq:{start:440,end:880,curve:"exp"};return o==="freqStart"&&(r.start=Number(e.value)),o==="freqEnd"&&(r.end=Number(e.value)),o==="freqCurve"&&(r.curve=e.value),a.layers[n].freq=r,a});return}if(o==="filterEnabled"){v(s=>{const a=w(s);return a.layers[n].filter=e.value==="on"?{type:"lowpass",cutoff:2600}:null,a});return}(o==="filterType"||o==="filterCutoff")&&v(s=>{const a=w(s);return a.layers[n].filter||(a.layers[n].filter={type:"lowpass",cutoff:2600}),o==="filterType"&&(a.layers[n].filter.type=e.value),o==="filterCutoff"&&(a.layers[n].filter.cutoff=Number(e.value)),a})}});l.playBtn.addEventListener("click",()=>{wt()});l.stopBtn.addEventListener("click",()=>{H()});l.downloadBtn.addEventListener("click",()=>{Mt()});l.canvasToggleHint.addEventListener("click",()=>{O()});l.waveCanvas.addEventListener("click",()=>{O()});l.specCanvas.addEventListener("click",()=>{O()});l.copyJsonBtn.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(l.jsonEditor.value),l.jsonStatus.textContent="JSON copied to clipboard."}catch{l.jsonStatus.textContent="Clipboard copy failed."}});l.applyJsonBtn.addEventListener("click",()=>{try{const t=JSON.parse(l.jsonEditor.value);if(!t||typeof t!="object"||!Array.isArray(t.layers))throw new Error("Invalid spec shape");v(t),l.jsonStatus.textContent="Spec applied."}catch{l.jsonStatus.textContent="Invalid JSON. Expected a Spec object."}});ft();R();
