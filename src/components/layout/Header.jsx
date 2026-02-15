import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduTech
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#courses" className="nav-link">Courses</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <a href="#home" className="block">Home</a>
            <a href="#features" className="block">Features</a>
            <a href="#courses" className="block">Courses</a>
            <a href="#testimonials" className="block">Testimonials</a>
            <a href="#contact" className="block">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
}
