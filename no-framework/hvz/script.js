// ===============================
// LocalStorage Sync Helpers
// ===============================
function savePlayers() {
  const obj = Object.fromEntries(players);
  localStorage.setItem("hvzPlayers", JSON.stringify(obj));
}

function loadPlayers() {
  const saved = localStorage.getItem("hvzPlayers");
  if (saved) {
    const obj = JSON.parse(saved);
    for (const [name, team] of Object.entries(obj)) {
      players.set(name, team);
    }
  }
}

// ===============================
// DOM Elements
// ===============================
const teamButtons = document.querySelectorAll(".team-btn");
const joinBtn = document.getElementById("joinBtn");
const playerNameInput = document.getElementById("playerName");
const taggerNameInput = document.getElementById("taggerName");
const taggedNameInput = document.getElementById("taggedName");
const tagBtn = document.getElementById("tagBtn");
const humanCountEl = document.getElementById("humanCount");
const zombieCountEl = document.getElementById("zombieCount");
const logEl = document.getElementById("log");

// ===============================
// Game State
// ===============================
let selectedTeam = "human";
const players = new Map(); // name -> "human" | "zombie"

// ===============================
// UI Helpers
// ===============================
function updateScoreboard() {
  let humans = 0;
  let zombies = 0;

  for (const team of players.values()) {
    if (team === "human") humans++;
    else zombies++;
  }

  humanCountEl.textContent = humans;
  zombieCountEl.textContent = zombies;
}

function addLog(message) {
  const entry = document.createElement("div");
  entry.className = "log-entry";

  const msgSpan = document.createElement("span");
  msgSpan.textContent = message;

  const timeSpan = document.createElement("span");
  timeSpan.className = "time";
  timeSpan.textContent = new Date().toLocaleTimeString();

  entry.appendChild(msgSpan);
  entry.appendChild(timeSpan);
  logEl.prepend(entry);
}

// ===============================
// Team Selection Buttons
// ===============================
teamButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    teamButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTeam = btn.dataset.team;
  });
});

// ===============================
// Join Game
// ===============================
joinBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Enter a name to join.");
    return;
  }

  players.set(name, selectedTeam);
  savePlayers();
  updateScoreboard();
  addLog(`${name} joined as a ${selectedTeam}.`);

  playerNameInput.value = "";
});

// ===============================
// Tagging Logic
// ===============================
tagBtn.addEventListener("click", () => {
  const tagger = taggerNameInput.value.trim();
  const tagged = taggedNameInput.value.trim();

  if (!tagger || !tagged) {
    alert("Enter both tagger and tagged names.");
    return;
  }

  if (!players.has(tagger)) {
    alert(`${tagger} is not in the game yet.`);
    return;
  }
  if (!players.has(tagged)) {
    alert(`${tagged} is not in the game yet.`);
    return;
  }

  const taggerTeam = players.get(tagger);
  const taggedTeam = players.get(tagged);

  if (taggerTeam !== "zombie") {
    alert(`${tagger} must be a zombie to tag a human.`);
    return;
  }
  if (taggedTeam !== "human") {
    alert(`${tagged} is not a human anymore.`);
    return;
  }

  players.set(tagged, "zombie");
  savePlayers();
  updateScoreboard();
  addLog(`${tagger} tagged ${tagged}. ${tagged} is now a zombie!`);

  taggerNameInput.value = "";
  taggedNameInput.value = "";
});

// ===============================
// Initialization
// ===============================
loadPlayers();
updateScoreboard();
addLog("Game loaded.");