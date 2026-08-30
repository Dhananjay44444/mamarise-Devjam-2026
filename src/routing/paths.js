export const PATHS = {
  landing: "/",
  chooseRole: "/choose-role",
  momLogin: "/login/mom",
  partnerLogin: "/login/partner",
  momDashboard: "/mom/dashboard",
  partnerDashboard: "/partner/dashboard",
  safety: "/safety",
};

export const MOM_SCREENS = [
  "dashboard",
  "onboarding",
  "checkin",
  "checkinresult",
  "loadmirror",
  "readiness",
  "readinesscard",
  "shareexport",
  "safetywall",
  "insights",
  "nourishnudge",
  "carecircle",
];

export function pathForView(view, role) {
  if (view === "landing") return PATHS.landing;
  if (view === "roleselect") return PATHS.chooseRole;
  if (view === "momlogin") return PATHS.momLogin;
  if (view === "partnerlogin") return PATHS.partnerLogin;
  if (view === "partnerdashboard") return PATHS.partnerDashboard;
  if (view === "safetywall" && role !== "mom") return PATHS.safety;
  if (view === "dashboard") {
    if (role === "partner") return PATHS.partnerDashboard;
    if (role === "mom") return PATHS.momDashboard;
    return PATHS.landing;
  }
  return `/mom/${view}`;
}
