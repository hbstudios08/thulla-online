function scaleGame(){
  const frame = document.querySelector('.game-frame');
  if(!frame) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight - 140;
  const scale = Math.min(vw/960, vh/600, 1);
  frame.style.transform = `scale(${scale})`;
}

window.addEventListener('load', scaleGame);
window.addEventListener('resize', scaleGame);

document.addEventListener('DOMContentLoaded', () => {
  const fsBtn = document.getElementById('btn-fullscreen');
  const status = document.getElementById('net-status');

  const hook = () => {
    const unityFS = document.getElementById('unity-fullscreen-button');
    if(!unityFS) return false;
    status.textContent = 'Ready';
    fsBtn.addEventListener('click', () => unityFS.click());
    return true;
  };

  const t = setInterval(() => {
    if(hook()) clearInterval(t);
  }, 300);
});
