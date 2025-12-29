document.addEventListener("DOMContentLoaded", () => {
  const fsBtn = document.getElementById("btn-fullscreen");
  const status = document.getElementById("net-status");

  if(status) status.textContent = "Status: Ready";

  fsBtn?.addEventListener("click", () => {
    document.getElementById("unity-fullscreen-button")?.click();
  });
});
