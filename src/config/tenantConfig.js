import axios from "axios";

// Default fallback mappings if backend API is initializing
let cachedCollegeCodes = { KH: "svck", A9: "aits", SITS: "s", JN: "jntu" };
let cachedOrgDetails = {
  aits: { name: "AITS Rajampet", code: "AITS", logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80" },
  svck: { name: "SV College of Engineering", code: "SVCK", logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80" }
};

// Try loading cached values from localStorage for instant synchronous startup
try {
  const localCodes = localStorage.getItem("public_college_codes");
  const localDetails = localStorage.getItem("public_org_details");
  if (localCodes) cachedCollegeCodes = JSON.parse(localCodes);
  if (localDetails) cachedOrgDetails = JSON.parse(localDetails);
} catch (e) {}

// Asynchronously fetch live org data from backend API
export const fetchPublicOrganizations = async () => {
  try {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const res = await axios.get(`${apiBase}/superadmin/public/organizations`);
    if (res.data && res.data.success) {
      if (res.data.collegeCodes) {
        cachedCollegeCodes = res.data.collegeCodes;
        localStorage.setItem("public_college_codes", JSON.stringify(res.data.collegeCodes));
      }
      if (res.data.organizations) {
        cachedOrgDetails = res.data.organizations;
        localStorage.setItem("public_org_details", JSON.stringify(res.data.organizations));
      }
    }
  } catch (e) {
    // Retain fallback
  }
};

// Automatically fetch on bundle load
fetchPublicOrganizations();

export const getCollegeCodeMap = () => cachedCollegeCodes;
export const getOrgDetailsMap = () => cachedOrgDetails;

// Helper function to resolve college orgId from student roll number or email based strictly on .env
export const resolveOrgFromUsernameOrEmail = (input = "") => {
  const codeMap = getCollegeCodeMap();
  const defaultOrg = codeMap["SVCK"] || codeMap["SV"] || codeMap["KH"] || "svck";
  if (!input) return defaultOrg;

  const str = input.toString().trim().toUpperCase();

  // 1. Direct text check for SVCK, SV, KH, AITS
  if (str.includes("SVCK") || str.includes("SV") || str.includes("KH")) return "svck";
  if (str.includes("AITS") || str.includes("A9")) return "aits";

  // 2. Check 4-char substring (e.g. '23SVCK0542' -> 'SVCK')
  if (str.length >= 6) {
    const fourChar = str.substring(2, 6);
    if (codeMap[fourChar]) return codeMap[fourChar];
  }

  // 3. Check index 2..3 for roll number college code (e.g. '19KH1A0512' -> 'KH', '23A91A0401' -> 'A9')
  if (str.length >= 4) {
    const codeAtPos = str.substring(2, 4);
    if (codeMap[codeAtPos]) {
      return codeMap[codeAtPos];
    }
  }

  // 4. Check for configured code keys in input
  for (const [code, orgId] of Object.entries(codeMap)) {
    if (str.includes(code)) return orgId;
  }

  return defaultOrg;
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
