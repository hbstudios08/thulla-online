document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("net-status");
  const fsBtn = document.getElementById("btn-fullscreen");

  // Update status when Unity hides loading bar (Unity template sets it to none)
  const loadingBar = document.getElementById("unity-loading-bar");
  if (status) status.textContent = "Status: Initializing…";

  // Poll for unityInstance hookup via fullscreen button (created by Unity template)
  const tick = setInterval(() => {
    const fsUnityBtn = document.getElementById("unity-fullscreen-button");
    if (fsUnityBtn) {
      if (status) status.textContent = "Status: Ready";
      clearInterval(tick);
    }
  }, 400);

  fsBtn?.addEventListener("click", () => {
    const fsUnityBtn = document.getElementById("unity-fullscreen-button");
    if (fsUnityBtn) fsUnityBtn.click();
  });

  // If loading bar disappears, assume game loaded
  const obs = new MutationObserver(() => {
    if (!loadingBar) return;
    const disp = getComputedStyle(loadingBar).display;
    if (disp === "none" && status) status.textContent = "Status: Ready";
  });
  if (loadingBar) obs.observe(loadingBar, { attributes: true, attributeFilter: ["style", "class"] });
});
