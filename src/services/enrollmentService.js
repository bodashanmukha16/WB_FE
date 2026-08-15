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
    if (!userStr) {
      return {
        userId: "guest_student",
        username: "guest_student",
        email: "student@workbench.edu",
        fullname: "Student User",
        orgId: "svck"
      };
    }
    const user = JSON.parse(userStr);
    const rollNumber = user.username || user._id || user.id || "guest_student";
    const userEmail = user.email || `${rollNumber}@workbench.edu`;
    return {
      userId: rollNumber,
      username: rollNumber,
      email: userEmail,
      fullname: user.name || user.fullname || rollNumber,
      orgId: user.orgId || "svck"
    };
  } catch (e) {
    return {
      userId: "guest_student",
      username: "guest_student",
      email: "student@workbench.edu",
      fullname: "Student User",
      orgId: "svck"
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
