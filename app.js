document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("net-status");
  const fsBtn = document.getElementById("btn-fullscreen");

  if (status) status.textContent = "Loading…";

  const wire = () => {
    const unityFS = document.getElementById("unity-fullscreen-button");
    if (!unityFS) return false;
    if (status) status.textContent = "Ready";
    fsBtn?.addEventListener("click", () => unityFS.click());
    return true;
  };

  if (!wire()) {
    const t = setInterval(() => {
      if (wire()) clearInterval(t);
    }, 350);
  }
});
