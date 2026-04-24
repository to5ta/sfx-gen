(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const I=(e,t,n="exp")=>({start:e,end:t,curve:n}),D={click:{name:"click",duration:.12,layers:[{type:"triangle",freq:1800,attack:.003,decay:.06,gain:.65,offset:0,filter:{type:"highpass",cutoff:900}},{type:"noise",freq:1200,attack:.002,decay:.03,gain:.2,offset:0,filter:{type:"highpass",cutoff:1500}}]},confirm:{name:"confirm",duration:.24,layers:[{type:"sine",freq:I(640,960,"exp"),attack:.005,decay:.14,gain:.52,offset:0,filter:null},{type:"triangle",freq:1280,attack:.004,decay:.11,gain:.22,offset:.02,filter:{type:"lowpass",cutoff:5200}}]},error:{name:"error",duration:.36,layers:[{type:"saw",freq:I(520,180,"linear"),attack:.004,decay:.2,gain:.62,offset:0,filter:{type:"lowpass",cutoff:2900}},{type:"square",freq:160,attack:.006,decay:.24,gain:.35,offset:.04,filter:{type:"highpass",cutoff:80}}]},notify:{name:"notify",duration:.42,layers:[{type:"sine",freq:I(480,740,"exp"),attack:.007,decay:.18,gain:.46,offset:0,filter:null},{type:"triangle",freq:I(740,990,"linear"),attack:.004,decay:.16,gain:.31,offset:.1,filter:{type:"lowpass",cutoff:6e3}}]}},ne=["sine","square","saw","triangle","noise"],ae=["linear","exp"],oe=["lowpass","highpass"],w=(e,t)=>e+Math.random()*(t-e),R=e=>e[Math.floor(Math.random()*e.length)],se=()=>{if(Math.random()<.45){const a=w(120,2200);return Math.round(a)}const e=w(100,1800),t=w(.4,2.5),n=Math.max(40,e*t);return{start:Math.round(e),end:Math.round(n),curve:R(ae)}},re=()=>Math.random()<.45?null:{type:R(oe),cutoff:Math.round(w(120,9e3))},le=()=>({type:R(ne),freq:se(),attack:Number(w(.002,.04).toFixed(3)),decay:Number(w(.04,.35).toFixed(3)),gain:Number(w(.15,.9).toFixed(2)),offset:Number(w(0,.14).toFixed(3)),filter:re()}),ie=()=>{const e=1+Math.floor(Math.random()*3),t=Array.from({length:e},le),n=Math.max(...t.map(a=>a.offset+a.attack+a.decay),.18);return{name:`rand-${Date.now().toString().slice(-4)}`,duration:Number(Math.max(.1,Math.min(1.2,n+w(.02,.18))).toFixed(3)),layers:t}},W=e=>JSON.parse(JSON.stringify(e)),x=44100,N=.002,ce=10**(-20/20),$=(e,t,n)=>Math.min(n,Math.max(t,e)),de=(e,t)=>{if(e==="sine")return Math.sin(t);if(e==="square")return Math.sin(t)>=0?1:-1;if(e==="saw"){const n=t/(Math.PI*2);return 2*(n-Math.floor(n+.5))}if(e==="triangle"){const n=t/(Math.PI*2);return 2*Math.abs(2*(n-Math.floor(n+.5)))-1}return Math.random()*2-1},F=e=>.5-.5*Math.cos(Math.PI*$(e,0,1)),ue=e=>.5+.5*Math.cos(Math.PI*$(e,0,1)),pe=(e,t,n)=>{if(e<0)return 0;const a=Math.max(N,t),s=Math.max(N,n);return e<=a?F(e/a):e<=a+s?ue((e-a)/s):0},fe=(e,t,n)=>{if(typeof e=="number")return Math.max(1,e);const a=e.curve==="exp"?"exp":"linear",s=$(t/Math.max(n,1e-6),0,1);return a==="linear"||e.start<=0||e.end<=0?Math.max(1,e.start+(e.end-e.start)*s):Math.max(1,e.start*(e.end/e.start)**s)},O=(e,t,n)=>{if(!t)return e;const a=new Float32Array(e.length),s=$(t.cutoff||1e3,20,n*.45),o=1/n,l=1/(2*Math.PI*s);if(t.type==="lowpass"){const p=o/(l+o);let y=0;for(let f=0;f<e.length;f+=1)y=y+p*(e[f]-y),a[f]=y;return a}const d=l/(l+o);let c=0,u=0;for(let p=0;p<e.length;p+=1){const y=e[p];c=d*(c+y-u),u=y,a[p]=c}return a},ye=(e,t,n)=>{const a=new Float32Array(t),s=Math.max(N*2,e.attack+e.decay),o=Math.max(0,Math.floor(e.offset*n));let l=0;for(let u=o;u<t;u+=1){const p=(u-o)/n,y=pe(p,e.attack,e.decay);if(y<=1e-8)continue;const f=fe(e.freq,p,s);l+=2*Math.PI*f/n;const M=de(e.type,l);a[u]=M*y}const d=O(a,e.filter,n),c=Number.isFinite(e.gain)?e.gain:.5;for(let u=0;u<d.length;u+=1)d[u]*=c;return d},me=(e,t)=>{let n=O(e,{type:"highpass",cutoff:20},t);n=O(n,{type:"lowpass",cutoff:1e4},t);let a=0;for(let l=0;l<n.length;l+=1)a+=n[l]*n[l];const s=Math.sqrt(a/Math.max(1,n.length));if(s>1e-9){const l=ce/s;for(let d=0;d<n.length;d+=1)n[d]*=l}for(let l=0;l<n.length;l+=1)n[l]=.95*Math.tanh(n[l]/.95);const o=Math.max(1,Math.floor(N*t));for(let l=0;l<o&&l<n.length;l+=1){const d=l/o;n[l]*=F(d),n[n.length-1-l]*=F(d)}return n},ve=(e,t=x)=>{const n=Math.max(1,Math.floor(e.duration*t)),a=new Float32Array(n);for(const s of e.layers){const o=ye(s,n,t);for(let l=0;l<n;l+=1)a[l]+=o[l]}return me(a,t)},ge=(e,t=x)=>{const n=t*2,a=e.length*2,s=new ArrayBuffer(44+a),o=new DataView(s),l=(c,u)=>{for(let p=0;p<u.length;p+=1)o.setUint8(c+p,u.charCodeAt(p))};l(0,"RIFF"),o.setUint32(4,36+a,!0),l(8,"WAVE"),l(12,"fmt "),o.setUint32(16,16,!0),o.setUint16(20,1,!0),o.setUint16(22,1,!0),o.setUint32(24,t,!0),o.setUint32(28,n,!0),o.setUint16(32,2,!0),o.setUint16(34,16,!0),l(36,"data"),o.setUint32(40,a,!0);let d=44;for(let c=0;c<e.length;c+=1){const u=$(e[c],-1,1),p=u<0?u*32768:u*32767;o.setInt16(d,p,!0),d+=2}return new Blob([s],{type:"audio/wav"})},q="click",_="1.0.0",V="ux-sfx-custom-presets-v1",U=["en","de","fr","it","es"],he=["sine","square","saw","triangle","noise"],be=["lowpass","highpass"],h=e=>JSON.parse(JSON.stringify(e)),P=()=>`sfx-${Math.random().toString(36).slice(2,6)}`,T=e=>`builtin:${e}`,G=e=>`custom:${e}`,we=()=>{try{const e=localStorage.getItem(V);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}},Me=()=>{var t;const e=(t=window.location.pathname.split("/").filter(Boolean)[0])==null?void 0:t.toLowerCase();return U.includes(e)?e:null},Se=()=>{var t;const e=(t=new URLSearchParams(window.location.search).get("lang"))==null?void 0:t.toLowerCase();return U.includes(e)?e:null},xe=()=>{const e=(navigator.language||"en").slice(0,2).toLowerCase();return U.includes(e)?e:"en"},Ee=()=>Me()||Se()||xe(),Y=e=>{localStorage.setItem(V,JSON.stringify(e))},X=(e,t=null)=>{const n=h(e),a=typeof n.createdAt=="string"&&n.createdAt||t&&typeof t.createdAt=="string"&&t.createdAt||new Date().toISOString();return{...n,name:typeof n.name=="string"&&n.name.trim()?n.name:P(),duration:Number.isFinite(n.duration)?n.duration:.2,layers:Array.isArray(n.layers)?n.layers:[],createdAt:a,version:_}},r={spec:X(W(D[q])),selectedPreset:T(q),customPresets:we(),lang:Ee(),previewMode:"wave",activeLayerDot:0,rendered:null,audioContext:null,sourceNode:null,isPlaying:!1},Ce=document.querySelector("#app");document.documentElement.lang=r.lang;Ce.innerHTML=`
  <main class="shell">
    <section class="panel panel-sidebar">
      <h1>UX SFX Generator</h1>
      <p class="tagline">Browser additive synth for UI sonification</p>
      <p class="app-version">v${_}</p>
      <div class="settings-compact">
      <div class="preset-row">
        <select id="presetSelect" class="compact-select" aria-label="Preset"></select>
        <button id="loadPresetBtn" type="button">Load</button>
        <button id="savePresetBtn" type="button">Save</button>
        <button id="removePresetBtn" type="button">Remove</button>
        <button id="randomizeBtn" type="button" title="Randomize">&#x1F3B2;</button>
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
      <div class="preview-stack">
        <canvas id="waveCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
        <canvas id="specCanvas" class="preview-canvas" width="760" height="200" title="Click to switch view"></canvas>
        <button id="playToggleBtn" class="inline-hint inline-play overlay-mini" type="button" title="Play/Stop">&#9654;</button>
        <button id="canvasToggleHint" class="inline-hint" type="button">toggle view</button>
        <button id="downloadInlineBtn" class="inline-hint inline-download overlay-mini" type="button" title="Download WAV">&#9729;&#8595;</button>
      </div>
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
`;const i={presetSelect:document.getElementById("presetSelect"),loadPresetBtn:document.getElementById("loadPresetBtn"),savePresetBtn:document.getElementById("savePresetBtn"),removePresetBtn:document.getElementById("removePresetBtn"),randomizeBtn:document.getElementById("randomizeBtn"),durationInput:document.getElementById("durationInput"),durationSlider:document.getElementById("durationSlider"),addLayerBtn:document.getElementById("addLayerBtn"),layersContainer:document.getElementById("layersContainer"),layerDots:document.getElementById("layerDots"),layerCount:document.getElementById("layerCount"),playToggleBtn:document.getElementById("playToggleBtn"),downloadInlineBtn:document.getElementById("downloadInlineBtn"),canvasToggleHint:document.getElementById("canvasToggleHint"),waveCanvas:document.getElementById("waveCanvas"),specCanvas:document.getElementById("specCanvas"),applyJsonBtn:document.getElementById("applyJsonBtn"),copyJsonBtn:document.getElementById("copyJsonBtn"),jsonEditor:document.getElementById("jsonEditor"),jsonStatus:document.getElementById("jsonStatus")},C=(e,t,n)=>Math.min(n,Math.max(t,e)),Le=()=>({type:"sine",freq:880,attack:.004,decay:.12,gain:.5,offset:0,filter:null}),v=e=>{const t=typeof e=="function"?e(r.spec):e;r.spec=X(t,r.spec),Z()},J=()=>(r.rendered=ve(r.spec,x),r.rendered),m=(e,t=3)=>Number(e).toFixed(t),Pe=e=>typeof e=="number"?`${Math.round(e)} Hz`:`${Math.round(e.start)} -> ${Math.round(e.end)} (${e.curve})`,j=(e,t,n)=>{v(a=>{const s=h(a);return s.layers[e][t]=n,s})},E=()=>{const e=Object.keys(D).map(a=>`<option value="${T(a)}">${a}</option>`).join(""),n=Object.keys(r.customPresets).sort().map(a=>`<option value="${G(a)}">${a}</option>`).join("");i.presetSelect.innerHTML=`
    <optgroup label="Built-in">${e}</optgroup>
    ${n?`<optgroup label="Custom">${n}</optgroup>`:""}
  `,i.presetSelect.value=r.selectedPreset,i.presetSelect.classList.toggle("builtin-selected",r.selectedPreset.startsWith("builtin:"))},$e=(e,t)=>{const n=document.createElement("article");n.className="layer-card";const a=typeof e.freq=="object",s=e.filter!==null;return n.innerHTML=`
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
          ${he.map(o=>`<option value="${o}" ${o===e.type?"selected":""}>${o}</option>`).join("")}
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
          <option value="fixed" ${a?"":"selected"}>fixed</option>
          <option value="sweep" ${a?"selected":""}>sweep</option>
        </select>
      </label>

      ${a?`
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
      <label class="meta-pill">${Pe(e.freq)}</label>
      `}

      <label>Filter
        <select data-key="filterEnabled" data-layer="${t}">
          <option value="off" ${s?"":"selected"}>off</option>
          <option value="on" ${s?"selected":""}>on</option>
        </select>
      </label>

      ${s?`
      <label>Filter type
        <select data-key="filterType" data-layer="${t}">
          ${be.map(o=>`<option value="${o}" ${e.filter.type===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </label>
      <label>Cutoff (Hz)
        <input data-key="filterCutoff" data-layer="${t}" type="number" min="20" max="20000" step="1" value="${m(e.filter.cutoff,0)}" />
      </label>
      `:""}
    </div>
  `,n},Be=e=>{const t=i.waveCanvas.getContext("2d"),n=i.waveCanvas.width,a=i.waveCanvas.height;t.fillStyle="#11131b",t.fillRect(0,0,n,a),t.strokeStyle="#2f354a",t.lineWidth=1,t.beginPath(),t.moveTo(0,a/2),t.lineTo(n,a/2),t.stroke(),t.strokeStyle="#fef08a",t.lineWidth=2,t.beginPath();for(let s=0;s<n;s+=1){const o=Math.floor(s/(n-1)*(e.length-1)),l=a*.5-e[o]*(a*.44);s===0?t.moveTo(s,l):t.lineTo(s,l)}t.stroke()},ke=(e,t)=>.5-.5*Math.cos(2*Math.PI*e/(t-1)),Ie=(e,t)=>{const n=e.length,a=Math.log2(n);if(Math.floor(a)!==a)throw new Error("FFT size must be power of 2");for(let s=0;s<n;s+=1){let o=0;for(let l=0;l<a;l+=1)o=o<<1|s>>>l&1;o>s&&([e[s],e[o]]=[e[o],e[s]],[t[s],t[o]]=[t[o],t[s]])}for(let s=2;s<=n;s<<=1){const o=s>>1,l=2*Math.PI/s;for(let d=0;d<n;d+=s)for(let c=d;c<d+o;c+=1){const p=-(c-d)*l,y=Math.cos(p),f=Math.sin(p),M=y*e[c+o]-f*t[c+o],b=y*t[c+o]+f*e[c+o];e[c+o]=e[c]-M,t[c+o]=t[c]-b,e[c]+=M,t[c]+=b}}},Ne=e=>{const t=[[0,0,4],[27,18,84],[80,18,123],[129,37,129],[181,54,122],[229,80,100],[251,135,97],[254,194,135],[252,253,191]],n=C(e,0,1)*(t.length-1),a=Math.floor(n),s=n-a,o=t[a],l=t[Math.min(t.length-1,a+1)];return[Math.round(o[0]+(l[0]-o[0])*s),Math.round(o[1]+(l[1]-o[1])*s),Math.round(o[2]+(l[2]-o[2])*s)]},qe=e=>{const t=i.specCanvas,n=t.getContext("2d"),a=t.width,s=t.height;n.fillStyle="#0f0f13",n.fillRect(0,0,a,s);const o=1024,l=256,d=o/2,c=Math.max(1,Math.floor((e.length-o)/l)+1),u=n.createImageData(a,s),p=[];let y=-120;for(let f=0;f<c;f+=1){const M=f*l,b=new Float32Array(o),S=new Float32Array(o);for(let g=0;g<o;g+=1)b[g]=(e[M+g]||0)*ke(g,o);Ie(b,S);const B=new Float32Array(d);for(let g=0;g<d;g+=1){const A=Math.sqrt(b[g]**2+S[g]**2),L=20*Math.log10(A+1e-9);B[g]=L,L>y&&(y=L)}p.push(B)}for(let f=0;f<a;f+=1){const M=Math.min(c-1,Math.floor(f/(a-1)*(c-1))),b=p[M];for(let S=0;S<s;S+=1){const B=Math.floor((s-1-S)/(s-1)*(d-1)),g=(b==null?void 0:b[B])??-120,A=C((g-(y-80))/80,0,1),[L,ee,te]=Ne(A),k=(S*a+f)*4;u.data[k]=L,u.data[k+1]=ee,u.data[k+2]=te,u.data[k+3]=255}}n.putImageData(u,0,0)},K=()=>{r.sourceNode&&(r.sourceNode.stop(),r.sourceNode.disconnect(),r.sourceNode=null),r.isPlaying=!1,i.playToggleBtn.textContent="▶"},Te=async()=>{const e=J();r.audioContext||(r.audioContext=new AudioContext({sampleRate:x})),r.audioContext.state==="suspended"&&await r.audioContext.resume(),K();const t=r.audioContext.createBuffer(1,e.length,x);t.copyToChannel(e,0,0);const n=r.audioContext.createBufferSource();n.buffer=t,n.connect(r.audioContext.destination),n.onended=()=>{r.sourceNode===n&&(r.sourceNode=null,r.isPlaying=!1,i.playToggleBtn.textContent="▶")},n.start(),r.sourceNode=n,r.isPlaying=!0,i.playToggleBtn.textContent="■"},Ae=()=>{const e=J(),t=ge(e,x),n=URL.createObjectURL(t),a=document.createElement("a");a.href=n,a.download=`${(r.spec.name||P()).trim()||P()}.wav`,a.click(),URL.revokeObjectURL(n)},je=()=>{i.layersContainer.innerHTML="",r.spec.layers.forEach((e,t)=>{i.layersContainer.appendChild($e(e,t))})},H=()=>{i.layerDots.innerHTML=r.spec.layers.map((e,t)=>`<button type="button" data-dot="${t}" class="${t===r.activeLayerDot?"active":""}" aria-label="Layer ${t+1}"></button>`).join("")},Fe=()=>{const e=i.layersContainer.querySelector(".layer-card");if(!e)return;const t=e.getBoundingClientRect().width+10,n=Math.round(i.layersContainer.scrollLeft/Math.max(1,t)),a=C(n,0,Math.max(0,r.spec.layers.length-1));a!==r.activeLayerDot&&(r.activeLayerDot=a,H())},Q=e=>{r.previewMode=e;const t=e==="wave";i.waveCanvas.style.display=t?"block":"none",i.specCanvas.style.display=t?"none":"block"},z=()=>{Q(r.previewMode==="wave"?"spec":"wave")},Z=()=>{i.durationInput.value=m(r.spec.duration,3),i.durationSlider.value=m(r.spec.duration,3),i.playToggleBtn.textContent=r.isPlaying?"■":"▶",i.layerCount.textContent=`${r.spec.layers.length} layer${r.spec.layers.length===1?"":"s"}`,je(),r.activeLayerDot=C(r.activeLayerDot,0,Math.max(0,r.spec.layers.length-1)),H();const e=J();Be(e),qe(e),Q(r.previewMode),i.jsonEditor.value=JSON.stringify(r.spec,null,2),i.jsonStatus.textContent=""};i.loadPresetBtn.addEventListener("click",()=>{const e=i.presetSelect.value;if(r.selectedPreset=e,e.startsWith("builtin:")){const a=e.replace("builtin:","");v(W(D[a])),E();return}const t=e.replace("custom:",""),n=r.customPresets[t];n&&(v(h(n)),E())});i.savePresetBtn.addEventListener("click",()=>{const e=(r.spec.name||P()).trim()||P();r.spec.name=e,r.customPresets[e]=h(r.spec),Y(r.customPresets),r.selectedPreset=G(e),i.jsonStatus.textContent=`Saved preset: ${e}`,E()});i.removePresetBtn.addEventListener("click",()=>{if(!r.selectedPreset.startsWith("custom:")){i.jsonStatus.textContent="Built-in presets cannot be removed.";return}const e=r.selectedPreset.replace("custom:","");delete r.customPresets[e],Y(r.customPresets),r.selectedPreset=T(q),i.presetSelect.value=r.selectedPreset,i.jsonStatus.textContent=`Removed preset: ${e}`,E()});i.presetSelect.addEventListener("change",e=>{r.selectedPreset=e.target.value,i.presetSelect.classList.toggle("builtin-selected",r.selectedPreset.startsWith("builtin:"))});i.randomizeBtn.addEventListener("click",()=>{v(ie()),r.selectedPreset=T(q),E()});i.durationInput.addEventListener("input",e=>{const t=C(Number(e.target.value)||.1,.03,2.5);v(n=>({...n,duration:Number(t.toFixed(3))}))});i.durationSlider.addEventListener("input",e=>{const t=C(Number(e.target.value)||.1,.03,2.5);v(n=>({...n,duration:Number(t.toFixed(3))}))});i.addLayerBtn.addEventListener("click",()=>{v(e=>({...e,layers:[...e.layers,Le()]}))});i.layersContainer.addEventListener("scroll",()=>{Fe()});i.layerDots.addEventListener("click",e=>{const t=e.target;if(!(t instanceof HTMLButtonElement))return;const n=Number(t.dataset.dot);if(!Number.isInteger(n))return;const a=i.layersContainer.querySelector(".layer-card");if(!a)return;const s=a.getBoundingClientRect().width+10;i.layersContainer.scrollTo({left:n*s,behavior:"smooth"}),r.activeLayerDot=n,H()});i.layersContainer.addEventListener("click",e=>{const t=e.target;if(!(t instanceof HTMLButtonElement))return;const n=Number(t.dataset.layer);Number.isInteger(n)&&(t.dataset.action==="remove"&&v(a=>{if(a.layers.length===1)return a;const s=h(a);return s.layers.splice(n,1),s}),t.dataset.action==="duplicate"&&v(a=>{const s=h(a);return s.layers.splice(n+1,0,h(s.layers[n])),s}))});i.layersContainer.addEventListener("input",e=>{const t=e.target;if(!(t instanceof HTMLInputElement||t instanceof HTMLSelectElement))return;const n=Number(t.dataset.layer),a=t.dataset.key;if(!(!Number.isInteger(n)||!a)){if(a==="type"){j(n,"type",t.value);return}if(a==="gain"||a==="attack"||a==="decay"||a==="offset"){j(n,a,Number(t.value));return}if(a==="freq"){j(n,"freq",Number(t.value));return}if(a==="freqMode"){v(s=>{const o=h(s);return o.layers[n].freq=t.value==="sweep"?{start:440,end:880,curve:"exp"}:Number(typeof o.layers[n].freq=="number"?o.layers[n].freq:o.layers[n].freq.start),o});return}if(a==="freqStart"||a==="freqEnd"||a==="freqCurve"){v(s=>{const o=h(s),l=typeof o.layers[n].freq=="object"?o.layers[n].freq:{start:440,end:880,curve:"exp"};return a==="freqStart"&&(l.start=Number(t.value)),a==="freqEnd"&&(l.end=Number(t.value)),a==="freqCurve"&&(l.curve=t.value),o.layers[n].freq=l,o});return}if(a==="filterEnabled"){v(s=>{const o=h(s);return o.layers[n].filter=t.value==="on"?{type:"lowpass",cutoff:2600}:null,o});return}(a==="filterType"||a==="filterCutoff")&&v(s=>{const o=h(s);return o.layers[n].filter||(o.layers[n].filter={type:"lowpass",cutoff:2600}),a==="filterType"&&(o.layers[n].filter.type=t.value),a==="filterCutoff"&&(o.layers[n].filter.cutoff=Number(t.value)),o})}});i.playToggleBtn.addEventListener("click",()=>{if(r.isPlaying){K();return}Te()});i.downloadInlineBtn.addEventListener("click",()=>{Ae()});i.canvasToggleHint.addEventListener("click",()=>{z()});i.waveCanvas.addEventListener("click",()=>{z()});i.specCanvas.addEventListener("click",()=>{z()});i.copyJsonBtn.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(i.jsonEditor.value),i.jsonStatus.textContent="JSON copied to clipboard."}catch{i.jsonStatus.textContent="Clipboard copy failed."}});i.applyJsonBtn.addEventListener("click",()=>{try{const e=JSON.parse(i.jsonEditor.value);if(!e||typeof e!="object"||!Array.isArray(e.layers))throw new Error("Invalid spec shape");v(e),i.jsonStatus.textContent="Spec applied."}catch{i.jsonStatus.textContent="Invalid JSON. Expected a Spec object."}});E();Z();
