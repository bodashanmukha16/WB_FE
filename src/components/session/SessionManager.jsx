import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldAlert, Clock, LogOut, RefreshCw, AlertTriangle } from "lucide-react";

// Configuration for Session Idle Timeouts (in milliseconds)
const IDLE_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes total
const WARNING_BEFORE_MS = 5 * 60 * 1000; // Show warning 5 minutes before logout
const WARNING_THRESHOLD_MS = IDLE_TIMEOUT_MS - WARNING_BEFORE_MS; // 55 minutes
const STORAGE_KEY = "workbench_last_activity";

export default function SessionManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 mins in seconds
  const lastActivityRef = useRef(Date.now());
  const intervalRef = useRef(null);

  // Check if token exists (user is authenticated)
  const token = localStorage.getItem("token");

  // Helper to record activity timestamp locally and across tabs
  const updateActivity = useCallback(() => {
    const now = Date.now();
    // Throttle local state updates to at most once per 2 seconds
    if (now - lastActivityRef.current > 2000) {
      lastActivityRef.current = now;
      try {
        localStorage.setItem(STORAGE_KEY, now.toString());
      } catch (e) {
        // Fallback if localStorage quota or privacy mode issues occur
      }
      if (showWarningModal) {
        setShowWarningModal(false);
      }
    }
  }, [showWarningModal]);

  // Handle explicit session logout
  const handleLogout = useCallback((reason = "inactivity") => {
    setShowWarningModal(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    localStorage.clear();
    if (reason === "inactivity") {
      sessionStorage.setItem(
        "session_expired_msg",
        "Your session expired due to 60 minutes of inactivity. Please sign in again."
      );
    }
    navigate("/", { replace: true });
  }, [navigate]);

  // Listener for activity events across tabs
  useEffect(() => {
    if (!token) return;

    // Initialize activity timestamp if not present
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } else {
      const stored = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      if (stored > 0) {
        lastActivityRef.current = stored;
      }
    }

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click"
    ];

    const handleUserInteraction = () => {
      // Don't auto-reset timer if warning modal is active unless user explicitly clicks "Stay Logged In"
      if (!showWarningModal) {
        updateActivity();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { passive: true });
    });

    // Cross-tab sync via storage event
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const remoteTime = parseInt(e.newValue, 10);
        if (remoteTime > lastActivityRef.current) {
          lastActivityRef.current = remoteTime;
          if (showWarningModal) {
            setShowWarningModal(false);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token, showWarningModal, updateActivity]);

  // Periodic Idle Checker Interval (runs every second)
  useEffect(() => {
    if (!token) {
      setShowWarningModal(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const storedTime = parseInt(localStorage.getItem(STORAGE_KEY) || lastActivityRef.current.toString(), 10);
      const effectiveLastActivity = Math.max(lastActivityRef.current, storedTime);
      const idleTime = now - effectiveLastActivity;

      if (idleTime >= IDLE_TIMEOUT_MS) {
        // Exceeded 60 minutes -> Logout immediately
        handleLogout("inactivity");
      } else if (idleTime >= WARNING_THRESHOLD_MS) {
        // Between 55 and 60 minutes -> Show Warning Modal with dynamic countdown
        const remainingMs = IDLE_TIMEOUT_MS - idleTime;
        const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
        setSecondsRemaining(remainingSec);
        if (!showWarningModal) {
          setShowWarningModal(true);
        }
      } else {
        // Below 55 minutes -> Ensure warning modal is hidden
        if (showWarningModal) {
          setShowWarningModal(false);
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [token, showWarningModal, handleLogout]);

  // Manual reset from button click in warning modal
  const extendSession = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    try {
      localStorage.setItem(STORAGE_KEY, now.toString());
    } catch (e) {}
    setShowWarningModal(false);
  };

  // Helper to format remaining seconds as MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!token || !showWarningModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in p-4 font-sans">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-white text-center transform transition-all scale-100">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 shadow-inner">
          <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
          Session Timeout Warning
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          You have been inactive for <span className="text-purple-300 font-semibold">55 minutes</span>.
          For your security, your session will automatically log out in:
        </p>

        {/* Countdown Box */}
        <div className="bg-slate-950/70 border border-amber-500/40 rounded-2xl p-4 mb-6 shadow-inner">
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-amber-400 drop-shadow-md">
            {formatTime(secondsRemaining)}
          </div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 block">
            Minutes : Seconds
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={extendSession}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-purple-400/30 hover:scale-[1.02]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Stay Logged In</span>
          </button>

          <button
            onClick={() => handleLogout("manual")}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-slate-700/60"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log Out Now</span>
          </button>
        </div>

        {/* Footnote */}
        <p className="text-[10px] text-slate-500 mt-5">
          🔒 WorkBench Session Security Protocol
        </p>
      </div>
    </div>
  );
}
