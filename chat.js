/* Thulla live chat — Firebase Realtime Database + Anonymous Auth
   1) Paste your Firebase web config below.
   2) Enable Authentication > Anonymous, and create a Realtime Database.
   3) Paste the rules from the instructions into the database Rules tab. */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDByeRDFdWS2RJ03RcAxZ2h6PNjk6gU2M4",
  authDomain: "thulla-6db08.firebaseapp.com",
  databaseURL: "https://thulla-6db08-default-rtdb.firebaseio.com/",
  projectId: "thulla-6db08",
  appId: "1:172924001608:web:43449075b82e2165daa77d"
};

(function () {
  const MAX_LEN = 200, MAX_NAME = 20, SHOW_LAST = 50, COOLDOWN_MS = 2000;

  const box = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const nameInput = document.getElementById("chat-name");
  const statusEl = document.getElementById("chat-status");
  const onlineEl = document.getElementById("chat-online");
  if (!box || !form) return;

  function setStatus(t) { statusEl.textContent = t || ""; }

  if (typeof firebase === "undefined" || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
    onlineEl.textContent = "offline";
    setStatus("Chat not configured yet (add Firebase config in chat.js).");
    input.disabled = true; form.querySelector("button").disabled = true;
    return;
  }

  firebase.initializeApp(FIREBASE_CONFIG);
  const db = firebase.database();
  const auth = firebase.auth();

  // nickname (kept in this browser only)
  let nick = "";
  try { nick = localStorage.getItem("thulla_nick") || ""; } catch (e) {}
  if (!nick) nick = "Player" + Math.floor(1000 + Math.random() * 9000);
  nameInput.value = nick;
  nameInput.addEventListener("change", () => {
    nick = nameInput.value.trim().slice(0, MAX_NAME) || nick;
    nameInput.value = nick;
    try { localStorage.setItem("thulla_nick", nick); } catch (e) {}
  });

  function colorFor(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
    return "hsl(" + h + ",70%,65%)";
  }

  function addMessage(m, myUid) {
    const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 30;
    const row = document.createElement("div");
    row.className = "chat-row" + (m.uid === myUid ? " mine" : "");
    const n = document.createElement("span");
    n.className = "chat-name";
    n.style.color = colorFor(m.uid || m.name);
    n.textContent = m.name + ": ";          // textContent => no HTML injection
    const t = document.createElement("span");
    t.textContent = m.text;
    row.append(n, t);
    box.appendChild(row);
    while (box.children.length > 100) box.removeChild(box.firstChild);
    if (atBottom) box.scrollTop = box.scrollHeight;
  }

  // If nothing connects within 10s, say what to check instead of hanging
  let connected = false;
  setTimeout(() => {
    if (!connected) {
      onlineEl.textContent = "offline";
      setStatus("Can't reach chat. Check databaseURL in chat.js, Anonymous sign-in, and Authorized domains (see browser console).");
      console.error("[chat] no connection after 10s. databaseURL =", FIREBASE_CONFIG.databaseURL);
    }
  }, 10000);

  auth.signInAnonymously().catch((err) => {
    console.error("[chat] anonymous sign-in failed:", err.code, err.message);
    onlineEl.textContent = "offline";
    setStatus("Sign-in failed (" + err.code + "). Enable Anonymous auth and add your domain to Authorized domains.");
  });

  auth.onAuthStateChanged((user) => {
    if (!user) return;
    setStatus("");
    const uid = user.uid;

    // messages
    const ref = db.ref("chat/global").orderByChild("ts").limitToLast(SHOW_LAST);
    ref.on("child_added", (snap) => addMessage(snap.val(), uid), (err) => {
      console.error("[chat] message read denied:", err.code, err.message);
      setStatus("Can't read messages. Publish firebase-rules.json.");
    });

    // presence (online count)
    const me = db.ref("presence/" + uid);
    db.ref(".info/connected").on("value", (s) => {
      if (s.val() === true) { connected = true; me.onDisconnect().remove(); me.set(true); }
    });
    db.ref("presence").on("value", (s) => {
      onlineEl.textContent = s.numChildren() + " online";
    }, (err) => {
      console.error("[chat] presence read denied:", err.code, err.message);
      onlineEl.textContent = "offline";
      setStatus("Database rules blocked reading. Publish firebase-rules.json.");
    });

    // sending
    let last = 0;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim().slice(0, MAX_LEN);
      if (!text) return;
      const now = Date.now();
      if (now - last < COOLDOWN_MS) { setStatus("Slow down a little."); return; }
      last = now; setStatus("");
      db.ref("chat/global").push({
        name: (nameInput.value.trim() || nick).slice(0, MAX_NAME),
        text: text,
        uid: uid,
        ts: firebase.database.ServerValue.TIMESTAMP
      }).catch(() => setStatus("Message failed to send."));
      input.value = "";
    });
  });
})();
