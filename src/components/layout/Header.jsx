import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentOrgDetails } from "../../config/tenantConfig";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orgDetails, setOrgDetails] = useState(getStudentOrgDetails());
  const navigate = useNavigate();

  useEffect(() => {
    setOrgDetails(getStudentOrgDetails());
  }, []);

  const doLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-md transition-all duration-300 font-sans border-b border-gray-100">
      <div className="container mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">

          {/* BRAND LOGO & ORGANIZATION BADGE */}
          <div className="flex items-center space-x-3">
            
            {/* WorkBench Main Logo */}
            <div className="flex items-center space-x-2.5 home-btn-click cursor-pointer" onClick={() => navigate("/dash")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md transform hover:scale-105 transition duration-300">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                WorkBench
              </span>
            </div>

            {/* Logged in Student's College Organization Image & Badge (Sourced Strictly from .env) */}
            <div className="flex items-center gap-2.5 pl-3 border-l-2 border-gray-200/80">
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
              className="text-base font-bold text-gray-800 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="text-base font-bold text-gray-800 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200"
            >
              Courses
            </button>
            <button
              onClick={() => navigate("/materials")}
              className="text-base font-bold text-gray-800 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200"
            >
              Materials
            </button>
            <button
              onClick={() => navigate("/examinations")}
              className="text-base font-bold text-purple-700 hover:text-purple-900 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100/80 transition-all duration-200 flex items-center gap-1.5"
            >
              <i className="fas fa-shield-alt text-xs"></i>
              Examinations
            </button>
            
            <button
              className="ml-3 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transform hover:scale-105 transition-all duration-300 tracking-wide uppercase"
              id="logout_btn"
              onClick={doLogout}
            >
              Logout
            </button>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            className="md:hidden text-gray-800 p-2 rounded-lg hover:bg-gray-100 hamberger_icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
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
              className="block w-full text-left font-bold text-base text-gray-800 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              Home
            </button>
            <button
              onClick={() => { navigate("/courses"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-gray-800 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              Courses
            </button>
            <button
              onClick={() => { navigate("/materials"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-gray-800 hover:text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-50"
            >
              Materials
            </button>
            <button
              onClick={() => { navigate("/examinations"); setMobileOpen(false); }}
              className="block w-full text-left font-bold text-base text-purple-700 bg-purple-50 py-2 px-3 rounded-lg flex items-center gap-2"
            >
              <i className="fas fa-shield-alt text-xs"></i>
              Examinations
            </button>
            <button
              className="logout_btn w-full text-center mt-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-extrabold rounded-xl shadow-md text-xs uppercase tracking-wider"
              id="logout_btn"
              onClick={doLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
