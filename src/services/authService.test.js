import {
  validateLoginFields,
  validateRegisterFields,
  loginWithPassword,
  registerUser,
  dashboardPathForRole,
  DEMO_ACCOUNTS,
} from "./authService";

describe("validateLoginFields", () => {
  test("mom requires name, email, and password when name provided", () => {
    const errors = validateLoginFields({ email: "", password: "", name: "", role: "mom" });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });

  test("rejects invalid email and short password", () => {
    const errors = validateLoginFields({ email: "not-an-email", password: "12", name: "Aisha", role: "mom" });
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });

  test("partner does not require a name", () => {
    const errors = validateLoginFields({ email: "rohan@mamarise.app", password: "support123", role: "partner" });
    expect(errors).toEqual({});
  });
});

describe("validateRegisterFields", () => {
  test("requires name, valid email, and password", () => {
    const errors = validateRegisterFields({ name: "", email: "", password: "", role: "mom" });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });

  test("accepts valid registration payload", () => {
    const errors = validateRegisterFields({
      name: "Priya",
      email: "priya@example.com",
      password: "mypassword123",
      role: "mom",
    });
    expect(errors).toEqual({});
  });
});

describe("registerUser and loginWithPassword", () => {
  test("accepts demo mom credentials", async () => {
    const session = await loginWithPassword({
      email: DEMO_ACCOUNTS.mom.email,
      password: DEMO_ACCOUNTS.mom.password,
      name: "Aisha",
      role: "mom",
    });
    expect(session.role).toBe("mom");
    expect(session.email).toBe(DEMO_ACCOUNTS.mom.email);
  });

  test("allows creating and logging in with a new custom account", async () => {
    const regSession = await registerUser({
      name: "Meera",
      email: "meera@test.com",
      password: "secretpassword",
      role: "mom",
    });
    expect(regSession.name).toBe("Meera");
    expect(regSession.email).toBe("meera@test.com");
    expect(regSession.isNewUser).toBe(true);

    const loginSession = await loginWithPassword({
      email: "meera@test.com",
      password: "secretpassword",
      role: "mom",
    });
    expect(loginSession.name).toBe("Meera");
    expect(loginSession.email).toBe("meera@test.com");
  });

  test("rejects duplicate email registration", async () => {
    await expect(
      registerUser({
        name: "Duplicate",
        email: DEMO_ACCOUNTS.mom.email,
        password: "password123",
        role: "mom",
      })
    ).rejects.toMatchObject({ code: "ACCOUNT_EXISTS" });
  });

  test("rejects wrong password", async () => {
    await expect(
      loginWithPassword({
        email: DEMO_ACCOUNTS.partner.email,
        password: "wrong-password",
        role: "partner",
      })
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });
  });

  test("does not allow partner credentials on mom login", async () => {
    await expect(
      loginWithPassword({
        email: DEMO_ACCOUNTS.partner.email,
        password: DEMO_ACCOUNTS.partner.password,
        name: "Aisha",
        role: "mom",
      })
    ).rejects.toMatchObject({ code: "INVALID_CREDENTIALS" });
  });
});

describe("dashboardPathForRole", () => {
  test("routes mom and partner to different dashboards", () => {
    expect(dashboardPathForRole("mom")).toBe("/mom/dashboard");
    expect(dashboardPathForRole("partner")).toBe("/partner/dashboard");
    expect(dashboardPathForRole("mom")).not.toBe(dashboardPathForRole("partner"));
  });
});
