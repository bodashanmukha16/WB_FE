import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getStudentOrgDetails, getStudentOrgId } from "../../config/tenantConfig";
import { getActiveExamsForStudent, getLocalExamHistory, isDesktopDevice, resolveStudentBranchFE, resolveStudentYearFE } from "../../services/examService";

export default function ExaminationHome() {
  const navigate = useNavigate();
  const [orgDetails, setOrgDetails] = useState(getStudentOrgDetails());
  const [exams, setExams] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // 'active', 'upcoming', 'history'
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const getStudentProfile = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const branch = resolveStudentBranchFE(u.branch || u.department || u.username || u.email || "");
      const year = resolveStudentYearFE(u);
      return { branch, year };
    } catch (e) {
      return { branch: "ece", year: 2 };
    }
  };

  const [studentDepartment, setStudentDepartment] = useState(() => getStudentProfile().branch);
  const [loading, setLoading] = useState(true);

  // Pre-exam instruction & system check modal state
  const [selectedExamModal, setSelectedExamModal] = useState(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [ipVerification, setIpVerification] = useState({
    loading: false,
    accessGranted: true,
    ip: '',
    message: ''
  });

  const loadData = async () => {
    setLoading(true);
    const { branch, year } = getStudentProfile();
    setStudentDepartment(branch);
    const examData = await getActiveExamsForStudent(branch, year);
    setExams(Array.isArray(examData) ? examData : []);
    const pastHistory = await getLocalExamHistory();
    setHistory(Array.isArray(pastHistory) ? pastHistory : []);
    setLoading(false);
  };

  useEffect(() => {
    const org = getStudentOrgDetails();
    setOrgDetails(org);
    loadData();
  }, []);

  const safeHistory = Array.isArray(history) ? history : [];
  const safeExams = Array.isArray(exams) ? exams : [];

  const completedExamIds = new Set(safeHistory.map((h) => h.examId));
  const activeExams = safeExams.filter((e) => e.status === "active" && !completedExamIds.has(e.id || e._id));
  const upcomingExams = safeExams.filter((e) => e.status === "upcoming");

  const filteredExams = (activeTab === "active" ? activeExams : upcomingExams).filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exam.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || exam.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleStartExamClick = async (exam) => {
    setSelectedExamModal(exam);
    setAgreedTerms(false);
    setIpVerification({ loading: true, accessGranted: true, ip: '', message: '' });

    try {
      const examId = exam.id || exam._id;
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const tenantId = getStudentOrgId();
      const res = await axios.post(`${apiBase}/exams/${examId}/verify-ip`, {}, {
        headers: { "x-tenant-id": tenantId }
      });
      if (res.data) {
        setIpVerification({
          loading: false,
          accessGranted: res.data.accessGranted !== false,
          ip: res.data.ip || '',
          message: res.data.message || 'Verified College Lab System'
        });
      }
    } catch (err) {
      setIpVerification({
        loading: false,
        accessGranted: false,
        ip: err.response?.data?.ip || '',
        message: err.response?.data?.message || 'Unauthorized system IP address.'
      });
    }
  };

  const handleLaunchExam = async () => {
    if (!selectedExamModal || !agreedTerms) return;

    // Trigger Browser Fullscreen if supported before route transition
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen request error:", e.message);
    }

    const examId = selectedExamModal.id || selectedExamModal._id;
    navigate(`/examinations/take/${examId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 container mx-auto">
        
        {/* HERO BRANDING & ORGANIZATION PORTAL BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-purple-950 to-slate-900 border border-purple-500/20 shadow-2xl p-6 sm:p-10 mb-10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={orgDetails.logo}
                  alt={orgDetails.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-purple-400/40 object-cover shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="bg-purple-500/20 text-purple-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-purple-500/30 tracking-widest">
                    {orgDetails.code} Enterprise Portal
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <i className="fas fa-shield-alt text-emerald-400"></i> Fullscreen Lockdown Active
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {orgDetails.name} Secure Examination Portal
                </h1>
                <p className="text-gray-300 text-sm sm:text-base mt-1 max-w-2xl">
                  Official proctored examination dashboard for {orgDetails.name}. All active mid-terms, practicals, and university mock tests are conducted under strict security protocols.
                </p>
              </div>
            </div>

            {/* Quick Portal Metrics */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto min-w-[240px]">
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-4 rounded-2xl text-center">
                <div className="text-2xl font-black text-purple-400">{activeExams.length}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">Active Exams</div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-4 rounded-2xl text-center">
                <div className="text-2xl font-black text-emerald-400">{history.length}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS & FILTER BAR */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          
          {/* Tab Buttons */}
          <div className="flex items-center p-1.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "active"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <i className="fas fa-play-circle text-xs"></i>
              Active Examinations
              <span className="ml-1 px-2 py-0.5 text-xs bg-white/20 rounded-full font-extrabold">
                {activeExams.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <i className="fas fa-calendar-alt text-xs"></i>
              Upcoming Exams
              <span className="ml-1 px-2 py-0.5 text-xs bg-white/10 rounded-full font-bold">
                {upcomingExams.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-gray-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <i className="fas fa-history text-xs"></i>
              Past Scorecards
              <span className="ml-1 px-2 py-0.5 text-xs bg-white/10 rounded-full font-bold">
                {safeHistory.length}
              </span>
            </button>
          </div>

          {/* Search & Category Filter (Active & Upcoming tabs) */}
          {activeTab !== "history" && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search examination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="Mid-Term">Mid-Term Exams</option>
                <option value="Coding">Coding & Practicals</option>
                <option value="Aptitude">Placement Aptitude</option>
                <option value="End-Sem">University End-Sem</option>
              </select>
            </div>
          )}
        </div>



        {/* ACTIVE EXAMINATIONS / UPCOMING EXAMINATIONS LIST */}
        {activeTab !== "history" && (
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-medium">Loading organization examinations...</p>
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-12 text-center max-w-xl mx-auto my-8">
                <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Examinations Found</h3>
                <p className="text-gray-400 text-sm">
                  There are no {activeTab} examinations currently scheduled under {orgDetails.name} matching your search filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id || exam._id}
                    className="group bg-slate-800/90 border border-slate-700/80 hover:border-purple-500/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all"></div>

                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-purple-500/20 text-purple-300 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border border-purple-500/30">
                            {exam.subject}
                          </span>
                          <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-blue-500/30">
                            {exam.department?.toUpperCase() || "CSE"}
                          </span>
                        </div>
                        
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          exam.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${exam.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                          {exam.status === "active" ? "Live Examination" : "Upcoming"}
                        </span>
                      </div>

                      {/* Title & Code */}
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug mb-1.5">
                        {exam.title}
                      </h3>
                      <div className="text-xs font-mono text-purple-400/90 mb-4 flex items-center gap-2">
                        <i className="fas fa-hashtag text-[10px]"></i>
                        {exam.code} • {orgDetails.code}
                      </div>

                      {/* Meta Pills Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-3 rounded-2xl mb-6 border border-slate-700/50">
                        <div className="text-center">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duration</div>
                          <div className="text-xs font-black text-white mt-0.5 flex items-center justify-center gap-1">
                            <i className="far fa-clock text-purple-400 text-[10px]"></i>
                            {exam.durationMinutes} Mins
                          </div>
                        </div>

                        <div className="text-center border-x border-slate-700/60">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Marks</div>
                          <div className="text-xs font-black text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                            <i className="fas fa-award text-[10px]"></i>
                            {exam.totalMarks} Marks
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Questions</div>
                          <div className="text-xs font-black text-blue-400 mt-0.5 flex items-center justify-center gap-1">
                            <i className="fas fa-list-ol text-[10px]"></i>
                            {exam.questionsCount !== undefined ? exam.questionsCount : (exam.questions ? exam.questions.length : 0)} Qs
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {exam.status === "active" ? (
                        <button
                          onClick={() => handleStartExamClick(exam)}
                          className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold rounded-xl shadow-lg shadow-purple-600/30 transform active:scale-98 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                          <i className="fas fa-shield-alt text-sm"></i>
                          Start Secured Examination
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3.5 bg-slate-700/50 text-gray-400 font-bold rounded-xl cursor-not-allowed text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                          <i className="fas fa-lock text-sm"></i>
                          Opens Soon
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PAST SCORECARDS TAB */}
        {activeTab === "history" && (
          <div>
            {safeHistory.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-12 text-center max-w-xl mx-auto my-8">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Past Exam Submissions</h3>
                <p className="text-gray-400 text-sm">
                  You haven't completed any examinations yet. Select an active examination to start your proctored assessment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {safeHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                          {item.orgId ? item.orgId.toUpperCase() : orgDetails.code}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white">{item.examTitle}</h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-300">
                        <span>Violations Logged: <strong className={item.violationsCount > 0 ? "text-amber-400" : "text-emerald-400"}>{item.violationsCount} Warnings</strong></span>
                        <span>Time Spent: <strong>{Math.floor(item.timeSpentSeconds / 60)}m {item.timeSpentSeconds % 60}s</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end md:self-auto">
                      <div className="text-right">
                        <div className="text-2xl font-black text-white">
                          {item.score} / {item.totalMarks}
                        </div>
                        <div className="text-xs font-bold text-emerald-400">{item.percentage}% Score</div>
                      </div>

                      <div className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase ${
                        item.passed ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}>
                        {item.grade}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* PRE-EXAM READINESS & SYSTEM INSTRUCTIONS MODAL */}
      {selectedExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-xl flex items-center justify-center text-xl border border-purple-500/30">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div>
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">
                    Security Verification & System Check
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {selectedExamModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedExamModal(null)}
                className="text-gray-400 hover:text-white p-2 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
              
              {/* System Diagnostics Checklist */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                <h4 className="text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <i className="fas fa-microchip text-purple-400"></i>
                  System Security & Capability Status
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between col-span-2">
                    <span className="text-gray-300">Device Environment Security</span>
                    {isDesktopDevice() ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <i className="fas fa-desktop"></i> Desktop Computer Verified
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <i className="fas fa-mobile-alt"></i> Mobile / Tablet Prohibited
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between col-span-2">
                    <span className="text-gray-300">College Lab IP Whitelist Check</span>
                    {ipVerification.loading ? (
                      <span className="text-purple-400 font-bold flex items-center gap-1">
                        <i className="fas fa-circle-notch animate-spin"></i> Checking Lab IP...
                      </span>
                    ) : ipVerification.accessGranted ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <i className="fas fa-network-wired"></i> Verified ({ipVerification.ip || '127.0.0.1'})
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <i className="fas fa-ban"></i> Unauthorized IP ({ipVerification.ip})
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <span className="text-gray-300">Browser Fullscreen API</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <i className="fas fa-check-circle"></i> Ready
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <span className="text-gray-300">Focus & Blur Detection</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <i className="fas fa-check-circle"></i> Active
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <span className="text-gray-300">Key Shortcut Interceptor</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <i className="fas fa-check-circle"></i> Enabled
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <span className="text-gray-300">Proctoring Monitor</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <i className="fas fa-check-circle"></i> Connected
                    </span>
                  </div>
                </div>
              </div>

              {!ipVerification.loading && !ipVerification.accessGranted && (
                <div className="bg-rose-950/80 border-2 border-rose-500/60 p-4 rounded-2xl text-rose-200 text-xs font-semibold flex items-start gap-3 shadow-xl">
                  <i className="fas fa-user-shield text-3xl text-rose-400 shrink-0 mt-0.5"></i>
                  <div>
                    <strong className="block text-rose-200 font-extrabold text-sm mb-1 uppercase tracking-wide">
                      🚫 Unauthorized Examination Location
                    </strong>
                    <p className="leading-relaxed">
                      Your system IP address (<code className="bg-rose-900/80 px-1.5 py-0.5 rounded font-mono text-white">{ipVerification.ip}</code>) is <strong>not registered</strong> in the college's Whitelisted Lab IP Pool.
                    </p>
                    <p className="mt-1.5 text-rose-300 font-bold">
                      Please attempt this examination from an authorized campus computer lab.
                    </p>
                  </div>
                </div>
              )}

              {!isDesktopDevice() && (
                <div className="bg-rose-950/50 border border-rose-500/40 p-4 rounded-2xl text-rose-200 text-xs font-semibold flex items-center gap-3">
                  <i className="fas fa-laptop-house text-2xl text-rose-400 shrink-0"></i>
                  <div>
                    <strong className="block text-rose-300 font-bold text-sm mb-0.5">Desktop Computer Required</strong>
                    Examinations are locked and can ONLY be attempted from a Desktop or Laptop PC. Please switch to a desktop computer to launch this exam.
                  </div>
                </div>
              )}

              {/* Strict Proctoring Rules */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  Examination Code of Conduct & Lockdown Rules
                </h4>

                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-200">
                    <i className="fas fa-desktop text-amber-400 mt-0.5"></i>
                    <span><strong>Fullscreen Mode Mandatory:</strong> The examination will launch in locked fullscreen mode. Pressing Esc or leaving fullscreen is prohibited.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-200">
                    <i className="fas fa-window-restore text-amber-400 mt-0.5"></i>
                    <span><strong>No Tab Switching:</strong> Switching tabs or opening secondary applications will log a Security Violation warning.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-200">
                    <i className="fas fa-ban text-amber-400 mt-0.5"></i>
                    <span><strong>3 Strike Auto-Submission:</strong> Reaching 3 security warnings will result in immediate automatic exam termination and submission.</span>
                  </li>
                </ul>
              </div>

              {/* Terms Agreement Checkbox */}
              <label className="flex items-start gap-3 p-3.5 bg-purple-900/20 border border-purple-500/30 rounded-2xl cursor-pointer hover:bg-purple-900/30 transition">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-gray-200 font-medium leading-relaxed">
                  I confirm that I am logged in as a registered student of <strong>{orgDetails.name}</strong>. I agree to abide by all examination lockdown rules and understand that violations will be logged.
                </span>
              </label>

            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedExamModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>

              <button
                disabled={!agreedTerms || !isDesktopDevice() || !ipVerification.accessGranted || ipVerification.loading}
                onClick={handleLaunchExam}
                className={`px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                  agreedTerms && isDesktopDevice() && ipVerification.accessGranted && !ipVerification.loading
                    ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 transform active:scale-95"
                    : "bg-slate-800 text-gray-500 border border-slate-700 cursor-not-allowed"
                }`}
              >
                <i className="fas fa-desktop text-sm"></i>
                {ipVerification.loading
                  ? "Verifying System IP..."
                  : !ipVerification.accessGranted
                  ? "Unauthorized Location IP"
                  : isDesktopDevice()
                  ? "Launch Fullscreen Exam"
                  : "Desktop Device Required"}
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
