import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getCurrentStudent, fetchAllUserEnrollments } from '../../services/enrollmentService';
import { getStudentOrgDetails } from '../../config/tenantConfig';
import { getActiveExamsForStudent, getLocalExamHistory, resolveStudentBranchFE, resolveStudentYearFE } from '../../services/examService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const orgDetails = getStudentOrgDetails();
  const currentStudent = getCurrentStudent();

  // Load user data from localStorage
  const [userObj, setUserObj] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : {};
    } catch (e) {
      return {};
    }
  });

  // State for editable Email ID
  const [emailInput, setEmailInput] = useState(currentStudent.email || '');
  const [isEditingEmail, setIsEditingEmail] = useState(false); // Default: READ ONLY MODE
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);

  // State for real Active Exams
  const [activeExamsList, setActiveExamsList] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    loadEnrollmentsStats();
    loadActiveExams();
  }, []);

  const loadEnrollmentsStats = async () => {
    const records = await fetchAllUserEnrollments();
    if (Array.isArray(records)) {
      setEnrollmentsCount(records.length);
    }
  };

  const loadActiveExams = async () => {
    setLoadingExams(true);
    try {
      const branch = resolveStudentBranchFE(currentStudent.branch || currentStudent.username || currentStudent.email || '');
      const year = resolveStudentYearFE(currentStudent);
      const allExams = await getActiveExamsForStudent(branch, year);
      const history = await getLocalExamHistory();
      const completedIds = new Set((history || []).map((h) => h.examId));

      // Filter strictly ACTIVE exams that student hasn't completed
      const liveActiveExams = (Array.isArray(allExams) ? allExams : []).filter(
        (e) => e.status === 'active' && !completedIds.has(e.id || e._id)
      );
      setActiveExamsList(liveActiveExams);
    } catch (e) {
      setActiveExamsList([]);
    } finally {
      setLoadingExams(false);
    }
  };

  // Helper to format academic year label cleanly
  const getYearLabel = (yr) => {
    const yStr = String(yr || '1').trim();
    if (yStr === '1') return '1st Year (I Year)';
    if (yStr === '2') return '2nd Year (II Year)';
    if (yStr === '3') return '3rd Year (III Year)';
    if (yStr === '4') return '4th Year (IV Year)';
    return `${yStr} Year`;
  };

  // Helper to format branch label cleanly
  const getBranchLabel = (br) => {
    const bStr = String(br || 'ECE').toUpperCase().trim();
    const branchMap = {
      'CSE': 'Computer Science & Engineering (CSE)',
      'ECE': 'Electronics & Communication Engineering (ECE)',
      'EEE': 'Electrical & Electronics Engineering (EEE)',
      'MECH': 'Mechanical Engineering (MECH)',
      'CIVIL': 'Civil Engineering (CIVIL)',
      'IT': 'Information Technology (IT)',
      'AIML': 'AI & Machine Learning (AIML)',
      'AIDS': 'AI & Data Science (AIDS)',
      'CSM': 'CSE - Artificial Intelligence & ML (CSM)'
    };
    return branchMap[bStr] || `${bStr} Branch`;
  };

  // Handle email save action
  const handleSaveEmail = (e) => {
    e.preventDefault();
    setSaveSuccessMsg('');
    setSaveErrorMsg('');

    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setSaveErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser = {
        ...userObj,
        email: trimmedEmail
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserObj(updatedUser);
      setSaveSuccessMsg('Email address updated successfully!');
      setIsEditingEmail(false); // Switch back to Read-only mode after save

      setTimeout(() => {
        setSaveSuccessMsg('');
      }, 4000);
    } catch (err) {
      setSaveErrorMsg('Failed to update email address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEmailEdit = () => {
    setEmailInput(currentStudent.email || '');
    setIsEditingEmail(false);
    setSaveErrorMsg('');
  };

  const studentInitials = (currentStudent.fullname || currentStudent.username || 'LK')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f3f5fa] text-slate-800 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 container mx-auto max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ========================================================= */}
          {/* LEFT COLUMN: HERO, QUICK STATS, AND FORM DETAILS (8 COLS) */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. HERO STUDENT CARD (SEAMLESS IMAGE BLEND & MASK GRADIENT) */}
            <div className="bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_12px_40px_-15px_rgba(99,102,241,0.07)] border border-purple-100/80 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[190px]">
              
              {/* Ambient Radial Background Glows inside Card */}
              <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-gradient-to-br from-purple-200/50 via-indigo-100/40 to-blue-200/30 rounded-full blur-3xl pointer-events-none z-0"></div>
              <div className="absolute right-1/3 top-0 w-64 h-64 bg-purple-100/40 rounded-full blur-2xl pointer-events-none z-0"></div>

              {/* Integrated 3D Student Boy Banner Artwork with Soft Fade Mask */}
              <div 
                className="absolute right-0 top-0 bottom-0 h-full w-[48%] sm:w-[46%] pointer-events-none z-0 hidden sm:block overflow-hidden"
                style={{
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)'
                }}
              >
                <img
                  src="/assets/hero_3d_student_learning.jpg"
                  alt="Exact 3D Student Boy Banner"
                  className="w-full h-full object-cover object-right mix-blend-multiply opacity-95 transform hover:scale-105 transition duration-500"
                />
              </div>

              {/* Left Identity Content */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left max-w-full sm:max-w-[62%] lg:max-w-[60%] pr-0 sm:pr-2">
                
                {/* Student Avatar Box */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] bg-gradient-to-br from-[#7c3aed] via-[#6366f1] to-[#2563eb] shadow-lg shadow-purple-500/15 flex items-center justify-center text-white font-black text-3xl tracking-widest">
                    {studentInitials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-[#10b981] border-[3px] border-white rounded-full flex items-center justify-center shadow-sm"></div>
                </div>

                {/* Identity Info & Badges */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                    {/* Badge 1: Verified Student */}
                    <span className="bg-[#d1fae5] text-[#059669] font-bold text-xs px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-[#a7f3d0]/60">
                      <i className="fas fa-check-circle text-xs text-[#059669]"></i>
                      Verified Student
                    </span>

                    {/* Badge 2: Roll Number */}
                    <span className="bg-[#f3e8ff] text-[#7e22ce] font-bold text-xs px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-[#e9d5ff]/60">
                      <i className="fas fa-id-card text-xs text-[#7e22ce]"></i>
                      Roll: {currentStudent.username}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight my-0.5 truncate">
                    {currentStudent.fullname}
                  </h1>

                  <p className="text-xs sm:text-sm font-semibold text-[#64748b] leading-snug">
                    {orgDetails.name} ({orgDetails.code}) • {getBranchLabel(currentStudent.branch)}
                  </p>

                  {/* Year Pill & Dashboard Button side by side */}
                  <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#f3e8ff] text-[#7e22ce] text-xs font-extrabold px-3 py-1 rounded-full border border-[#e9d5ff]/60">
                      <i className="fas fa-layer-group text-[10px] text-[#7e22ce]"></i>
                      {getYearLabel(currentStudent.year)}
                    </span>

                    {/* Dashboard Button next to Year label */}
                    <button
                      onClick={() => navigate('/dash')}
                      className="px-4 py-1 bg-gradient-to-r from-[#6366f1] to-[#3b82f6] hover:from-[#4f46e5] hover:to-[#2563eb] text-white font-extrabold text-xs rounded-full shadow-sm hover:shadow-indigo-500/20 transform hover:scale-105 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fas fa-arrow-left text-[10px]"></i>
                      Dashboard
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* 2. 4 QUICK STAT CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Stat 1: Roll Number (Pale Blue) */}
              <div className="bg-[#f0f9ff] p-4 sm:p-5 rounded-2xl border border-[#e0f2fe] shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                  <i className="fas fa-id-card"></i>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">Roll Number</div>
                  <div className="text-base font-black text-[#0f172a] font-mono tracking-tight">{currentStudent.username}</div>
                </div>
              </div>

              {/* Stat 2: College Code (Pale Purple) */}
              <div className="bg-[#f5f3ff] p-4 sm:p-5 rounded-2xl border border-[#ede9fe] shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                  <i className="fas fa-university"></i>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">College Code</div>
                  <div className="text-base font-black text-[#0f172a] uppercase tracking-tight">{orgDetails.code}</div>
                </div>
              </div>

              {/* Stat 3: Enrolled Courses (Pale Rose/Pink) */}
              <div className="bg-[#fff1f2] p-4 sm:p-5 rounded-2xl border border-[#ffe4e6] shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#ffe4e6] text-[#e11d48] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">Enrolled Courses</div>
                  <div className="text-base font-black text-[#0f172a] tracking-tight">{enrollmentsCount} Active</div>
                </div>
              </div>

              {/* Stat 4: Account Status (Pale Mint Green) */}
              <div className="bg-[#ecfdf5] p-4 sm:p-5 rounded-2xl border border-[#a7f3d0] shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#d1fae5] text-[#059669] flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b]">Account Status</div>
                  <div className="text-base font-black text-[#10b981] tracking-tight">Active Student</div>
                </div>
              </div>

            </div>

            {/* 3. STUDENT ACADEMIC RECORD & PERSONAL INFORMATION CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                    <i className="fas fa-layer-group"></i>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Student Academic Record & Personal Information
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      View your institutional record. Click edit icon to modify email address.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingEmail(true)}
                  className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs rounded-xl border border-purple-300 flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition cursor-pointer"
                >
                  <i className="fas fa-pen text-xs"></i>
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Save Alert Messages */}
              {saveSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in">
                  <i className="fas fa-check-circle text-base text-emerald-500"></i>
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {saveErrorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in">
                  <i className="fas fa-exclamation-circle text-base text-red-500"></i>
                  <span>{saveErrorMsg}</span>
                </div>
              )}

              {/* Form Grid */}
              <form onSubmit={handleSaveEmail} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Field 1: Roll Number (Read-only) */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                      <i className="fas fa-id-badge text-indigo-500 text-xs"></i>
                      <span>1. ROLL NUMBER / STUDENT ID</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentStudent.username}
                        readOnly
                        className="w-full bg-slate-50/80 text-slate-700 font-mono font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none cursor-not-allowed text-xs sm:text-sm"
                      />
                      <i className="fas fa-lock absolute right-4 top-3.5 text-slate-400 text-xs"></i>
                    </div>
                  </div>

                  {/* Field 2: Full Name (Read-only) */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                      <i className="fas fa-user text-indigo-500 text-xs"></i>
                      <span>2. FULL NAME</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={currentStudent.fullname}
                        readOnly
                        className="w-full bg-slate-50/80 text-slate-700 font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none cursor-not-allowed text-xs sm:text-sm"
                      />
                      <i className="fas fa-lock absolute right-4 top-3.5 text-slate-400 text-xs"></i>
                    </div>
                  </div>

                  {/* Field 3: Email Address (DEFAULT READ-ONLY, EDITABLE ON CLICK) */}
                  <div className={`md:col-span-2 p-5 rounded-2xl border transition-all duration-300 space-y-3 ${
                    isEditingEmail 
                      ? 'bg-purple-50/90 border-purple-300 ring-2 ring-purple-400/30' 
                      : 'bg-purple-50/40 border-purple-100'
                  }`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-2">
                        <i className="fas fa-envelope text-purple-600"></i>
                        <span>3. OFFICIAL EMAIL ADDRESS</span>
                      </label>
                      
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isEditingEmail 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                          : 'bg-purple-100 text-purple-700 border-purple-200'
                      }`}>
                        {isEditingEmail ? '✏️ EDITING MODE' : '🔒 READ ONLY'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          readOnly={!isEditingEmail}
                          placeholder="Enter your email address..."
                          className={`w-full font-semibold px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all ${
                            isEditingEmail 
                              ? 'bg-white text-slate-900 border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner' 
                              : 'bg-slate-100/90 text-slate-700 border-slate-200 cursor-not-allowed'
                          }`}
                        />
                        
                        {/* Edit Pencil Icon */}
                        {!isEditingEmail && (
                          <button
                            type="button"
                            onClick={() => setIsEditingEmail(true)}
                            className="absolute right-3 top-2.5 p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            title="Click to edit email address"
                          >
                            <i className="fas fa-pen text-xs"></i>
                            <span>Edit</span>
                          </button>
                        )}

                        {isEditingEmail && (
                          <i className="fas fa-pen absolute right-4 top-3.5 text-purple-500 text-xs pointer-events-none"></i>
                        )}
                      </div>

                      {/* Action buttons when in editing mode */}
                      {isEditingEmail ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSaving ? (
                              <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check"></i>
                                <span>Update Email</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEmailEdit}
                            className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditingEmail(true)}
                          className="px-5 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-extrabold text-xs rounded-xl border border-purple-200 transition flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                        >
                          <i className="fas fa-pen text-xs"></i>
                          <span>Edit Email Address</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] font-medium text-slate-500">
                      {isEditingEmail 
                        ? 'Make your changes above and click Update Email to persist in your user profile storage.' 
                        : 'Email address is locked in read-only state. Click the Edit button or pencil icon to make changes.'}
                    </p>
                  </div>

                  {/* Field 4: College Code (Read-only) */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                      <i className="fas fa-university text-indigo-500 text-xs"></i>
                      <span>4. COLLEGE CODE</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orgDetails.code.toUpperCase()}
                        readOnly
                        className="w-full bg-slate-50/80 text-slate-700 font-mono font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none cursor-not-allowed text-xs sm:text-sm"
                      />
                      <i className="fas fa-lock absolute right-4 top-3.5 text-slate-400 text-xs"></i>
                    </div>
                  </div>

                  {/* Field 5: College Name (Read-only) */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                      <i className="fas fa-building text-indigo-500 text-xs"></i>
                      <span>5. COLLEGE / INSTITUTION NAME</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orgDetails.name}
                        readOnly
                        className="w-full bg-slate-50/80 text-slate-700 font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none cursor-not-allowed text-xs sm:text-sm"
                      />
                      <i className="fas fa-lock absolute right-4 top-3.5 text-slate-400 text-xs"></i>
                    </div>
                  </div>

                  {/* Field 6: Academic Year (Read-only) */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                      <i className="fas fa-calendar text-indigo-500 text-xs"></i>
                      <span>6. ACADEMIC YEAR</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={getYearLabel(currentStudent.year)}
                        readOnly
                        className="w-full bg-slate-50/80 text-slate-700 font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none cursor-not-allowed text-xs sm:text-sm"
                      />
                      <i className="fas fa-lock absolute right-4 top-3.5 text-slate-400 text-xs"></i>
                    </div>
                  </div>

                  {/* Field 7: Branch (Read-only) */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                      <i className="fas fa-code-branch text-indigo-500 text-xs"></i>
                      <span>7. BRANCH / DEPARTMENT</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={getBranchLabel(currentStudent.branch)}
                        readOnly
                        className="w-full bg-slate-50/80 text-slate-700 font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none cursor-not-allowed text-xs sm:text-sm"
                      />
                      <i className="fas fa-lock absolute right-4 top-3.5 text-slate-400 text-xs"></i>
                    </div>
                  </div>

                </div>
              </form>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: MOTIVATION BANNER, QUICK ACTIONS & EXAMS (4 COLS) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. MOTIVATION CARD */}
            <div className="bg-gradient-to-br from-[#f5f3ff] via-[#eff6ff] to-[#fdf2f8] rounded-3xl p-6 border border-[#e0e7ff] shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="text-[11px] font-black tracking-widest text-[#7c3aed] uppercase mb-1">
                  KEEP GOING
                </div>

                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 max-w-[70%]">
                  A <span className="bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] bg-clip-text text-transparent">Brighter</span> Future Awaits!
                </h3>

                <p className="text-xs text-slate-600 font-semibold mb-4 max-w-[65%]">
                  Stay consistent, keep learning and achieve your dreams.
                </p>
              </div>

              {/* Clean 3D Graduation Cap Image */}
              <div className="absolute right-1 top-2 w-28 h-28 sm:w-36 sm:h-36 overflow-hidden rounded-2xl pointer-events-none">
                <img
                  src="/assets/brighter_future_3d.jpg"
                  alt="3D Graduation Cap"
                  className="w-full h-full object-contain mix-blend-multiply transform hover:scale-105 transition duration-300"
                />
              </div>

              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl text-xs font-bold text-slate-700 border border-[#e0e7ff] shadow-sm flex items-start gap-2.5 z-10 mt-2">
                <i className="fas fa-quote-left text-purple-400 text-sm flex-shrink-0 mt-0.5"></i>
                <p className="italic">
                  "Success is the sum of small efforts, repeated day in and day out."
                </p>
              </div>
            </div>

            {/* 2. MY QUICK ACTIONS CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <i className="fas fa-bolt text-amber-500"></i>
                My Quick Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                
                {/* Action 1: View Examinations */}
                <div
                  onClick={() => navigate('/examinations')}
                  className="bg-pink-50/80 hover:bg-pink-100/90 border border-pink-100 p-3.5 rounded-2xl flex items-center justify-between group cursor-pointer transition duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-sm flex-shrink-0">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition line-clamp-2">
                      View Examinations
                    </span>
                  </div>
                  <i className="fas fa-arrow-right text-pink-400 text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                </div>

                {/* Action 2: Goto Materials */}
                <div
                  onClick={() => navigate('/materials')}
                  className="bg-blue-50/80 hover:bg-blue-100/90 border border-blue-100 p-3.5 rounded-2xl flex items-center justify-between group cursor-pointer transition duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">
                      <i className="fas fa-folder-open"></i>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-2">
                      Goto Materials
                    </span>
                  </div>
                  <i className="fas fa-arrow-right text-blue-400 text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                </div>

                {/* Action 3: Access Courses */}
                <div
                  onClick={() => navigate('/courses')}
                  className="bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-100 p-3.5 rounded-2xl flex items-center justify-between group cursor-pointer transition duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
                      <i className="fas fa-book-reader"></i>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition line-clamp-2">
                      Access Courses
                    </span>
                  </div>
                  <i className="fas fa-arrow-right text-emerald-400 text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                </div>

                {/* Action 4: Access Online Compilers */}
                <div
                  onClick={() => navigate('/compilers')}
                  className="bg-amber-50/80 hover:bg-amber-100/90 border border-amber-100 p-3.5 rounded-2xl flex items-center justify-between group cursor-pointer transition duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm flex-shrink-0">
                      <i className="fas fa-code"></i>
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition line-clamp-2">
                      Access Online Compilers
                    </span>
                  </div>
                  <i className="fas fa-arrow-right text-amber-400 text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                </div>

              </div>
            </div>

            {/* 3. UPCOMING ACTIVITIES CARD (REAL ACTIVE EXAMINATIONS ONLY) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <i className="fas fa-calendar-alt text-purple-600"></i>
                  Upcoming Activities
                </h3>
                <button
                  onClick={() => navigate('/examinations')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>

              {/* Real Active Exam Activities list */}
              {loadingExams ? (
                <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <i className="fas fa-circle-notch fa-spin text-purple-600"></i>
                  <span>Loading active examinations...</span>
                </div>
              ) : activeExamsList.length === 0 ? (
                <div className="py-6 px-4 bg-purple-50/50 rounded-2xl border border-purple-100 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-base">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">No Active Exams Right Now</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All scheduled examinations are up to date! Check back soon for new assessments.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeExamsList.map((exam) => (
                    <div
                      key={exam.id || exam._id}
                      onClick={() => navigate('/examinations')}
                      className="p-3.5 bg-slate-50/80 hover:bg-purple-50/50 rounded-2xl border border-slate-100 hover:border-purple-200 transition cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-base flex-shrink-0 shadow-sm group-hover:scale-105 transition">
                          <i className="fas fa-shield-alt"></i>
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-1 group-hover:text-purple-700 transition">
                            {exam.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                            {exam.subject || 'Examination'} • {exam.durationMinutes || 60} Mins • {exam.totalMarks || 100} Marks
                          </p>
                        </div>
                      </div>

                      <div className="px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 flex-shrink-0 text-center font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>LIVE NOW</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
