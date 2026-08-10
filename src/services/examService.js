import axios from "axios";
import { getStudentOrgId } from "../config/tenantConfig";

const getApiEndpoints = () => {
  const urls = [];
  // Try local running backend server first if running locally
  urls.push("https://wb-be-q2u6.onrender.com/api");
  if (import.meta.env.VITE_API_URL) {
    urls.push(import.meta.env.VITE_API_URL);
  }
  urls.push("https://wb-be-q2u6.onrender.com/api");
  return [...new Set(urls)];
};

/**
 * Fetch organization-specific examinations directly from MongoDB.
 */
export const getActiveExamsForStudent = async () => {
  const orgId = getStudentOrgId();
  const endpoints = getApiEndpoints();

  for (const baseUrl of endpoints) {
    try {
      const response = await axios.get(`${baseUrl}/exams`, {
        headers: { "x-tenant-id": orgId },
        timeout: 3500
      });
      if (response.data && response.data.success && Array.isArray(response.data.exams)) {
        return response.data.exams.map((e) => ({
          ...e,
          id: e._id ? e._id.toString() : (e.id || e.code)
        }));
      }
    } catch (error) {
      // try next endpoint
    }
  }

  return [];
};

/**
 * Fetch specific exam details with questions directly from MongoDB.
 */
export const getExamDetailsById = async (examId) => {
  const orgId = getStudentOrgId();
  const endpoints = getApiEndpoints();

  for (const baseUrl of endpoints) {
    try {
      const response = await axios.get(`${baseUrl}/exams/${examId}`, {
        headers: { "x-tenant-id": orgId },
        timeout: 3500
      });
      if (response.data && response.data.success && response.data.exam) {
        const ex = response.data.exam;
        return {
          ...ex,
          id: ex._id ? ex._id.toString() : (ex.id || examId)
        };
      }
    } catch (error) {
      // try next endpoint
    }
  }

  return null;
};

/**
 * Submit exam responses into Organization Database branch collection.
 */
export const submitExamPayload = async (examId, submissionPayload) => {
  const orgId = getStudentOrgId();
  const endpoints = getApiEndpoints();

  for (const baseUrl of endpoints) {
    try {
      const response = await axios.post(`${baseUrl}/exams/${examId}/submit`, submissionPayload, {
        headers: { "x-tenant-id": orgId },
        timeout: 5000
      });
      if (response.data && response.data.success) {
        const sub = response.data.submission;
        try {
          const existing = JSON.parse(localStorage.getItem("exam_history") || "[]");
          if (!existing.some((item) => (item.examId === examId || item.examId === sub.examId))) {
            existing.unshift({ ...sub, examId: examId });
            localStorage.setItem("exam_history", JSON.stringify(existing));
          }
        } catch (e) {}
        return sub;
      }
    } catch (error) {
      // try next endpoint
    }
  }

  return null;
};

/**
 * Get student exam history from MongoDB / local storage
 */
export const getLocalExamHistory = async (userId = "") => {
  const orgId = getStudentOrgId();
  const endpoints = getApiEndpoints();

  let targetUser = userId;
  if (!targetUser) {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      targetUser = u.username || u.email || u._id || "";
    } catch (e) {}
  }

  if (targetUser) {
    for (const baseUrl of endpoints) {
      try {
        const response = await axios.get(`${baseUrl}/exams/history/${targetUser}`, {
          headers: { "x-tenant-id": orgId },
          timeout: 3000
        });
        if (response.data && response.data.success && Array.isArray(response.data.submissions)) {
          // Return only submissions that belong to this specific student
          return response.data.submissions.filter((s) => s.userId === targetUser || s.studentEmail === targetUser);
        }
      } catch (error) {
        // try next endpoint
      }
    }
  }

  // If user has not submitted any exams, return clean empty array []
  return [];
};

/**
 * Device check helper: returns true if running on Desktop environment (min 1024px, no mobile/tablet UA)
 */
export const isDesktopDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return true;
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || "";
  const isMobileOrTabletUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Android/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 1024;
  return !isMobileOrTabletUA && !isSmallScreen;
};
