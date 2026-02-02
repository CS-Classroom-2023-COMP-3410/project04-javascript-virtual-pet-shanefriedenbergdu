"use strict";

const STORAGE_KEY = "petState";

let state = loadState() || {
  hunger: 30, 
  energy: 70, 
  health: 100 
};

const petEl = document.getElementById("pet");
const moodTextEl = document.getElementById("moodText");
const healthTextEl = document.getElementById("healthText");
const hungerTextEl = document.getElementById("hungerText");
const energyTextEl = document.getElementById("energyText");

document.getElementById("feedBtn").addEventListener("click", () => {
  state.hunger = bound(state.hunger - 20, 0, 100);
  state.health = bound(state.health + 5, 0, 100);
  saveAndRender();
});

document.getElementById("playBtn").addEventListener("click", () => {
  state.energy = bound(state.energy - 15, 0, 100);
  state.hunger = bound(state.hunger + 10, 0, 100);
  state.health = bound(state.health + 5, 0, 100);
  saveAndRender();
});

document.getElementById("sleepBtn").addEventListener("click", () => {
  state.energy = bound(state.energy + 25, 0, 100);
  state.hunger = bound(state.hunger + 5, 0, 100);
  saveAndRender();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  state = { hunger: 30, energy: 70, health: 100 };
  render();
});

setInterval(() => {
  state.hunger = bound(state.hunger + 3, 0, 100);
  state.energy = bound(state.energy - 2, 0, 100);

  if (state.hunger >= 80) state.health = bound(state.health - 4, 0, 100);
  if (state.energy <= 20) state.health = bound(state.health - 3, 0, 100);

  saveAndRender();
}, 5000);

function getMood() {
  if (state.health <= 30) return "Sick";
  if (state.energy <= 25) return "Sleepy";
  if (state.hunger >= 70) return "Hungry";
  return "Happy";
}

function render() {
  const mood = getMood();

  moodTextEl.textContent = mood;
  healthTextEl.textContent = `${state.health}`;
  hungerTextEl.textContent = `${state.hunger}`;
  energyTextEl.textContent = `${state.energy}`;

  if (state.health <= 30) {
    petEl.style.background = "#ff6b6b"; // red
  } else if (mood === "Hungry") {
    petEl.style.background = "#ffa94d"; // orange
  } else if (mood === "Sleepy") {
    petEl.style.background = "#b197fc"; // purple
  } else {
    petEl.style.background = "#66a3ff"; // blue (happy)
  }
}

function saveAndRender() {
  saveState(state);
  render();
}

function saveState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function bound(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

render();
