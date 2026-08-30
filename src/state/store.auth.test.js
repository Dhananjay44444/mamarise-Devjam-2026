import { appReducer, defaultState } from "./store";

test("LOGIN_SUCCESS marks the session authenticated with a role", () => {
  const next = appReducer(defaultState, {
    type: "LOGIN_SUCCESS",
    payload: { name: "Aisha", email: "aisha@mamarise.app", role: "mom", loggedInAt: 1 },
  });
  expect(next.isAuthenticated).toBe(true);
  expect(next.userRole).toBe("mom");
  expect(next.session.email).toBe("aisha@mamarise.app");
});

test("LOGOUT clears auth but keeps household tasks", () => {
  const loggedIn = appReducer(defaultState, {
    type: "LOGIN_SUCCESS",
    payload: { name: "Rohan", email: "rohan@mamarise.app", role: "partner", loggedInAt: 1 },
  });
  const after = appReducer(loggedIn, { type: "LOGOUT" });
  expect(after.isAuthenticated).toBe(false);
  expect(after.userRole).toBe(null);
  expect(after.session).toBe(null);
  expect(after.householdTasks).toEqual(loggedIn.householdTasks);
});
