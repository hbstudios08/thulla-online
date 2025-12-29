document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("net-status");
  const fsBtn = document.getElementById("btn-fullscreen");

  if (status) status.textContent = "Loading…";

  // Fullscreen button created by Unity template
  const tryWire = () => {
    const unityFS = document.getElementById("unity-fullscreen-button");
    if (unityFS) {
      if (status) status.textContent = "Ready";
      fsBtn?.addEventListener("click", () => unityFS.click());
      return true;
    }
    return false;
  };

  if (!tryWire()) {
    const t = setInterval(() => {
      if (tryWire()) clearInterval(t);
    }, 350);
  }
});
