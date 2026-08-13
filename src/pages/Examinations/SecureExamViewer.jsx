import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentOrgDetails } from "../../config/tenantConfig";
import { getExamDetailsById, submitExamPayload, isDesktopDevice } from "../../services/examService";

export default function SecureExamViewer() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const orgDetails = getStudentOrgDetails();

  // Desktop device check state
  const [isDesktop, setIsDesktop] = useState(isDesktopDevice());

  // Exam Data State
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Student Responses State
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [flagged, setFlagged] = useState({}); // { questionId: true/false }

  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 mins default
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Security & Proctoring Lockdown State
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [violationsCount, setViolationsCount] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);

  // Post-Exam Result State
  const [examResult, setExamResult] = useState(null);

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ref to prevent double submission
  const submittedRef = useRef(false);

  // 1. Load Examination Details
  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      const data = await getExamDetailsById(examId);
      if (data) {
        setExam(data);
        const durationSec = (data.durationMinutes || 30) * 60;
        setSecondsRemaining(durationSec);
      }
      setLoading(false);
    };

    fetchExam();
  }, [examId]);

  // 2. Fullscreen Request on Mount (runs once on mount if exam active)
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && !submittedRef.current && !isSubmitted && !examResult) {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
          }
        }
      } catch (err) {
        console.warn("Fullscreen request warning:", err.message);
      }
    };

    enterFullscreen();
  }, []);

  // 3. Security & Proctoring Lockdown Event Listeners
  useEffect(() => {
    // DO NOT attach security listeners if test is completed, submitting, or submitted
    if (isSubmitted || submittedRef.current || examResult || isSubmitting) {
      return;
    }

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      const activeFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
      setIsFullscreen(activeFS);

      if (!activeFS && !submittedRef.current && !isSubmitted && !examResult && !isSubmitting) {
        registerViolation("FULLSCREEN EXIT DETECTED: You exited full-screen lockdown mode!");
      }
    };

    // Tab focus / Window blur listener
    const handleVisibilityChange = () => {
      if (document.hidden && !submittedRef.current && !isSubmitted && !examResult && !isSubmitting) {
        registerViolation("TAB SWITCH DETECTED: Navigating away from test screen is prohibited!");
      }
    };

    const handleWindowBlur = () => {
      if (!submittedRef.current && !isSubmitted && !examResult && !isSubmitting) {
        registerViolation("WINDOW FOCUS LOST: Moving cursor/focus outside test window is recorded!");
      }
    };

    // Prevent keyboard shortcuts (F12, DevTools, Reload, Alt+Tab)
    const handleKeyDown = (e) => {
      if (submittedRef.current || isSubmitted || examResult || isSubmitting) return;

      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u")) ||
        (e.ctrlKey && (e.key === "R" || e.key === "r")) ||
        e.key === "F5"
      ) {
        e.preventDefault();
        registerViolation(`KEYBOARD VIOLATION: Shortcut key [${e.key}] blocked!`);
        return false;
      }

      // Keyboard option selection shortcuts (1, 2, 3, 4 or A, B, C, D)
      if (exam && exam.questions[currentQIndex]) {
        const currentQ = exam.questions[currentQIndex];
        if (["1", "2", "3", "4"].includes(e.key)) {
          const optIdx = parseInt(e.key) - 1;
          if (optIdx < currentQ.options.length) {
            handleSelectOption(currentQ.id, optIdx);
          }
        } else if (["a", "b", "c", "d", "A", "B", "C", "D"].includes(e.key)) {
          const optMap = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
          const optIdx = optMap[e.key];
          if (optIdx !== undefined && optIdx < currentQ.options.length) {
            handleSelectOption(currentQ.id, optIdx);
          }
        }
      }
    };

    // Prevent page reload / navigation prompt
    const handleBeforeUnload = (e) => {
      if (!submittedRef.current && !isSubmitted && !examResult && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "Warning: Examination in progress! Leaving will submit your test.";
        return e.returnValue;
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [exam, currentQIndex, examResult, isSubmitting, isSubmitted]);

  // 4. Register Security Violation
  const registerViolation = (reason) => {
    if (submittedRef.current || isSubmitted || examResult || isSubmitting) return;

    setViolationsCount((prev) => {
      const nextCount = prev + 1;
      setViolationMessage(reason);
      setShowViolationModal(true);

      if (nextCount >= 3) {
        // Auto Submit on 3 strikes
        setTimeout(() => {
          handleFinalSubmit(true);
        }, 1500);
      }
      return nextCount;
    });
  };

  // 5. Live Countdown & Time Tracking Timer
  useEffect(() => {
    if (loading || !exam || examResult || isSubmitted) return;

    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);

      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(true); // Auto submit on timer zero
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, exam, examResult, isSubmitted]);

  // Helper formatting for timer
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Option selection
  const handleSelectOption = (qId, optionIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  // Clear Option
  const handleClearOption = (qId) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  // Toggle Flag for Review
  const handleToggleFlag = (qId) => {
    setFlagged((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const exitFullscreenLock = async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (e) {
      console.warn("Fullscreen exit error:", e.message);
    }
  };

  // Clear violation overlays when submitting, and exit fullscreen ONLY after scorecard is loaded
  useEffect(() => {
    if (examResult || isSubmitting || submittedRef.current || isSubmitted) {
      setShowViolationModal(false);
      setShowConfirmSubmitModal(false);
    }
    if (examResult) {
      exitFullscreenLock();
    }
  }, [examResult, isSubmitting, isSubmitted]);

  // Final Exam Submission Handler
  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (submittedRef.current || isSubmitted) return;
    submittedRef.current = true;
    setIsSubmitted(true);
    setIsSubmitting(true);
    setShowConfirmSubmitModal(false);
    setShowViolationModal(false);

    // Maintain full screen lockdown mode while submitting responses to backend
    const studentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
      exam,
      userId: studentUser.username || studentUser._id || "student_user",
      studentEmail: studentUser.email || "student@workbench.edu",
      studentName: studentUser.fullname || studentUser.username || "Student",
      answers,
      violationsCount: isAutoSubmit ? Math.max(violationsCount, 3) : violationsCount,
      timeSpentSeconds
    };

    const result = await submitExamPayload(examId, payload);
    setExamResult(result);
    setIsSubmitting(false);
    setShowViolationModal(false);

    // Cleanly exit fullscreen mode AFTER exam is successfully submitted and scorecard is set
    setTimeout(async () => {
      await exitFullscreenLock();
    }, 200);
  };

  const reenterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
    } catch (e) {
      console.warn("Re-enter fullscreen failed:", e.message);
    }
    setShowViolationModal(false);
  };

  // Window resize listener to monitor Desktop requirement dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(isDesktopDevice());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-20 h-20 bg-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center text-4xl mb-6 border border-rose-500/40 shadow-xl shadow-rose-900/30">
          <i className="fas fa-desktop"></i>
        </div>
        <span className="bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-rose-500/30 mb-4">
          PROCTORING SECURITY RESTRICTION
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white max-w-xl mb-3">
          Desktop / Laptop Computer Required
        </h1>
        <p className="text-gray-300 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
          Examinations are locked for security compliance and <strong>cannot be attempted on Mobile phones or Tablets</strong>. Please open this examination portal from a Desktop or Laptop PC to proceed.
        </p>
        <button
          onClick={async () => {
            await exitFullscreenLock();
            navigate("/examinations");
          }}
          className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg uppercase text-xs tracking-wider transition"
        >
          Return to Examination Portal
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-purple-300 font-bold tracking-wide">Initializing Secured Examination Lockdown Environment...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="text-3xl font-bold text-rose-400 mb-2">Exam Not Found</div>
        <p className="text-gray-400 mb-6">The requested examination could not be loaded.</p>
        <button onClick={() => navigate("/examinations")} className="px-6 py-3 bg-purple-600 rounded-xl text-white font-bold">
          Return to Portal
        </button>
      </div>
    );
  }

  // Calculate Progress Stats
  const questions = exam.questions || [];
  const totalQCount = questions.length;
  const currentQ = questions[currentQIndex] || {};
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const progressPercent = Math.round((answeredCount / (totalQCount || 1)) * 100);

  // Render Post-Exam Result Scorecard View
  if (examResult) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Result Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-3xl shadow-xl mb-4 border ${
              examResult.violationsCount >= 3
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-900/40"
                : examResult.passed
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-900/40"
                : "bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-blue-900/40"
            }`}>
              <i className={`fas ${
                examResult.violationsCount >= 3
                  ? "fa-ban text-rose-400"
                  : examResult.passed
                  ? "fa-trophy text-emerald-400"
                  : "fa-graduation-cap text-blue-400"
              }`}></i>
            </div>

            <span className="bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-purple-500/30">
              {orgDetails.code} Official Scorecard Report
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
              {examResult.violationsCount >= 3
                ? "Examination Terminated (Security Lockdown Violation)"
                : "Examination Submitted Successfully!"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {exam.title} ({exam.code})
            </p>
          </div>

          {/* Metrics Scorecard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl text-center">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score Achieved</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                {examResult.score} <span className="text-sm font-normal text-gray-400">/ {examResult.totalMarks}</span>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl text-center">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Percentage</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">
                {examResult.percentage}%
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl text-center">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grade Awarded</div>
              <div className="text-sm sm:text-base font-black text-blue-400 mt-2 truncate">
                {examResult.grade}
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl text-center">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Security Integrity</div>
              <div className={`text-sm sm:text-base font-black mt-2 ${examResult.violationsCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                {examResult.violationsCount} Warnings
              </div>
            </div>
          </div>

          {/* Secure Submission Summary Box */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 mb-8 text-center space-y-3">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mx-auto text-xl border border-purple-500/30">
              <i className="fas fa-lock"></i>
            </div>
            <h3 className="text-base font-bold text-white">
              Official Assessment Record Logged
            </h3>
            <p className="text-gray-300 text-xs max-w-lg mx-auto leading-relaxed">
              Your test answers and security audit logs have been recorded and locked in the {orgDetails.name} examination database. Individual question solutions are confidential as per institution security policy.
            </p>
            {examResult.violationsCount >= 3 && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-300 text-xs font-semibold max-w-md mx-auto">
                <i className="fas fa-exclamation-triangle mr-1.5"></i>
                Note: This examination was auto-submitted due to reaching maximum security warnings (3 strikes).
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={async () => {
                await exitFullscreenLock();
                navigate("/examinations");
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white font-extrabold rounded-xl shadow-lg hover:from-purple-500 hover:to-blue-500 transition uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Examination Portal
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Main Live Exam Test Interface
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      className="min-h-screen bg-slate-950 text-gray-100 font-sans selection:bg-none select-none flex flex-col h-screen overflow-hidden"
    >
      {/* SECURED TOP HEADER BAR */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        
        {/* Left: Organization & Exam Title */}
        <div className="flex items-center gap-3">
          <img
            src={orgDetails.logo}
            alt={orgDetails.name}
            className="w-9 h-9 rounded-xl border border-purple-500/40 object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-none">
                {orgDetails.code} SECURED EXAM
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <i className="fas fa-lock text-[9px]"></i> FULLSCREEN LOCKED
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white truncate max-w-xs sm:max-w-md">
              {exam.title}
            </h2>
          </div>
        </div>

        {/* Center: Live Timer Countdown Display */}
        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <div className={`w-3 h-3 rounded-full ${secondsRemaining < 300 ? "bg-rose-500 animate-ping" : "bg-purple-500"}`}></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Time Remaining:</span>
          <span className={`text-base sm:text-lg font-black font-mono tracking-wider ${
            secondsRemaining < 300 ? "text-rose-400 animate-pulse" : "text-purple-300"
          }`}>
            {formatTime(secondsRemaining)}
          </span>
        </div>

        {/* Right: Submit Button & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfirmSubmitModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-md text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5"
          >
            <i className="fas fa-paper-plane text-xs"></i>
            Finish & Submit
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-slate-800 text-gray-300 hover:text-white rounded-xl border border-slate-700 text-sm"
            title="Toggle Question Palette"
          >
            <i className={`fas ${sidebarOpen ? "fa-indent" : "fa-outdent"}`}></i>
          </button>
        </div>

      </header>

      {/* PROGRESS PERCENTAGE BAR */}
      <div className="w-full bg-slate-900 h-1.5">
        <div
          className="bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* MAIN TEST CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* MAIN QUESTION DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto w-full">
          
          <div>
            {/* Question Top Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow">
                  Question {currentQIndex + 1} of {totalQCount}
                </span>
                <span className="bg-slate-800 text-emerald-400 text-xs font-bold px-3 py-1 rounded-xl border border-slate-700">
                  +{currentQ.marks || 2} Marks
                </span>
              </div>

              <button
                onClick={() => handleToggleFlag(currentQ.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  flagged[currentQ.id]
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-900/30"
                    : "bg-slate-800/80 text-gray-400 border-slate-700 hover:text-white"
                }`}
              >
                <i className={`fas fa-flag ${flagged[currentQ.id] ? "text-amber-400" : ""}`}></i>
                {flagged[currentQ.id] ? "Flagged for Review" : "Flag for Review"}
              </button>
            </div>

            {/* Question Title / Text */}
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed">
                {currentQ.text}
              </h3>

              {/* Code Snippet Box if available */}
              {currentQ.codeSnippet && (
                <div className="mt-4 bg-slate-900 rounded-2xl border border-slate-800 p-4 font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto shadow-inner">
                  <div className="text-[10px] uppercase font-bold text-gray-500 border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
                    <span>Source Code Preview</span>
                    <span>Syntax: Standard</span>
                  </div>
                  <pre>
                    <code>{currentQ.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Options Selection Cards */}
            <div className="space-y-3 mb-6">
              {currentQ.options && currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ.id] === oIdx;

                return (
                  <div
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, oIdx)}
                    className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-900/40 to-slate-900 border-purple-500 shadow-lg shadow-purple-900/20"
                        : "bg-slate-900/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                        isSelected
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-slate-800 text-gray-400 group-hover:bg-purple-600/30 group-hover:text-purple-300"
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </div>

                      <span className={`text-sm sm:text-base font-semibold ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                        {opt}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-purple-400 bg-purple-600" : "border-slate-700"
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Choice Option */}
            {answers[currentQ.id] !== undefined && (
              <button
                onClick={() => handleClearOption(currentQ.id)}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 mb-6"
              >
                <i className="fas fa-undo"></i> Clear Selection Choice
              </button>
            )}

          </div>

          {/* NAVIGATION FOOTER BUTTONS */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => prev - 1)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                currentQIndex === 0
                  ? "bg-slate-900 text-gray-600 border border-slate-800 cursor-not-allowed"
                  : "bg-slate-800 text-gray-200 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <i className="fas fa-chevron-left text-[10px]"></i> Previous
            </button>

            <div className="text-xs text-gray-400 hidden sm:block">
              Tip: Use keys <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px]">1-4</kbd> or <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px]">A-D</kbd> to pick answers
            </div>

            {currentQIndex < totalQCount - 1 ? (
              <button
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
              >
                Next Question <i className="fas fa-chevron-right text-[10px]"></i>
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmitModal(true)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
              >
                Review & Finish <i className="fas fa-check text-[10px]"></i>
              </button>
            )}
          </div>

        </main>

        {/* QUESTION PALETTE SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-72 bg-slate-900/90 border-l border-slate-800 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-th text-purple-400"></i> Question Palette
                </h4>
                <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                  {answeredCount}/{totalQCount} Answered
                </span>
              </div>

              {/* Question Number Grid */}
              <div className="grid grid-cols-5 gap-2.5 mb-6">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQIndex;
                  const isAnswered = answers[q.id] !== undefined;
                  const isFlagged = flagged[q.id];

                  let btnStyle = "bg-slate-800 text-gray-400 border-slate-700";
                  if (isCurrent) {
                    btnStyle = "bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900 font-extrabold shadow-lg";
                  } else if (isFlagged) {
                    btnStyle = "bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold";
                  } else if (isAnswered) {
                    btnStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-10 rounded-xl text-xs flex items-center justify-center transition border ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend Summary */}
              <div className="space-y-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Answered
                  </span>
                  <span className="font-bold text-emerald-400">{answeredCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Flagged for Review
                  </span>
                  <span className="font-bold text-amber-400">{flaggedCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span> Unanswered
                  </span>
                  <span className="font-bold text-gray-400">{totalQCount - answeredCount}</span>
                </div>
              </div>
            </div>

            {/* Bottom Proctoring Status Badge */}
            <div className="pt-4 border-t border-slate-800">
              <div className="bg-slate-950 p-3 rounded-2xl border border-purple-500/20 text-center">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                  <i className="fas fa-user-shield text-purple-400"></i> Proctoring Monitor
                </div>
                <div className="text-xs text-gray-300">
                  Violations: <strong className={violationsCount > 0 ? "text-amber-400" : "text-emerald-400"}>{violationsCount} / 3 Strikes</strong>
                </div>
              </div>
            </div>

          </aside>
        )}

      </div>

      {/* SECURITY VIOLATION LOCKDOWN MODAL ALERT */}
      {showViolationModal && !submittedRef.current && !isSubmitted && !examResult && !isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-pulse">
          <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-rose-500/40">
              <i className="fas fa-shield-virus animate-bounce"></i>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              SECURITY LOCKDOWN VIOLATION DETECTED
            </h3>

            <p className="text-rose-300 text-sm font-semibold mb-4 leading-relaxed">
              {violationMessage}
            </p>

            <div className="bg-rose-950/40 border border-rose-500/30 p-3 rounded-2xl mb-6 text-xs text-rose-200 font-bold">
              Warning Counter: <span className="text-rose-400 text-base font-black">{violationsCount} / 3 Strikes</span>
              <div className="text-[10px] text-rose-300/80 font-normal mt-1">
                Reaching 3 warnings auto-terminates and submits your exam immediately!
              </div>
            </div>

            {violationsCount < 3 ? (
              <button
                onClick={reenterFullscreen}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold rounded-xl shadow-lg uppercase text-xs tracking-wider"
              >
                Re-Enter Secured Fullscreen Mode
              </button>
            ) : (
              <div className="text-xs font-bold text-rose-400 animate-pulse">
                Maximum violation limit reached. Auto-submitting examination...
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION SUBMIT MODAL */}
      {showConfirmSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 border border-emerald-500/30">
              <i className="fas fa-paper-plane"></i>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Ready to Finish & Submit?
            </h3>

            <p className="text-gray-300 text-sm mb-6">
              You have answered <strong className="text-emerald-400">{answeredCount}</strong> out of <strong>{totalQCount}</strong> questions.
              {flaggedCount > 0 && <span className="block text-amber-400 font-bold mt-1">Warning: {flaggedCount} questions are still flagged for review!</span>}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmSubmitModal(false)}
                className="flex-1 py-3 bg-slate-800 text-gray-300 rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                Continue Exam
              </button>

              <button
                onClick={() => handleFinalSubmit(false)}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-extrabold hover:from-emerald-500 uppercase tracking-wider shadow-lg"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
