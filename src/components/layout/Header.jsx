import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate()
  const doLogout = ()=>{
    localStorage.clear();
    navigate("/")
  }
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2 home-btn-click" onClick={()=>{navigate("/dash")}}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WorkBench
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate("/dash")} className="nav-link text-gray-700 hover:text-purple-600 font-medium">Home</button>
            <button onClick={() => navigate("/dash#features")} className="nav-link text-gray-700 hover:text-purple-600 font-medium">Features</button>
            <button onClick={() => navigate("/courses")} className="nav-link text-gray-700 hover:text-purple-600 font-medium">Courses</button>
            <button onClick={() => navigate("/materials")} className="nav-link text-gray-700 hover:text-purple-600 font-medium">Materials</button>
            <button className="logout_btn px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:shadow-xl border border-gray-200 transform hover:scale-105 transition-all duration-300" id="logout_btn" onClick={doLogout}>
              Logout
            </button>
          </div>

          <button
            className="md:hidden text-gray-700 hamberger_icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <button onClick={() => { navigate("/dash"); setMobileOpen(false); }} className="block w-full text-left font-medium text-gray-700">Home</button>
            <button onClick={() => { navigate("/dash#features"); setMobileOpen(false); }} className="block w-full text-left font-medium text-gray-700">Features</button>
            <button onClick={() => { navigate("/courses"); setMobileOpen(false); }} className="block w-full text-left font-medium text-gray-700">Courses</button>
            <button onClick={() => { navigate("/materials"); setMobileOpen(false); }} className="block w-full text-left font-medium text-gray-700">Materials</button>
            <button className="logout_btn w-full text-left px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:shadow-xl border border-gray-200" id="logout_btn" onClick={doLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
