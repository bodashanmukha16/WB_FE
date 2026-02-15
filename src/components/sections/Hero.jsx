import React, { useEffect, useState } from 'react'

function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-['Inter'] bg-gray-50">

      {/* NAVBAR */}
      <nav
        className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300"
        id="navbar"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span className="text-2xl font-['Poppins'] font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduTech
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="nav-link text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#features" className="nav-link text-gray-700 hover:text-blue-600 font-medium">Features</a>
              <a href="#courses" className="nav-link text-gray-700 hover:text-blue-600 font-medium">Courses</a>
              <a href="#testimonials" className="nav-link text-gray-700 hover:text-blue-600 font-medium">Testimonials</a>
              <a href="#contact" className="nav-link text-gray-700 hover:text-blue-600 font-medium">Contact</a>
            </div>

            {/* Mobile Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a href="#home" className="block text-gray-700">Home</a>
              <a href="#features" className="block text-gray-700">Features</a>
              <a href="#courses" className="block text-gray-700">Courses</a>
              <a href="#testimonials" className="block text-gray-700">Testimonials</a>
              <a href="#contact" className="block text-gray-700">Contact</a>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="home"
        className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
                <i className="fas fa-star mr-2"></i>
                Welcome to the Future of Learning
              </div>

              <h1 className="text-5xl lg:text-6xl font-['Poppins'] font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Learning Journey
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fade-in-up">
                Unlock your potential with cutting-edge educational technology.
                Access world-class courses and personalized learning paths.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <i className="fas fa-rocket mr-2"></i>Start Learning Now
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:shadow-xl border-2 border-gray-200 transform hover:scale-105 transition-all duration-300">
                  <i className="fas fa-play-circle mr-2"></i>Watch Demo
                </button>
              </div>
            </div>

            {/* Right Card */}
            <div className="flex-1 relative animate-fade-in">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">
                      Advanced Mathematics
                    </h3>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-gray-900">24</div>
                      <div className="text-sm text-gray-600">Courses</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-gray-900">12</div>
                      <div className="text-sm text-gray-600">Certificates</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

  {/* BACK TO TOP */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

    </div>
  )
}

export default Hero