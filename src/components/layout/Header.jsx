import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentOrgDetails } from "../../config/tenantConfig";
import { getCurrentStudent } from "../../services/enrollmentService";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [orgDetails, setOrgDetails] = useState(getStudentOrgDetails());
  const [currentStudent, setCurrentStudent] = useState(getCurrentStudent());
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateStudentInfo = () => {
      setOrgDetails(getStudentOrgDetails());
      setCurrentStudent(getCurrentStudent());
    };

    updateStudentInfo();

    window.addEventListener("userUpdated", updateStudentInfo);
    window.addEventListener("storage", updateStudentInfo);

    return () => {
      window.removeEventListener("userUpdated", updateStudentInfo);
      window.removeEventListener("storage", updateStudentInfo);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const doLogout = () => {
    setProfileDropdownOpen(false);
    localStorage.clear();
    navigate("/");
  };

  const studentInitials = (currentStudent.fullname || currentStudent.username || 'S')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 font-sans border-b border-gray-100">
      <div className="container mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">

          {/* BRAND LOGO & ORGANIZATION BADGE */}
          <div className="flex items-center space-x-3">
            
            {/* WorkBench Main Logo */}
            <div className="flex items-center space-x-2.5 home-btn-click cursor-pointer" onClick={() => navigate("/dash")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md transform hover:scale-105 transition duration-300 cursor-pointer">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight cursor-pointer">
                WorkBench
              </span>
            </div>

            {/* Logged in Student's College Organization Image & Badge */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l-2 border-gray-200/80">
              <div className="relative group">
                <img
                  src={orgDetails.logo}
                  alt={orgDetails.name}
                  className="w-9 h-9 rounded-full border-2 border-purple-500/50 object-cover shadow-md transform group-hover:scale-110 transition duration-300"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="hidden sm:block text-left">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block leading-none">
                  {orgDetails.code} Enterprise
                </span>
                <span className="text-xs font-extrabold text-gray-900 line-clamp-1">
                  {orgDetails.name}
                </span>
              </div>
            </div>

          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => navigate("/dash")}
              className="text-base font-bold text-gray-800 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="text-base font-bold text-gray-800 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200 cursor-pointer"
            >
              Courses
            </button>
            <button
              onClick={() => navigate("/materials")}
              className="text-base font-bold text-gray-800 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200 cursor-pointer"
            >
              Materials
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="text-base font-bold text-gray-800 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fas fa-bullhorn text-xs text-purple-600"></i>
              Notices
            </button>
            <button
              onClick={() => navigate("/examinations")}
              className="text-base font-bold text-purple-700 hover:text-purple-900 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100/80 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fas fa-shield-alt text-xs"></i>
              Examinations
            </button>
            
            {/* PROFILE DROPDOWN BUTTON */}
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md border border-purple-500/30 transition-all duration-300 focus:outline-none cursor-pointer"
                id="profile_dropdown_btn"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white tracking-wider cursor-pointer">
                  {studentInitials}
                </div>
                <span className="font-bold text-sm tracking-tight text-purple-200 max-w-[120px] truncate cursor-pointer">
                  {currentStudent.fullname || currentStudent.username}
                </span>
                <i className={`fas fa-chevron-down text-[10px] text-purple-300 transition-transform duration-200 cursor-pointer ${profileDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {/* DROPDOWN MENU */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in text-gray-100">
                  {/* Dropdown Header Info */}
                  <div className="p-4 bg-gradient-to-r from-slate-950 via-purple-950/60 to-slate-950 border-b border-gray-800">
                    <div className="font-bold text-sm text-white truncate">
                      {currentStudent.fullname}
                    </div>
                    <div className="text-xs font-mono text-purple-400 mt-0.5">
                      Roll: {currentStudent.username}
                    </div>
                    <div className="text-[11px] text-gray-400 truncate mt-1">
                      {currentStudent.email}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-200 hover:text-white hover:bg-purple-600/20 rounded-xl transition duration-150 text-left cursor-pointer"
                      id="profile_page_link"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center cursor-pointer">
                        <i className="fas fa-user-circle text-base"></i>
                      </div>
                      <div>
                        <div className="font-bold text-white cursor-pointer">My Profile</div>
                        <div className="text-[10px] text-gray-400 font-normal cursor-pointer">View & update details</div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-gray-800"></div>

                    <button
                      onClick={doLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition duration-150 text-left cursor-pointer"
                      id="logout_btn"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center cursor-pointer">
                        <i className="fas fa-sign-out-alt text-base"></i>
                      </div>
                      <div>
                        <div className="font-bold cursor-pointer">Logout</div>
                        <div className="text-[10px] text-red-400/70 font-normal cursor-pointer">Sign out of account</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100 hamberger_icon cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-2xl cursor-pointer`}></i>
          </button>
        </div>

        {/* MOBILE NAVIGATION MENU */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-100 pt-4">
            
            {/* Mobile Organization Badge */}
            <div className="flex items-center gap-3 p-3 bg-purple-50/70 rounded-xl mb-3 border border-purple-100">
              <img
                src={orgDetails.logo}
                alt={orgDetails.name}
                className="w-10 h-10 rounded-full border-2 border-purple-500/50 object-cover shadow"
              />
              <div>
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">
                  {orgDetails.code} Organization
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {orgDetails.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => { navigate("/dash"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-gray-800 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => { navigate("/courses"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-gray-800 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50 cursor-pointer"
            >
              Courses
            </button>
            <button
              onClick={() => { navigate("/materials"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-gray-800 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50 cursor-pointer"
            >
              Materials
            </button>
            <button
              onClick={() => { navigate("/notifications"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-gray-800 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50 flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-bullhorn text-xs text-purple-600"></i>
              Notices
            </button>
            <button
              onClick={() => { navigate("/examinations"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-purple-700 bg-purple-50 py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <i className="fas fa-shield-alt text-xs"></i>
              Examinations
            </button>

            {/* Mobile Profile Link */}
            <button
              onClick={() => { navigate("/profile"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-purple-900 bg-purple-100/80 py-2.5 px-3 rounded-lg flex items-center gap-2 mt-2 cursor-pointer"
            >
              <i className="fas fa-user-circle text-base text-purple-600"></i>
              My Profile
            </button>

            <button
              className="logout_btn w-full text-center mt-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold rounded-xl shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              id="logout_btn"
              onClick={doLogout}
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
