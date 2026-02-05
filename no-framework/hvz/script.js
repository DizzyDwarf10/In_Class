const teamButtons = document.querySelectorAll(".team-btn");
const joinBtn = document.getElementById("joinBtn");
const playerNameInput = document.getElementById("playerName");
const taggerNameInput = document.getElementById("taggerName");
const taggedNameInput = document.getElementById("taggedName");
const tagBtn = document.getElementById("tagBtn");
const humanCountEl = document.getElementById("humanCount");
const zombieCountEl = document.getElementById("zombieCount");
const logEl = document.getElementById("log");

let selectedTeam = "human";
const players = new Map(); // name -> "human" | "zombie"

function updateScoreboard() {
  let humans = 0;
  let zombies = 0;
  for (const team of players.values()) {
    if (team === "human") humans++;
    else if (team === "zombie") zombies++;
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
  const now = new Date();
  timeSpan.textContent = now.toLocaleTimeString();

  entry.appendChild(msgSpan);
  entry.appendChild(timeSpan);
  logEl.prepend(entry);
}

teamButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    teamButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTeam = btn.dataset.team;
  });
});

joinBtn.addEventListener("click", () => {
  const name = playerNameInput.value.trim();
  if (!name) {
    alert("Enter a name to join.");
    return;
  }
  players.set(name, selectedTeam);
  updateScoreboard();
  addLog(`${name} joined as a ${selectedTeam}.`);
  playerNameInput.value = "";
});

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
  updateScoreboard();
  addLog(`${tagger} tagged ${tagged}. ${tagged} is now a zombie!`);

  taggerNameInput.value = "";
  taggedNameInput.value = "";
});

// Seed demo players
players.set("Alpha", "human");
players.set("Omega", "zombie");
updateScoreboard();
addLog("Game initialized with Alpha (human) and Omega (zombie).");