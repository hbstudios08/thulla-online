// Responsive sizing without CSS transform (keeps Unity loading bar aligned)
(function(){
  const BASE_W = 960;
  const BASE_H = 600;
  const ASPECT = BASE_W / BASE_H;

  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

  function resizeFrame(){
    const frame = document.getElementById('game-frame');
    const stage = document.querySelector('.game-stage');
    if(!frame || !stage) return;

    // Available size inside stage (minus padding)
    const stageRect = stage.getBoundingClientRect();
    const pad = 28; // stage padding+border buffer
    let availW = stageRect.width - pad;
    let availH = stageRect.height - pad;

    // If stage height is small (content scroll), use viewport height as fallback
    if(availH < 200){
      availH = window.innerHeight - 220; // header/footer buffer
    }

    // Fit rect to aspect
    let w = Math.min(BASE_W, availW);
    let h = w / ASPECT;
    if(h > Math.min(BASE_H, availH)){
      h = Math.min(BASE_H, availH);
      w = h * ASPECT;
    }

    w = clamp(w, 320, BASE_W);
    h = clamp(h, 200, BASE_H);

    frame.style.width = Math.round(w) + 'px';
    frame.style.height = Math.round(h) + 'px';

    // Also set unity container/canvas style sizes so internal overlays align visually
    const uc = document.getElementById('unity-container');
    const canvas = document.getElementById('unity-canvas');
    if(uc){ uc.style.width = '100%'; uc.style.height = '100%'; }
    if(canvas){ canvas.style.width = '100%'; canvas.style.height = '100%'; }
  }

  window.addEventListener('load', resizeFrame);
  window.addEventListener('resize', resizeFrame);
  window.addEventListener('orientationchange', resizeFrame);
  setInterval(resizeFrame, 800); // cheap safety for late layout changes

  document.addEventListener('DOMContentLoaded', () => {
    const status = document.getElementById('net-status');
    const fsBtn = document.getElementById('btn-fullscreen');
    if(status) status.textContent = 'Loading…';

    const hook = () => {
      const unityFS = document.getElementById('unity-fullscreen-button');
      if(!unityFS) return false;
      if(status) status.textContent = 'Ready';
      fsBtn?.addEventListener('click', () => unityFS.click());
      return true;
    };

    if(!hook()){
      const t = setInterval(() => { if(hook()) clearInterval(t); }, 300);
    }
  });
})();