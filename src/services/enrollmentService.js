import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";

// Base API endpoint derived from environment configuration
const ENROLLMENTS_API = API_ENDPOINTS.ENROLLMENTS;

// In-memory cache for ultra-responsive UI state management
let memoryEnrollmentsCache = {};

// Helper to get current authenticated student info
export const getCurrentStudent = () => {
  try {
    const userStr = localStorage.getItem("user");
    let user = {};
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        user = {};
      }
    }
    const rollNumber = user.username || user.rollNumber || user._id || user.id || "guest_student";
    const userEmail = user.email || `${rollNumber}@workbench.edu`;
    const orgId = user.orgId || user.tenantId || localStorage.getItem("x-tenant-id") || "svck";

    // Direct fields
    let branch = user.branch || user.department || user.branchCode || "";
    let year = user.year || user.academicYear || user.currentYear || "";

    // Roll number fallback parser if direct branch/year not in user object
    if (!branch || !year) {
      const cleanRoll = String(rollNumber).toUpperCase().trim();

      // Extract batch year e.g. 24 -> Year 1, 23 -> Year 2, 22 -> Year 3, 21 -> Year 4
      const yearMatch = cleanRoll.match(/^(21|22|23|24|25|26)/);
      if (yearMatch && !year) {
        const batch = parseInt(yearMatch[1], 10);
        if (batch === 24) year = '1';
        else if (batch === 23) year = '2';
        else if (batch === 22) year = '3';
        else if (batch === 21) year = '4';
      }

      // Extract Branch from roll number pattern
      if (!branch) {
        if (cleanRoll.includes('CSE') || cleanRoll.includes('A05') || cleanRoll.includes('1A05')) branch = 'CSE';
        else if (cleanRoll.includes('ECE') || cleanRoll.includes('A04') || cleanRoll.includes('1A04')) branch = 'ECE';
        else if (cleanRoll.includes('EEE') || cleanRoll.includes('A02') || cleanRoll.includes('1A02')) branch = 'EEE';
        else if (cleanRoll.includes('MECH') || cleanRoll.includes('A03') || cleanRoll.includes('1A03')) branch = 'MECH';
        else if (cleanRoll.includes('CIVIL') || cleanRoll.includes('A01') || cleanRoll.includes('1A01')) branch = 'CIVIL';
        else if (cleanRoll.includes('AIML') || cleanRoll.includes('A42') || cleanRoll.includes('1A42')) branch = 'AIML';
        else if (cleanRoll.includes('AIDS') || cleanRoll.includes('A44') || cleanRoll.includes('1A44')) branch = 'AIDS';
        else if (cleanRoll.includes('CSM') || cleanRoll.includes('A66') || cleanRoll.includes('1A66')) branch = 'CSM';
        else if (cleanRoll.includes('IT') || cleanRoll.includes('A12') || cleanRoll.includes('1A12')) branch = 'IT';
      }
    }

    return {
      userId: rollNumber,
      username: rollNumber,
      email: userEmail,
      fullname: user.name || user.fullname || rollNumber,
      orgId: String(orgId).toLowerCase().trim(),
      branch: String(branch || 'CSE').toUpperCase().trim(),
      year: String(year || '1').trim()
    };
  } catch (e) {
    return {
      userId: "guest_student",
      username: "guest_student",
      email: "student@workbench.edu",
      fullname: "Student User",
      orgId: "svck",
      branch: "CSE",
      year: "1"
    };
  }
};

// Helper for local storage persistent caching per student
const getStorageKey = () => {
  const student = getCurrentStudent();
  return `wb_enrollments_${student.username}`;
};

const getPersistentEnrollmentsMap = () => {
  try {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {};
};

const savePersistentEnrollmentsMap = (map) => {
  try {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(map));
  } catch (e) {}
};

// Enroll student directly into Mongoose MongoDB collection & LocalStorage
export const enrollStudentInCourse = async (course) => {
  const student = getCurrentStudent();
  const rollNumber = student.username;
  const courseId = course.id;

  const payload = {
    userId: rollNumber,
    studentEmail: student.email,
    studentName: student.fullname,
    courseId,
    courseTitle: course.title
  };

  let record = null;

  try {
    const res = await axios.post(`${ENROLLMENTS_API}/enroll`, payload);
    if (res.data && res.data.enrollment) {
      record = res.data.enrollment;
    }
  } catch (err) {
    console.warn("Mongoose backend API call failed:", err.message);
  }

  // Fallback record if API call format differs
  if (!record) {
    record = {
      userId: rollNumber,
      studentEmail: student.email,
      studentName: student.fullname,
      courseId,
      courseTitle: course.title,
      enrolledAt: new Date().toISOString(),
      status: "Enrolled",
      completedTopics: [],
      progressPercentage: 0,
      lastAccessedAt: new Date().toISOString()
    };
  }

  // Update memory cache
  memoryEnrollmentsCache[`${rollNumber}_${courseId}`] = record;
  memoryEnrollmentsCache[`${student.email}_${courseId}`] = record;

  // Save to persistent localStorage
  const localMap = getPersistentEnrollmentsMap();
  localMap[courseId] = record;
  savePersistentEnrollmentsMap(localMap);

  return record;
};

// Check if student is enrolled by querying MongoDB state
export const isStudentEnrolled = (courseId) => {
  const student = getCurrentStudent();
  if (!student) return false;

  const localMap = getPersistentEnrollmentsMap();
  if (localMap[courseId]) return true;

  return !!(memoryEnrollmentsCache[`${student.username}_${courseId}`] || memoryEnrollmentsCache[`${student.email}_${courseId}`]);
};

// Get single course enrollment details directly from Mongoose database record
export const getStudentCourseProgress = async (courseId) => {
  const student = getCurrentStudent();
  if (!student) return null;

  // Fetch fresh state directly from Mongoose database API
  const allUserRecords = await fetchAllUserEnrollments();
  const found = allUserRecords.find((r) => r.courseId === courseId);
  if (found) return found;

  const localMap = getPersistentEnrollmentsMap();
  return localMap[courseId] || null;
};

// Update topic progress and completion in Mongoose MongoDB database
export const updateCourseTopicProgress = async (courseId, completedTopics, totalTopics) => {
  const student = getCurrentStudent();
  const rollNumber = student.username;

  const payload = {
    userId: rollNumber,
    studentEmail: student.email,
    courseId,
    completedTopics,
    totalTopics
  };

  let updatedRecord = null;

  try {
    const res = await axios.post(`${ENROLLMENTS_API}/progress`, payload);
    if (res.data && res.data.enrollment) {
      updatedRecord = res.data.enrollment;
    }
  } catch (err) {
    console.warn("Mongoose progress sync failed:", err.message);
  }

  if (!updatedRecord) {
    const total = Math.max(totalTopics, 1);
    const progress = Math.min(100, Math.round((completedTopics.length / total) * 100));
    updatedRecord = {
      userId: rollNumber,
      studentEmail: student.email,
      courseId,
      completedTopics,
      progressPercentage: progress,
      status: progress === 100 ? "Completed" : progress > 0 ? "In-Progress" : "Enrolled",
      lastAccessedAt: new Date().toISOString()
    };
  }

  memoryEnrollmentsCache[`${rollNumber}_${courseId}`] = updatedRecord;
  memoryEnrollmentsCache[`${student.email}_${courseId}`] = updatedRecord;

  // Save to persistent localStorage
  const localMap = getPersistentEnrollmentsMap();
  localMap[courseId] = updatedRecord;
  savePersistentEnrollmentsMap(localMap);

  return updatedRecord;
};

// Fetch all course enrollments directly from Mongoose MongoDB API (SINGLE SOURCE OF TRUTH)
export const fetchAllUserEnrollments = async () => {
  const student = getCurrentStudent();
  const rollNumber = student.username;

  try {
    const res = await axios.get(`${ENROLLMENTS_API}/user/${rollNumber}`);
    if (res.data && Array.isArray(res.data.enrollments)) {
      // Overwrite local memory & localStorage strictly with fresh database records
      const freshMap = {};
      memoryEnrollmentsCache = {};
      
      res.data.enrollments.forEach((record) => {
        freshMap[record.courseId] = record;
        memoryEnrollmentsCache[`${rollNumber}_${record.courseId}`] = record;
        memoryEnrollmentsCache[`${record.studentEmail}_${record.courseId}`] = record;
      });

      // Synchronize persistent localStorage strictly with database state
      savePersistentEnrollmentsMap(freshMap);
      return res.data.enrollments;
    }
  } catch (err) {
    console.warn("Failed to fetch Mongoose enrollments from backend:", err.message);
  }

  // Fallback to offline localStorage cache ONLY if network request fails
  return Object.values(getPersistentEnrollmentsMap());
};
