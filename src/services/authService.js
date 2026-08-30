// authService.js
//
// Authentication and account registration service.
// Supports both built-in demo accounts and custom local user registration.

import { loadUsers, saveUsers } from "./storageService";

export const DEMO_ACCOUNTS = {
  mom: { email: "aisha@mamarise.app", password: "recover123", name: "Aisha", role: "mom" },
  partner: { email: "rohan@mamarise.app", password: "support123", name: "Rohan", role: "partner" },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOGIN_DELAY_MS = 500;

export function validateLoginFields({ email, password, name, role }) {
  const errors = {};
  const trimmedEmail = (email || "").trim();
  const trimmedName = (name || "").trim();

  if (role === "mom" && name !== undefined) {
    if (!trimmedName) {
      errors.name = "Tell us what to call you — first name is enough.";
    } else if (trimmedName.length < 2) {
      errors.name = "That name feels a little short. Try two letters or more.";
    }
  }

  if (!trimmedEmail) {
    errors.email = role === "mom"
      ? "We need an email so this space stays yours."
      : "Email is required to sign in.";
  } else if (!EMAIL_RE.test(trimmedEmail)) {
    errors.email = role === "mom"
      ? "That doesn't look like an email yet. Check for an @ and a domain."
      : "Enter a valid email address.";
  }

  if (!password) {
    errors.password = role === "mom"
      ? "A password keeps this space private."
      : "Password is required.";
  } else if (password.length < 6) {
    errors.password = role === "mom"
      ? "Use at least 6 characters — something you'll remember."
      : "Password must be at least 6 characters.";
  }

  return errors;
}

export function validateRegisterFields({ name, email, password, role }) {
  const errors = validateLoginFields({ email, password, name, role });
  const trimmedName = (name || "").trim();

  if (!trimmedName) {
    errors.name = role === "mom"
      ? "Tell us what to call you — first name is enough."
      : "Please enter your name.";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  return errors;
}

export function registerUser({ name, email, password, role }) {
  const fieldErrors = validateRegisterFields({ name, email, password, role });
  if (Object.keys(fieldErrors).length) {
    const err = new Error("Please fix the highlighted fields.");
    err.fields = fieldErrors;
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const users = loadUsers();
      const existing = users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.role === role
      );
      const demoAccount = DEMO_ACCOUNTS[role];
      const isDemo = demoAccount && demoAccount.email.toLowerCase() === cleanEmail;

      if (existing || isDemo) {
        const err = new Error(
          role === "mom"
            ? "An account with this email already exists. You can sign in directly."
            : "An account with this email already exists. Please sign in."
        );
        err.code = "ACCOUNT_EXISTS";
        reject(err);
        return;
      }

      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        password,
        role,
        registeredAt: Date.now(),
      };

      saveUsers([...users, newUser]);

      resolve({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isNewUser: true,
        loggedInAt: Date.now(),
      });
    }, LOGIN_DELAY_MS);
  });
}

export function loginWithPassword({ email, password, role, name }) {
  const fieldErrors = validateLoginFields({ email, password, name, role });
  if (Object.keys(fieldErrors).length) {
    const err = new Error("Please fix the highlighted fields.");
    err.fields = fieldErrors;
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleanEmail = (email || "").trim().toLowerCase();
      const users = loadUsers();
      const registeredMatch = users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.role === role
      );
      const demoMatch =
        DEMO_ACCOUNTS[role] &&
          DEMO_ACCOUNTS[role].email.toLowerCase() === cleanEmail
          ? DEMO_ACCOUNTS[role]
          : null;

      const account = registeredMatch || demoMatch;

      if (!account) {
        const err = new Error(
          role === "mom"
            ? "We couldn't find an account with this email. Would you like to create one?"
            : "No partner account found for this email. Please check or create a new account."
        );
        err.code = "INVALID_CREDENTIALS";
        err.subCode = "ACCOUNT_NOT_FOUND";
        reject(err);
        return;
      }

      if (account.password !== password) {
        const err = new Error(
          role === "mom"
            ? "Incorrect password. You're safe to try again whenever you're ready."
            : "Incorrect password. Please try again."
        );
        err.code = "INVALID_CREDENTIALS";
        reject(err);
        return;
      }

      resolve({
        email: account.email,
        name: (name && name.trim()) || account.name,
        role: account.role,
        isNewUser: false,
        loggedInAt: Date.now(),
      });
    }, LOGIN_DELAY_MS);
  });
}

export function dashboardPathForRole(role) {
  if (role === "partner") return "/partner/dashboard";
  if (role === "mom") return "/mom/dashboard";
  return "/choose-role";
}
