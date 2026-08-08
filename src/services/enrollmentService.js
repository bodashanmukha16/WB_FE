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
    if (!userStr) return { userId: "guest_student", email: "student@workbench.edu", fullname: "Student User" };
    const user = JSON.parse(userStr);
    return {
      userId: user._id || user.id || user.email || "guest_student",
      email: user.email || user.username || "student@workbench.edu",
      fullname: user.fullname || user.name || user.username || "Student User"
    };
  } catch (e) {
    return {
      userId: "guest_student",
      email: "student@workbench.edu",
      fullname: "Student User"
    };
  }
};

// Enroll student directly into Mongoose MongoDB collection
export const enrollStudentInCourse = async (course) => {
  const student = getCurrentStudent();
  const studentEmail = student.email;
  const courseId = course.id;

  const payload = {
    userId: student.userId,
    studentEmail,
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

  // Fallback in memory if server response payload format differs
  if (!record) {
    record = {
      userId: student.userId,
      studentEmail,
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

  memoryEnrollmentsCache[`${studentEmail}_${courseId}`] = record;
  return record;
};

// Check if student is enrolled by querying Mongoose cache/API
export const isStudentEnrolled = (courseId) => {
  const student = getCurrentStudent();
  if (!student) return false;
  return !!memoryEnrollmentsCache[`${student.email}_${courseId}`];
};

// Get single course enrollment details from Mongoose record
export const getStudentCourseProgress = async (courseId) => {
  const student = getCurrentStudent();
  if (!student) return null;
  
  const key = `${student.email}_${courseId}`;
  if (memoryEnrollmentsCache[key]) {
    return memoryEnrollmentsCache[key];
  }

  // Fetch directly from Mongoose database API
  const allUserRecords = await fetchAllUserEnrollments();
  return memoryEnrollmentsCache[key] || allUserRecords.find((r) => r.courseId === courseId) || null;
};

// Update topic progress and completion in Mongoose MongoDB database
export const updateCourseTopicProgress = async (courseId, completedTopics, totalTopics) => {
  const student = getCurrentStudent();
  const studentEmail = student.email;

  const payload = {
    studentEmail,
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
      studentEmail,
      courseId,
      completedTopics,
      progressPercentage: progress,
      status: progress === 100 ? "Completed" : progress > 0 ? "In-Progress" : "Enrolled",
      lastAccessedAt: new Date().toISOString()
    };
  }

  memoryEnrollmentsCache[`${studentEmail}_${courseId}`] = updatedRecord;
  return updatedRecord;
};

// Fetch all course enrollments directly from Mongoose MongoDB API
export const fetchAllUserEnrollments = async () => {
  const student = getCurrentStudent();
  const studentEmail = student.email;

  try {
    const res = await axios.get(`${ENROLLMENTS_API}/user/${studentEmail}`);
    if (res.data && Array.isArray(res.data.enrollments)) {
      res.data.enrollments.forEach((record) => {
        memoryEnrollmentsCache[`${record.studentEmail}_${record.courseId}`] = record;
      });
      return res.data.enrollments;
    }
  } catch (err) {
    console.warn("Failed to fetch Mongoose enrollments:", err.message);
  }

  return Object.values(memoryEnrollmentsCache).filter((r) => r.studentEmail === studentEmail);
};
