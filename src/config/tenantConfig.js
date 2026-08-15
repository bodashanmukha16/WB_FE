import axios from "axios";

// Dynamically parse VITE_COLLEGE_CODES from frontend environment (.env)
export const getCollegeCodeMap = () => {
  try {
    const envCodes = import.meta.env.VITE_COLLEGE_CODES;
    if (envCodes) {
      return JSON.parse(envCodes);
    }
  } catch (e) {
    console.error("Error parsing VITE_COLLEGE_CODES from .env:", e.message);
  }
  return {};
};

// Dynamically parse VITE_ORG_DETAILS from frontend environment (.env)
export const getOrgDetailsMap = () => {
  try {
    const envOrgDetails = import.meta.env.VITE_ORG_DETAILS;
    if (envOrgDetails) {
      return JSON.parse(envOrgDetails);
    }
  } catch (e) {
    console.error("Error parsing VITE_ORG_DETAILS from .env:", e.message);
  }
  return {};
};

// Helper function to resolve college orgId from student roll number or email based strictly on .env
export const resolveOrgFromUsernameOrEmail = (input = "") => {
  const codeMap = getCollegeCodeMap();
  const firstConfiguredOrg = Object.values(codeMap)[0] || "svck";
  if (!input) return firstConfiguredOrg;

  const str = input.toString().trim().toUpperCase();

  // 1. Check index 2..3 for roll number college code (e.g. '19KH1A0512' -> 'KH', '23A91A0401' -> 'A9')
  if (str.length >= 4) {
    const codeAtPos = str.substring(2, 4);
    if (codeMap[codeAtPos]) {
      return codeMap[codeAtPos];
    }
  }

  // 2. Check for configured code keys in input
  for (const [code, orgId] of Object.entries(codeMap)) {
    if (str.includes(code)) return orgId;
  }

  return firstConfiguredOrg;
};

// Get student's logged in college organization ID
export const getStudentOrgId = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      // Roll number code mapping from .env takes highest priority!
      if (user.username) {
        const derived = resolveOrgFromUsernameOrEmail(user.username);
        if (derived) return derived;
      }
      if (user.email) {
        const derived = resolveOrgFromUsernameOrEmail(user.email);
        if (derived) return derived;
      }
      if (user.orgId && user.orgId !== "undefined") return user.orgId;
    }
  } catch (e) {
    // ignore parsing errors
  }
  const firstOrg = Object.values(getCollegeCodeMap())[0];
  return firstOrg || "svck";
};

// Get student's Organization details (name, logo, code) sourced strictly from .env
export const getStudentOrgDetails = () => {
  const orgId = getStudentOrgId();
  const detailsMap = getOrgDetailsMap();

  if (detailsMap[orgId]) {
    return detailsMap[orgId];
  }

  return {
    name: "SV College of Engineering",
    code: "SVCK",
    logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80"
  };
};

// Automatic Axios Request Interceptor injecting student's college x-tenant-id
axios.interceptors.request.use(
  (config) => {
    const orgId = getStudentOrgId();
    config.headers["x-tenant-id"] = orgId;
    return config;
  },
  (error) => Promise.reject(error)
);

export default getStudentOrgId;
