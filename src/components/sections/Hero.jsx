import React from 'react';

function Hero() {
  const userStr = localStorage.getItem('user');
  let user = {};
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {}
  }
  const studentName = user.name || user.fullname || user.username || "Lokesh Kumar Boda";

  return (
    <div className="font-['Inter'] reveal">
      {/* HERO SECTION */}
      <section
        id="home"
        className="pt-32 pb-24 bg-gradient-to-br from-[#f5f3ff] via-[#f8f6ff] to-[#eae6ff] relative overflow-hidden"
      >
        {/* Corner Translucent Background Arcs */}
        <div className="w-[450px] h-[450px] rounded-full bg-[#e8e4ff]/70 absolute -top-32 -left-32 pointer-events-none"></div>
        <div className="w-[500px] h-[500px] rounded-full bg-[#e0d9ff]/60 absolute -top-36 -right-36 pointer-events-none"></div>
        <div className="w-[550px] h-[550px] rounded-full bg-[#dcd4ff]/70 absolute -bottom-40 -right-40 pointer-events-none"></div>

        {/* Decorative Dotted Grid Patterns */}
        <div className="absolute bottom-12 left-10 grid grid-cols-4 gap-2.5 opacity-30 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-indigo-500"></div>
          ))}
        </div>
        <div className="absolute top-12 right-10 grid grid-cols-4 gap-2.5 opacity-30 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-indigo-500"></div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left Content Column */}
            <div className="flex-1 text-center lg:text-left">
              
              {/* Hi there badge chip */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e0e7ff] text-[#4f46e5] text-xs font-bold rounded-full mb-6 border border-[#c7d2fe]/60 shadow-sm animate-fade-in-up">
                <i className="fas fa-star text-xs"></i>
                <span>Hi there!!!!!</span>
              </div>

              {/* Main Welcome Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-['Poppins'] font-extrabold text-[#0f172a] tracking-tight leading-[1.15] animate-fade-in-up">
                Welcome Back
              </h1>
              <span className="bg-gradient-to-r from-[#2563eb] via-[#6366f1] to-[#9333ea] bg-clip-text text-transparent font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6 block leading-[1.15] animate-fade-in-up">
                {studentName}
              </span>

              {/* Subtitle */}
              <p className="text-[#475569] text-base lg:text-lg font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up">
                Your academic journey continues today. Track your progress, explore new courses, and achieve your goals.
              </p>

              {/* Primary Dashboard CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up">
                <button
                  onClick={() => {
                    const target = document.getElementById("courses") || document.getElementById("features");
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-[#2563eb] via-[#6366f1] to-[#8b5cf6] text-white text-base font-extrabold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center justify-center gap-3 cursor-pointer"
                >
                  <i className="fas fa-rocket text-lg"></i>
                  <span>Go To My Dashboard</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 3D Learning Highlight Card */}
            <div className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 animate-fade-in">
              <div className="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-indigo-950/10 border border-purple-100/80 p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
                
                {/* Ambient Background Glows inside Card */}
                <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-gradient-to-br from-purple-200/40 via-indigo-100/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none z-0"></div>
                <div className="absolute right-1/3 top-0 w-64 h-64 bg-purple-100/30 rounded-full blur-2xl pointer-events-none z-0"></div>

                {/* Integrated 3D Student Artwork - Crisp, Sharp, Vivid & Non-Whitish (Desktop & Tablet) */}
                <div 
                  className="absolute right-0 top-0 bottom-16 h-[calc(100%-4.5rem)] w-[50%] sm:w-[48%] pointer-events-none z-0 hidden sm:block overflow-hidden"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                    maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)'
                  }}
                >
                  <img
                    src="/assets/hero_3d_student_learning.jpg"
                    alt="3D Student Learning"
                    className="w-full h-full object-cover object-right mix-blend-multiply opacity-100"
                  />
                </div>

                {/* Upper Section inside Card */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6 relative z-10">
                  
                  {/* Text Side bounded to max 55% width so text never overlaps 3D image */}
                  <div className="flex-1 z-10 text-center sm:text-left w-full sm:max-w-[55%] lg:max-w-[52%]">
                    <div className="text-amber-400 text-xl mb-2">✦</div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                      Keep Learning,
                    </h2>
                    <div className="relative inline-block mb-3">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#7c3aed] tracking-tight">
                        Keep Growing!
                      </span>
                      {/* Curved Underline SVG */}
                      <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-[#7c3aed]" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,10 Q50,20 100,5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>

                    <p className="text-[#64748b] text-sm font-medium italic mt-2 mb-6 leading-relaxed max-w-xs mx-auto sm:mx-0">
                      “ A little progress each day adds up to big results.”
                    </p>

                    <button
                      onClick={() => {
                        const target = document.getElementById("courses");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/25 hover:brightness-110 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      <span>Continue Learning</span>
                      <i className="fas fa-arrow-right text-xs"></i>
                    </button>
                  </div>

                  {/* Mobile Crisp 3D Student Illustration Image */}
                  <div className="w-48 h-48 sm:hidden relative flex-shrink-0 flex items-center justify-center mx-auto pointer-events-none">
                    <img
                      src="/assets/hero_3d_student_learning.jpg"
                      alt="3D Student Learning"
                      className="w-full h-full object-contain mix-blend-multiply opacity-100"
                    />
                  </div>
                </div>

                {/* Bottom 3 Feature Badges Bar */}
                <div className="bg-[#f8f7ff]/90 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-purple-100/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2 text-left relative z-10 shadow-sm">
                  
                  {/* Badge 1 */}
                  <div className="flex items-center gap-3 pb-2.5 sm:pb-0 border-b sm:border-b-0 sm:border-r border-purple-100/80 pr-0 sm:pr-2 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#7c3aed] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <i className="fas fa-graduation-cap text-base"></i>
                    </div>
                    <div>
                      <div className="text-xs sm:text-xs font-extrabold text-[#0f172a] leading-tight">Learn</div>
                      <div className="text-[11px] sm:text-[11px] font-medium text-[#64748b] leading-tight">New Skills</div>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className="flex items-center gap-3 pb-2.5 sm:pb-0 border-b sm:border-b-0 sm:border-r border-purple-100/80 px-0 sm:px-2 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#fce7f3] text-[#db2777] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <i className="fas fa-bullseye text-base"></i>
                    </div>
                    <div>
                      <div className="text-xs sm:text-xs font-extrabold text-[#0f172a] leading-tight">Achieve</div>
                      <div className="text-[11px] sm:text-[11px] font-medium text-[#64748b] leading-tight">Your Goals</div>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className="flex items-center gap-3 flex-1 pl-0 sm:pl-2">
                    <div className="w-10 h-10 rounded-xl bg-[#ccfbf1] text-[#0d9488] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <i className="fas fa-chart-line text-base"></i>
                    </div>
                    <div>
                      <div className="text-xs sm:text-xs font-extrabold text-[#0f172a] leading-tight">Build a</div>
                      <div className="text-[11px] sm:text-[11px] font-medium text-[#64748b] leading-tight">Brighter Future</div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;