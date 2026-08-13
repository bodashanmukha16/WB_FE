import axios from "axios";
import { getStudentOrgId } from "../config/tenantConfig";

const getApiEndpoints = () => {
  const urls = [];
  if (import.meta.env.VITE_API_URL) {
    urls.push(import.meta.env.VITE_API_URL);
  }
  urls.push("http://localhost:5000/api");
  // urls.push("http://localhost:5001/api");
  // urls.push("https://wb-be-q2u6.onrender.com/api");
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

  // Fallback local submission calculation if backend unreachable
  const exam = submissionPayload.exam || {};
  const questions = exam.questions || [];
  let score = 0;
  const totalMarks = exam.totalMarks || (questions.length * 2) || 10;
  const answers = submissionPayload.answers || {};

  questions.forEach((q) => {
    const qId = q.id || q._id;
    const selectedOpt = answers[qId] !== undefined ? answers[qId] : answers[q.id];
    if (selectedOpt !== undefined && Number(selectedOpt) === Number(q.correctOptionIndex)) {
      score += (q.marks || 2);
    }
  });

  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const passed = percentage >= (exam.passPercentage || 40);

  let grade = "F";
  if (percentage >= 90) grade = "S (Outstanding)";
  else if (percentage >= 80) grade = "A+ (Excellent)";
  else if (percentage >= 70) grade = "A (Very Good)";
  else if (percentage >= 60) grade = "B (Good)";
  else if (percentage >= 50) grade = "C (Satisfactory)";
  else if (percentage >= 40) grade = "D (Pass)";

  const fallbackSub = {
    examId,
    examTitle: exam.title || "Examination",
    userId: submissionPayload.userId,
    studentEmail: submissionPayload.studentEmail,
    studentName: submissionPayload.studentName,
    score,
    totalMarks,
    percentage,
    grade,
    passed,
    violationsCount: submissionPayload.violationsCount || 0,
    timeSpentSeconds: submissionPayload.timeSpentSeconds || 0,
    submittedAt: new Date().toISOString()
  };

  try {
    const existing = JSON.parse(localStorage.getItem("exam_history") || "[]");
    if (!existing.some((item) => item.examId === examId)) {
      existing.unshift(fallbackSub);
      localStorage.setItem("exam_history", JSON.stringify(existing));
    }
  } catch (e) {}

  return fallbackSub;
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
