/* thulla.online: central config for all links.
   Edit the values below once; every page picks them up. */

window.THULLA_LINKS = {
  // App stores
  playStore: "https://play.google.com/store/apps/details?id=com.ahstudios.thulla",
  appStore:  "https://apps.apple.com/app/id6777625808",

  // Community
  whatsapp:  "https://chat.whatsapp.com/LfpTwCjOGQ50oLdOvhc8dk",
  discord:   "https://discord.gg/Uf2tZAFqm",

// Web player page (the homepage "Play Instantly" button and the invite page both use it)
  play:      "/play.html",
  webPlayer: "/play.html",
  roomParam: "code"         // query parameter that carries the room code
};

// Any element with data-link="playStore" (etc.) gets its href from the list above.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var url = window.THULLA_LINKS[el.getAttribute("data-link")];
    if (url) el.setAttribute("href", url);
  });
});
