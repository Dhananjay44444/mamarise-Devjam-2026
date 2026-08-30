// storageService.js
//
// This is the ONLY file that talks to localStorage directly. Every other
// part of the app goes through state/store.js, which goes through here.
//
// Future backend integration: replace the bodies of loadState/saveState
// with real network calls (e.g. GET/POST to /api/state). Nothing else in
// the app needs to change, because components never call localStorage
// directly — they only ever read from AppContext.

const STORAGE_KEY = "mamarise_app_state_v1";
const USERS_STORAGE_KEY = "mamarise_registered_users_v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("mamarise: failed to load saved state", e);
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("mamarise: failed to save state", e);
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("mamarise: failed to clear saved state", e);
  }
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("mamarise: failed to load saved users", e);
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn("mamarise: failed to save users", e);
  }
}
