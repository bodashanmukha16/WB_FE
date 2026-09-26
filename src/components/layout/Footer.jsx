import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#060814] text-slate-300 pt-12 pb-8 relative overflow-hidden font-['Inter']">
      
      {/* Background Decorative Ambient Radial Light Halos */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Corner Dotted Grid Decorative Patterns */}
      <div className="absolute top-16 left-4 grid grid-cols-4 gap-2 opacity-20 pointer-events-none hidden lg:grid">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
        ))}
      </div>
      <div className="absolute bottom-20 right-4 grid grid-cols-4 gap-2 opacity-20 pointer-events-none hidden lg:grid">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        
        {/* ========================================================================= */}
        {/* 1. TOP CTA BANNER CARD: "Keep Learning, Keep Growing!"                   */}
        {/* ========================================================================= */}
        <div className="mb-14 bg-gradient-to-r from-[#1d4ed8] via-[#5b21b6] to-[#1e1b4b] rounded-3xl p-6 sm:p-8 lg:px-10 lg:py-7 border border-blue-400/30 shadow-[0_0_50px_rgba(99,102,241,0.25)] relative overflow-hidden">
          
          {/* Inner Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Left Info Column */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2.5">
                {/* 3D Graduation Cap Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c084fc] via-[#a855f7] to-[#7c3aed] flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/30 flex-shrink-0">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  Keep Learning, <span className="bg-gradient-to-r from-[#e879f9] to-[#c084fc] bg-clip-text text-transparent">Keep Growing!</span>
                </h2>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-xl font-normal leading-relaxed">
                Explore new courses, prepare for exams, and build a brighter future with WorkBench.
              </p>
            </div>

            {/* Center CTA Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  const el = document.getElementById('courses');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/courses';
                  }
                }}
                className="px-7 py-3.5 bg-white hover:bg-slate-50 text-[#7c3aed] font-extrabold text-sm sm:text-base rounded-full shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer"
              >
                <i className="fas fa-arrow-right text-sm"></i>
                <span>Explore Courses</span>
              </button>
            </div>

            {/* Right Illustration & Badge Column */}
            <div className="flex items-center gap-4 relative flex-shrink-0 z-10">
              
              {/* Doodle SVGs */}
              <svg className="w-8 h-8 text-white/50 absolute -top-8 -left-10 transform -rotate-12 hidden xl:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg className="w-7 h-7 text-white/50 absolute -top-6 right-24 hidden xl:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18h6m-5 3h4m-7-8.586A7 7 0 1117 9.414M12 2v2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* 3D Student Boy Artwork - Ultra Crisp 100% HD Sharp Transparent PNG */}
              <div className="h-[210px] sm:h-[250px] lg:h-[270px] w-auto relative flex-shrink-0 pointer-events-none flex items-end justify-center -mb-6 sm:-mb-7">
                <img
                  src="/assets/hero_3d_student_crisp.png"
                  alt="Student Illustration"
                  className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)]"
                />
              </div>

              {/* Right Translucent Badge: Your Future Starts Here */}
              <div className="hidden sm:flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl text-center shadow-xl text-white flex-shrink-0">
                <span className="text-[11px] font-medium leading-tight text-slate-200">Your</span>
                <span className="text-xs font-bold leading-tight text-white">Future</span>
                <span className="text-[11px] font-medium leading-tight text-slate-200">Starts Here</span>
                <span className="text-[10px] text-amber-300 mt-0.5">✦</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN FOOTER CONTENT GRID                                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          
          {/* COLUMN 1: LOGO, TAGLINE & 4 FEATURE CARDS (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9333ea] to-[#c084fc] flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/25 flex-shrink-0">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Work<span className="bg-gradient-to-r from-[#c084fc] to-[#e879f9] bg-clip-text text-transparent">Bench</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empowering students worldwide with cutting-edge educational technology.
            </p>

            {/* 4 Feature Micro-Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-lg">
              
              {/* Feature 1: Learn Anywhere */}
              <div className="bg-[#180927]/90 border border-pink-500/25 rounded-2xl p-2.5 flex flex-col items-start gap-1.5 hover:border-pink-500/50 transition shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center text-xs">
                  <i className="fas fa-book-open"></i>
                </div>
                <div className="text-[11px] font-extrabold text-slate-200 leading-tight">
                  Learn<br/><span className="text-slate-400 font-normal">Anywhere</span>
                </div>
              </div>

              {/* Feature 2: Track Progress */}
              <div className="bg-[#0b172e]/90 border border-blue-500/25 rounded-2xl p-2.5 flex flex-col items-start gap-1.5 hover:border-blue-500/50 transition shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs">
                  <i className="fas fa-chart-column"></i>
                </div>
                <div className="text-[11px] font-extrabold text-slate-200 leading-tight">
                  Track<br/><span className="text-slate-400 font-normal">Progress</span>
                </div>
              </div>

              {/* Feature 3: Achieve Goals */}
              <div className="bg-[#062024]/90 border border-teal-500/25 rounded-2xl p-2.5 flex flex-col items-start gap-1.5 hover:border-teal-500/50 transition shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center text-xs">
                  <i className="fas fa-shield-halved"></i>
                </div>
                <div className="text-[11px] font-extrabold text-slate-200 leading-tight">
                  Achieve<br/><span className="text-slate-400 font-normal">Goals</span>
                </div>
              </div>

              {/* Feature 4: Build Your Future */}
              <div className="bg-[#170b30]/90 border border-purple-500/25 rounded-2xl p-2.5 flex flex-col items-start gap-1.5 hover:border-purple-500/50 transition shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xs">
                  <i className="fas fa-users"></i>
                </div>
                <div className="text-[11px] font-extrabold text-slate-200 leading-tight">
                  Build<br/><span className="text-slate-400 font-normal">Your Future</span>
                </div>
              </div>

            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (2 COLS) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-white font-bold text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/courses" className="hover:text-white transition">Courses</a></li>
              <li><a href="/materials" className="hover:text-white transition">Materials</a></li>
              <li><a href="/examinations" className="hover:text-white transition">Examinations</a></li>
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
            </ul>
          </div>

          {/* COLUMN 3: FOR STUDENTS (2 COLS) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-white font-bold text-sm tracking-wide">For Students</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">Student Login</a></li>
              <li><a href="#" className="hover:text-white transition">Exam Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition">Certificates</a></li>
              <li><a href="#" className="hover:text-white transition">Career Guidance</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER & APP DOWNLOADS (3 COLS) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-white font-bold text-sm tracking-wide">Newsletter</h4>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Subscribe to get the latest updates, new courses and exam notifications.
            </p>

            {/* Email Input */}
            <form onSubmit={(e) => e.preventDefault()} className="bg-[#0f172a] border border-slate-700/60 rounded-full flex items-center p-1 focus-within:border-purple-500 transition max-w-sm">
              <i className="far fa-envelope text-slate-400 ml-3 mr-2 text-xs"></i>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent text-white text-xs placeholder-slate-500 outline-none w-full min-w-0 pr-1"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#9333ea] to-[#c084fc] hover:brightness-110 text-white font-bold text-xs px-4 py-2 rounded-full cursor-pointer transition flex-shrink-0 shadow-md"
              >
                Subscribe
              </button>
            </form>

            {/* Download Our App */}
            <div className="pt-2">
              <h5 className="text-white font-bold text-xs mb-2.5">Download Our App</h5>
              <div className="flex flex-col sm:flex-row gap-2.5">
                
                {/* Google Play */}
                <a href="#" className="bg-black/90 hover:bg-black text-white px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2.5 transition cursor-pointer group">
                  <i className="fab fa-google-play text-base text-emerald-400 group-hover:scale-110 transition"></i>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-none">GET IT ON</span>
                    <span className="text-xs font-bold text-white block leading-tight">Google Play</span>
                  </div>
                </a>

                {/* App Store */}
                <a href="#" className="bg-black/90 hover:bg-black text-white px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2.5 transition cursor-pointer group">
                  <i className="fab fa-apple text-lg text-white group-hover:scale-110 transition"></i>
                  <div>
                    <span className="text-[8px] tracking-wider text-slate-400 block leading-none">Download on the</span>
                    <span className="text-xs font-bold text-white block leading-tight">App Store</span>
                  </div>
                </a>

              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. FOOTER BOTTOM BAR                                                      */}
        {/* ========================================================================= */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          {/* Copyright */}
          <div>
            © 2026 WorkBench. All rights reserved.
          </div>

          {/* Center Cursive Slogan */}
          <div className="font-serif italic text-sm text-[#e879f9] tracking-wider font-medium">
            Learn &nbsp;•&nbsp; Practice &nbsp;•&nbsp; Achieve &nbsp;•&nbsp; Grow
          </div>

        </div>

      </div>

    </footer>
  );
}
