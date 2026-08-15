import axios from "axios";
import { getStudentOrgId } from "../config/tenantConfig";

const getApiEndpoints = () => {
  const urls = [];
  if (import.meta.env.VITE_API_URL) {
    urls.push(import.meta.env.VITE_API_URL);
  }
  urls.push("http://localhost:5000/api");
  urls.push("http://localhost:5001/api");
  urls.push("https://wb-be-q2u6.onrender.com/api");
  return [...new Set(urls)];
};

export const resolveStudentBranchFE = (input = "") => {
  if (!input) return "cse";
  const str = input.toString().trim().toUpperCase();
  if (str.includes("ECE") || str.includes("ELECTRONIC")) return "ece";
  if (str.includes("CSE") || str.includes("COMPUTER")) return "cse";
  if (str.includes("EEE") || str.includes("ELECTRICAL")) return "eee";
  if (str.includes("MECH") || str.includes("MECHANICAL")) return "mech";
  if (str.includes("CIVIL") || str.includes("STRUCTURAL")) return "civil";

  if (str.length >= 8) {
    const branchCode = str.substring(6, 8);
    switch (branchCode) {
      case "04": return "ece";
      case "05": return "cse";
      case "03": return "eee";
      case "02": return "mech";
      case "01": return "civil";
      default: break;
    }
  }
  return "cse";
};

export const resolveStudentYearFE = (input) => {
  if (input !== null && input !== undefined && input !== "") {
    if (typeof input === "number") return input;
    if (typeof input === "object") {
      if (input.year !== undefined && input.year !== null && input.year !== "") return Number(input.year);
      if (input.academicYear !== undefined && input.academicYear !== null) return Number(input.academicYear);
      return resolveStudentYearFE(input.username || input.email || "");
    }
  }
  const str = (input || "").toString().trim().toUpperCase();
  if (str === "1" || str.includes("1ST")) return 1;
  if (str === "2" || str.includes("2ND")) return 2;
  if (str === "3" || str.includes("3RD")) return 3;
  if (str === "4" || str.includes("4TH")) return 4;

  if (str.length >= 2) {
    const prefix = str.substring(0, 2);
    if (prefix === "23" || prefix === "24") return 2;
    if (prefix === "22" || prefix === "21" || prefix === "19") return 3;
    if (prefix === "20") return 4;
  }
  return 2;
};

/**
 * Fetch organization-specific examinations directly from MongoDB.
 */
export const getActiveExamsForStudent = async (branchFilter = "", yearFilter = "") => {
  const orgId = getStudentOrgId();
  const endpoints = getApiEndpoints();
  let studentBranch = branchFilter;
  let studentYear = yearFilter;

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (!studentBranch || studentBranch === "my_branch") {
        studentBranch = resolveStudentBranchFE(user.branch || user.department || user.username || user.email || "");
      }
      if (!studentYear || studentYear === "my_year") {
        studentYear = resolveStudentYearFE(user);
      }
    }
  } catch (e) {}

  if (!studentYear && studentYear !== 0) {
    studentYear = 2;
  }

  for (const baseUrl of endpoints) {
    try {
      const params = {};
      if (studentBranch && studentBranch !== "all") {
        params.department = studentBranch;
      }
      if (studentYear && studentYear !== "all") {
        params.year = studentYear;
      }

      const response = await axios.get(`${baseUrl}/exams`, {
        headers: { 
          "x-tenant-id": orgId,
          "x-user-branch": studentBranch,
          "x-user-year": studentYear ? String(studentYear) : ""
        },
        params,
        timeout: 3500
      });
      if (response.data && response.data.success && Array.isArray(response.data.exams)) {
        let examsList = response.data.exams.map((e) => ({
          ...e,
          id: e._id ? e._id.toString() : (e.id || e.code)
        }));

        // Strict Client-Side Branch Filtering for FE_WB:
        if (studentBranch && studentBranch !== "all") {
          const target = studentBranch.toLowerCase();
          examsList = examsList.filter((e) => {
            const dept = (e.department || "").toLowerCase();
            if (dept === target || dept === "all") return true;

            const text = `${e.code || ""} ${e.title || ""} ${e.subject || ""}`.toLowerCase();
            if (target === "ece") {
              const isEce = text.includes("ec") || text.includes("vlsi") || text.includes("circuit") || text.includes("electronic");
              const isCse = text.includes("cs") || text.includes("java") || text.includes("data structure");
              return isEce && !isCse;
            }
            if (target === "cse") {
              const isCse = text.includes("cs") || text.includes("java") || text.includes("data structure");
              const isEce = text.includes("ec") || text.includes("vlsi");
              return isCse && !isEce;
            }
            return true;
          });
        }

        // Strict Client-Side Year Filtering for FE_WB:
        if (studentYear && studentYear !== "all") {
          const targetYear = Number(studentYear);
          examsList = examsList.filter((e) => {
            if (!e.year) return true;
            return Number(e.year) === targetYear;
          });
        }

        return examsList;
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
