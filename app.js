function scaleGame(){
  const frame = document.querySelector('.game-frame');
  if(!frame) return;

  const vw = Math.min(window.innerWidth, 1320) - 32; // padding buffer
  const vh = window.innerHeight - 170; // header+footer buffer
  const scale = Math.min(vw/960, vh/600, 1);
  frame.style.transform = `scale(${scale})`;
}

window.addEventListener('load', scaleGame);
window.addEventListener('resize', scaleGame);

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
    const t = setInterval(() => {
      if(hook()) clearInterval(t);
    }, 300);
  }
});
