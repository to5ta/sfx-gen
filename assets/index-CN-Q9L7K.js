(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const I=(t,e,n="exp")=>({start:t,end:e,curve:n}),D={click:{name:"click",duration:.12,layers:[{type:"triangle",freq:1800,attack:.003,decay:.06,gain:.65,offset:0,filter:{type:"highpass",cutoff:900}},{type:"noise",freq:1200,attack:.002,decay:.03,gain:.2,offset:0,filter:{type:"highpass",cutoff:1500}}]},confirm:{name:"confirm",duration:.24,layers:[{type:"sine",freq:I(640,960,"exp"),attack:.005,decay:.14,gain:.52,offset:0,filter:null},{type:"triangle",freq:1280,attack:.004,decay:.11,gain:.22,offset:.02,filter:{type:"lowpass",cutoff:5200}}]},error:{name:"error",duration:.36,layers:[{type:"saw",freq:I(520,180,"linear"),attack:.004,decay:.2,gain:.62,offset:0,filter:{type:"lowpass",cutoff:2900}},{type:"square",freq:160,attack:.006,decay:.24,gain:.35,offset:.04,filter:{type:"highpass",cutoff:80}}]},notify:{name:"notify",duration:.42,layers:[{type:"sine",freq:I(480,740,"exp"),attack:.007,decay:.18,gain:.46,offset:0,filter:null},{type:"triangle",freq:I(740,990,"linear"),attack:.004,decay:.16,gain:.31,offset:.1,filter:{type:"lowpass",cutoff:6e3}}]}},et=["sine","square","saw","triangle","noise"],nt=["linear","exp"],at=["lowpass","highpass"],w=(t,e)=>t+Math.random()*(e-t),J=t=>t[Math.floor(Math.random()*t.length)],ot=()=>{if(Math.random()<.45){const a=w(120,2200);return Math.round(a)}const t=w(100,1800),e=w(.4,2.5),n=Math.max(40,t*e);return{start:Math.round(t),end:Math.round(n),curve:J(nt)}},st=()=>Math.random()<.45?null:{type:J(at),cutoff:Math.round(w(120,9e3))},rt=()=>({type:J(et),freq:ot(),attack:Number(w(.002,.04).toFixed(3)),decay:Number(w(.04,.35).toFixed(3)),gain:Number(w(.15,.9).toFixed(2)),offset:Number(w(0,.14).toFixed(3)),filter:st()}),it=()=>{const t=1+Math.floor(Math.random()*3),e=Array.from({length:t},rt),n=Math.max(...e.map(a=>a.offset+a.attack+a.decay),.18);return{name:`rand-${Date.now().toString().slice(-4)}`,duration:Number(Math.max(.1,Math.min(1.2,n+w(.02,.18))).toFixed(3)),layers:e}},z=t=>JSON.parse(JSON.stringify(t)),x=44100,N=.002,lt=10**(-20/20),B=(t,e,n)=>Math.min(n,Math.max(e,t)),ct=(t,e)=>{if(t==="sine")return Math.sin(e);if(t==="square")return Math.sin(e)>=0?1:-1;if(t==="saw"){const n=e/(Math.PI*2);return 2*(n-Math.floor(n+.5))}if(t==="triangle"){const n=e/(Math.PI*2);return 2*Math.abs(2*(n-Math.floor(n+.5)))-1}return Math.random()*2-1},F=t=>.5-.5*Math.cos(Math.PI*B(t,0,1)),dt=t=>.5+.5*Math.cos(Math.PI*B(t,0,1)),ut=(t,e,n)=>{if(t<0)return 0;const a=Math.max(N,e),s=Math.max(N,n);return t<=a?F(t/a):t<=a+s?dt((t-a)/s):0},pt=(t,e,n)=>{if(typeof t=="number")return Math.max(1,t);const a=t.curve==="exp"?"exp":"linear",s=B(e/Math.max(n,1e-6),0,1);return a==="linear"||t.start<=0||t.end<=0?Math.max(1,t.start+(t.end-t.start)*s):Math.max(1,t.start*(t.end/t.start)**s)},O=(t,e,n)=>{if(!e)return t;const a=new Float32Array(t.length),s=B(e.cutoff||1e3,20,n*.45),o=1/n,i=1/(2*Math.PI*s);if(e.type==="lowpass"){const p=o/(i+o);let y=0;for(let f=0;f<t.length;f+=1)y=y+p*(t[f]-y),a[f]=y;return a}const d=i/(i+o);let c=0,u=0;for(let p=0;p<t.length;p+=1){const y=t[p];c=d*(c+y-u),u=y,a[p]=c}return a},ft=(t,e,n)=>{const a=new Float32Array(e),s=Math.max(N*2,t.attack+t.decay),o=Math.max(0,Math.floor(t.offset*n));let i=0;for(let u=o;u<e;u+=1){const p=(u-o)/n,y=ut(p,t.attack,t.decay);if(y<=1e-8)continue;const f=pt(t.freq,p,s);i+=2*Math.PI*f/n;const M=ct(t.type,i);a[u]=M*y}const d=O(a,t.filter,n),c=Number.isFinite(t.gain)?t.gain:.5;for(let u=0;u<d.length;u+=1)d[u]*=c;return d},yt=(t,e)=>{let n=O(t,{type:"highpass",cutoff:20},e);n=O(n,{type:"lowpass",cutoff:1e4},e);let a=0;for(let i=0;i<n.length;i+=1)a+=n[i]*n[i];const s=Math.sqrt(a/Math.max(1,n.length));if(s>1e-9){const i=lt/s;for(let d=0;d<n.length;d+=1)n[d]*=i}for(let i=0;i<n.length;i+=1)n[i]=.95*Math.tanh(n[i]/.95);const o=Math.max(1,Math.floor(N*e));for(let i=0;i<o&&i<n.length;i+=1){const d=i/o;n[i]*=F(d),n[n.length-1-i]*=F(d)}return n},mt=(t,e=x)=>{const n=Math.max(1,Math.floor(t.duration*e)),a=new Float32Array(n);for(const s of t.layers){const o=ft(s,n,e);for(let i=0;i<n;i+=1)a[i]+=o[i]}return yt(a,e)},vt=(t,e=x)=>{const n=e*2,a=t.length*2,s=new ArrayBuffer(44+a),o=new DataView(s),i=(c,u)=>{for(let p=0;p<u.length;p+=1)o.setUint8(c+p,u.charCodeAt(p))};i(0,"RIFF"),o.setUint32(4,36+a,!0),i(8,"WAVE"),i(12,"fmt "),o.setUint32(16,16,!0),o.setUint16(20,1,!0),o.setUint16(22,1,!0),o.setUint32(24,e,!0),o.setUint32(28,n,!0),o.setUint16(32,2,!0),o.setUint16(34,16,!0),i(36,"data"),o.setUint32(40,a,!0);let d=44;for(let c=0;c<t.length;c+=1){const u=B(t[c],-1,1),p=u<0?u*32768:u*32767;o.setInt16(d,p,!0),d+=2}return new Blob([s],{type:"audio/wav"})},q="click",W="1.0.0",_="ux-sfx-custom-presets-v1",ht=["sine","square","saw","triangle","noise"],gt=["lowpass","highpass"],g=t=>JSON.parse(JSON.stringify(t)),P=()=>`sfx-${Math.random().toString(36).slice(2,6)}`,T=t=>`builtin:${t}`,V=t=>`custom:${t}`,bt=()=>{try{const t=localStorage.getItem(_);if(!t)return{};const e=JSON.parse(t);return e&&typeof e=="object"?e:{}}catch{return{}}},Y=t=>{localStorage.setItem(_,JSON.stringify(t))},G=(t,e=null)=>{const n=g(t),a=typeof n.createdAt=="string"&&n.createdAt||e&&typeof e.createdAt=="string"&&e.createdAt||new Date().toISOString();return{...n,name:typeof n.name=="string"&&n.name.trim()?n.name:P(),duration:Number.isFinite(n.duration)?n.duration:.2,layers:Array.isArray(n.layers)?n.layers:[],createdAt:a,version:W}},r={spec:G(z(D[q])),selectedPreset:T(q),customPresets:bt(),previewMode:"wave",activeLayerDot:0,rendered:null,audioContext:null,sourceNode:null,isPlaying:!1},wt=document.querySelector("#app");wt.innerHTML=`
  <main class="shell">
    <section class="panel panel-sidebar">
      <h1>UX SFX Generator</h1>
      <p class="tagline">Browser additive synth for UI sonification</p>
      <p class="app-version">v${W}</p>
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
        <button id="playToggleBtn" class="inline-hint inline-play" type="button" title="Play/Stop">&#9654;</button>
        <button id="canvasToggleHint" class="inline-hint" type="button">toggle view</button>
        <button id="downloadInlineBtn" class="inline-hint inline-download" type="button" title="Download WAV">wav</button>
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
`;const l={presetSelect:document.getElementById("presetSelect"),loadPresetBtn:document.getElementById("loadPresetBtn"),savePresetBtn:document.getElementById("savePresetBtn"),removePresetBtn:document.getElementById("removePresetBtn"),randomizeBtn:document.getElementById("randomizeBtn"),durationInput:document.getElementById("durationInput"),durationSlider:document.getElementById("durationSlider"),addLayerBtn:document.getElementById("addLayerBtn"),layersContainer:document.getElementById("layersContainer"),layerDots:document.getElementById("layerDots"),layerCount:document.getElementById("layerCount"),playToggleBtn:document.getElementById("playToggleBtn"),downloadInlineBtn:document.getElementById("downloadInlineBtn"),canvasToggleHint:document.getElementById("canvasToggleHint"),waveCanvas:document.getElementById("waveCanvas"),specCanvas:document.getElementById("specCanvas"),applyJsonBtn:document.getElementById("applyJsonBtn"),copyJsonBtn:document.getElementById("copyJsonBtn"),jsonEditor:document.getElementById("jsonEditor"),jsonStatus:document.getElementById("jsonStatus")},C=(t,e,n)=>Math.min(n,Math.max(e,t)),Mt=()=>({type:"sine",freq:880,attack:.004,decay:.12,gain:.5,offset:0,filter:null}),v=t=>{const e=typeof t=="function"?t(r.spec):t;r.spec=G(e,r.spec),Q()},R=()=>(r.rendered=mt(r.spec,x),r.rendered),m=(t,e=3)=>Number(t).toFixed(e),St=t=>typeof t=="number"?`${Math.round(t)} Hz`:`${Math.round(t.start)} -> ${Math.round(t.end)} (${t.curve})`,A=(t,e,n)=>{v(a=>{const s=g(a);return s.layers[t][e]=n,s})},E=()=>{const t=Object.keys(D).map(a=>`<option value="${T(a)}">${a}</option>`).join(""),n=Object.keys(r.customPresets).sort().map(a=>`<option value="${V(a)}">${a}</option>`).join("");l.presetSelect.innerHTML=`
    <optgroup label="Built-in">${t}</optgroup>
    ${n?`<optgroup label="Custom">${n}</optgroup>`:""}
  `,l.presetSelect.value=r.selectedPreset,l.presetSelect.classList.toggle("builtin-selected",r.selectedPreset.startsWith("builtin:"))},xt=(t,e)=>{const n=document.createElement("article");n.className="layer-card";const a=typeof t.freq=="object",s=t.filter!==null;return n.innerHTML=`
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
          ${ht.map(o=>`<option value="${o}" ${o===t.type?"selected":""}>${o}</option>`).join("")}
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
      <label class="meta-pill">${St(t.freq)}</label>
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
          ${gt.map(o=>`<option value="${o}" ${t.filter.type===o?"selected":""}>${o}</option>`).join("")}
        </select>
      </label>
      <label>Cutoff (Hz)
        <input data-key="filterCutoff" data-layer="${e}" type="number" min="20" max="20000" step="1" value="${m(t.filter.cutoff,0)}" />
      </label>
      `:""}
    </div>
  `,n},Et=t=>{const e=l.waveCanvas.getContext("2d"),n=l.waveCanvas.width,a=l.waveCanvas.height;e.fillStyle="#11131b",e.fillRect(0,0,n,a),e.strokeStyle="#2f354a",e.lineWidth=1,e.beginPath(),e.moveTo(0,a/2),e.lineTo(n,a/2),e.stroke(),e.strokeStyle="#fef08a",e.lineWidth=2,e.beginPath();for(let s=0;s<n;s+=1){const o=Math.floor(s/(n-1)*(t.length-1)),i=a*.5-t[o]*(a*.44);s===0?e.moveTo(s,i):e.lineTo(s,i)}e.stroke()},Ct=(t,e)=>.5-.5*Math.cos(2*Math.PI*t/(e-1)),$t=(t,e)=>{const n=t.length,a=Math.log2(n);if(Math.floor(a)!==a)throw new Error("FFT size must be power of 2");for(let s=0;s<n;s+=1){let o=0;for(let i=0;i<a;i+=1)o=o<<1|s>>>i&1;o>s&&([t[s],t[o]]=[t[o],t[s]],[e[s],e[o]]=[e[o],e[s]])}for(let s=2;s<=n;s<<=1){const o=s>>1,i=2*Math.PI/s;for(let d=0;d<n;d+=s)for(let c=d;c<d+o;c+=1){const p=-(c-d)*i,y=Math.cos(p),f=Math.sin(p),M=y*t[c+o]-f*e[c+o],b=y*e[c+o]+f*t[c+o];t[c+o]=t[c]-M,e[c+o]=e[c]-b,t[c]+=M,e[c]+=b}}},Pt=t=>{const e=[[0,0,4],[27,18,84],[80,18,123],[129,37,129],[181,54,122],[229,80,100],[251,135,97],[254,194,135],[252,253,191]],n=C(t,0,1)*(e.length-1),a=Math.floor(n),s=n-a,o=e[a],i=e[Math.min(e.length-1,a+1)];return[Math.round(o[0]+(i[0]-o[0])*s),Math.round(o[1]+(i[1]-o[1])*s),Math.round(o[2]+(i[2]-o[2])*s)]},Bt=t=>{const e=l.specCanvas,n=e.getContext("2d"),a=e.width,s=e.height;n.fillStyle="#0f0f13",n.fillRect(0,0,a,s);const o=1024,i=256,d=o/2,c=Math.max(1,Math.floor((t.length-o)/i)+1),u=n.createImageData(a,s),p=[];let y=-120;for(let f=0;f<c;f+=1){const M=f*i,b=new Float32Array(o),S=new Float32Array(o);for(let h=0;h<o;h+=1)b[h]=(t[M+h]||0)*Ct(h,o);$t(b,S);const L=new Float32Array(d);for(let h=0;h<d;h+=1){const j=Math.sqrt(b[h]**2+S[h]**2),$=20*Math.log10(j+1e-9);L[h]=$,$>y&&(y=$)}p.push(L)}for(let f=0;f<a;f+=1){const M=Math.min(c-1,Math.floor(f/(a-1)*(c-1))),b=p[M];for(let S=0;S<s;S+=1){const L=Math.floor((s-1-S)/(s-1)*(d-1)),h=(b==null?void 0:b[L])??-120,j=C((h-(y-80))/80,0,1),[$,Z,tt]=Pt(j),k=(S*a+f)*4;u.data[k]=$,u.data[k+1]=Z,u.data[k+2]=tt,u.data[k+3]=255}}n.putImageData(u,0,0)},X=()=>{r.sourceNode&&(r.sourceNode.stop(),r.sourceNode.disconnect(),r.sourceNode=null),r.isPlaying=!1,l.playToggleBtn.textContent="▶"},Lt=async()=>{const t=R();r.audioContext||(r.audioContext=new AudioContext({sampleRate:x})),r.audioContext.state==="suspended"&&await r.audioContext.resume(),X();const e=r.audioContext.createBuffer(1,t.length,x);e.copyToChannel(t,0,0);const n=r.audioContext.createBufferSource();n.buffer=e,n.connect(r.audioContext.destination),n.onended=()=>{r.sourceNode===n&&(r.sourceNode=null,r.isPlaying=!1,l.playToggleBtn.textContent="▶")},n.start(),r.sourceNode=n,r.isPlaying=!0,l.playToggleBtn.textContent="■"},kt=()=>{const t=R(),e=vt(t,x),n=URL.createObjectURL(e),a=document.createElement("a");a.href=n,a.download=`${(r.spec.name||P()).trim()||P()}.wav`,a.click(),URL.revokeObjectURL(n)},It=()=>{l.layersContainer.innerHTML="",r.spec.layers.forEach((t,e)=>{l.layersContainer.appendChild(xt(t,e))})},U=()=>{l.layerDots.innerHTML=r.spec.layers.map((t,e)=>`<button type="button" data-dot="${e}" class="${e===r.activeLayerDot?"active":""}" aria-label="Layer ${e+1}"></button>`).join("")},Nt=()=>{const t=l.layersContainer.querySelector(".layer-card");if(!t)return;const e=t.getBoundingClientRect().width+10,n=Math.round(l.layersContainer.scrollLeft/Math.max(1,e)),a=C(n,0,Math.max(0,r.spec.layers.length-1));a!==r.activeLayerDot&&(r.activeLayerDot=a,U())},K=t=>{r.previewMode=t;const e=t==="wave";l.waveCanvas.style.display=e?"block":"none",l.specCanvas.style.display=e?"none":"block"},H=()=>{K(r.previewMode==="wave"?"spec":"wave")},Q=()=>{l.durationInput.value=m(r.spec.duration,3),l.durationSlider.value=m(r.spec.duration,3),l.playToggleBtn.textContent=r.isPlaying?"■":"▶",l.layerCount.textContent=`${r.spec.layers.length} layer${r.spec.layers.length===1?"":"s"}`,It(),r.activeLayerDot=C(r.activeLayerDot,0,Math.max(0,r.spec.layers.length-1)),U();const t=R();Et(t),Bt(t),K(r.previewMode),l.jsonEditor.value=JSON.stringify(r.spec,null,2),l.jsonStatus.textContent=""};l.loadPresetBtn.addEventListener("click",()=>{const t=l.presetSelect.value;if(r.selectedPreset=t,t.startsWith("builtin:")){const a=t.replace("builtin:","");v(z(D[a])),E();return}const e=t.replace("custom:",""),n=r.customPresets[e];n&&(v(g(n)),E())});l.savePresetBtn.addEventListener("click",()=>{const t=(r.spec.name||P()).trim()||P();r.spec.name=t,r.customPresets[t]=g(r.spec),Y(r.customPresets),r.selectedPreset=V(t),l.jsonStatus.textContent=`Saved preset: ${t}`,E()});l.removePresetBtn.addEventListener("click",()=>{if(!r.selectedPreset.startsWith("custom:")){l.jsonStatus.textContent="Built-in presets cannot be removed.";return}const t=r.selectedPreset.replace("custom:","");delete r.customPresets[t],Y(r.customPresets),r.selectedPreset=T(q),l.presetSelect.value=r.selectedPreset,l.jsonStatus.textContent=`Removed preset: ${t}`,E()});l.presetSelect.addEventListener("change",t=>{r.selectedPreset=t.target.value,l.presetSelect.classList.toggle("builtin-selected",r.selectedPreset.startsWith("builtin:"))});l.randomizeBtn.addEventListener("click",()=>{v(it()),r.selectedPreset=T(q),E()});l.durationInput.addEventListener("input",t=>{const e=C(Number(t.target.value)||.1,.03,2.5);v(n=>({...n,duration:Number(e.toFixed(3))}))});l.durationSlider.addEventListener("input",t=>{const e=C(Number(t.target.value)||.1,.03,2.5);v(n=>({...n,duration:Number(e.toFixed(3))}))});l.addLayerBtn.addEventListener("click",()=>{v(t=>({...t,layers:[...t.layers,Mt()]}))});l.layersContainer.addEventListener("scroll",()=>{Nt()});l.layerDots.addEventListener("click",t=>{const e=t.target;if(!(e instanceof HTMLButtonElement))return;const n=Number(e.dataset.dot);if(!Number.isInteger(n))return;const a=l.layersContainer.querySelector(".layer-card");if(!a)return;const s=a.getBoundingClientRect().width+10;l.layersContainer.scrollTo({left:n*s,behavior:"smooth"}),r.activeLayerDot=n,U()});l.layersContainer.addEventListener("click",t=>{const e=t.target;if(!(e instanceof HTMLButtonElement))return;const n=Number(e.dataset.layer);Number.isInteger(n)&&(e.dataset.action==="remove"&&v(a=>{if(a.layers.length===1)return a;const s=g(a);return s.layers.splice(n,1),s}),e.dataset.action==="duplicate"&&v(a=>{const s=g(a);return s.layers.splice(n+1,0,g(s.layers[n])),s}))});l.layersContainer.addEventListener("input",t=>{const e=t.target;if(!(e instanceof HTMLInputElement||e instanceof HTMLSelectElement))return;const n=Number(e.dataset.layer),a=e.dataset.key;if(!(!Number.isInteger(n)||!a)){if(a==="type"){A(n,"type",e.value);return}if(a==="gain"||a==="attack"||a==="decay"||a==="offset"){A(n,a,Number(e.value));return}if(a==="freq"){A(n,"freq",Number(e.value));return}if(a==="freqMode"){v(s=>{const o=g(s);return o.layers[n].freq=e.value==="sweep"?{start:440,end:880,curve:"exp"}:Number(typeof o.layers[n].freq=="number"?o.layers[n].freq:o.layers[n].freq.start),o});return}if(a==="freqStart"||a==="freqEnd"||a==="freqCurve"){v(s=>{const o=g(s),i=typeof o.layers[n].freq=="object"?o.layers[n].freq:{start:440,end:880,curve:"exp"};return a==="freqStart"&&(i.start=Number(e.value)),a==="freqEnd"&&(i.end=Number(e.value)),a==="freqCurve"&&(i.curve=e.value),o.layers[n].freq=i,o});return}if(a==="filterEnabled"){v(s=>{const o=g(s);return o.layers[n].filter=e.value==="on"?{type:"lowpass",cutoff:2600}:null,o});return}(a==="filterType"||a==="filterCutoff")&&v(s=>{const o=g(s);return o.layers[n].filter||(o.layers[n].filter={type:"lowpass",cutoff:2600}),a==="filterType"&&(o.layers[n].filter.type=e.value),a==="filterCutoff"&&(o.layers[n].filter.cutoff=Number(e.value)),o})}});l.playToggleBtn.addEventListener("click",()=>{if(r.isPlaying){X();return}Lt()});l.downloadInlineBtn.addEventListener("click",()=>{kt()});l.canvasToggleHint.addEventListener("click",()=>{H()});l.waveCanvas.addEventListener("click",()=>{H()});l.specCanvas.addEventListener("click",()=>{H()});l.copyJsonBtn.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(l.jsonEditor.value),l.jsonStatus.textContent="JSON copied to clipboard."}catch{l.jsonStatus.textContent="Clipboard copy failed."}});l.applyJsonBtn.addEventListener("click",()=>{try{const t=JSON.parse(l.jsonEditor.value);if(!t||typeof t!="object"||!Array.isArray(t.layers))throw new Error("Invalid spec shape");v(t),l.jsonStatus.textContent="Spec applied."}catch{l.jsonStatus.textContent="Invalid JSON. Expected a Spec object."}});E();Q();
