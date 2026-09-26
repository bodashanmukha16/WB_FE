import features from "../../Data/academic_overview.json";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const navigate = useNavigate();

  const getThemeStyles = (featureId) => {
    switch (featureId) {
      case 1:
        return {
          iconBg: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
          btnBg: "bg-[#e0f2fe] text-[#0284c7] group-hover:bg-[#bae6fd]",
        };
      case 2:
        return {
          iconBg: "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/30",
          btnBg: "bg-[#f3e8ff] text-[#9333ea] group-hover:bg-[#e9d5ff]",
        };
      case 3:
        return {
          iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/30",
          btnBg: "bg-[#e6f4ea] text-[#059669] group-hover:bg-[#ceead6]",
        };
      case 4:
        return {
          iconBg: "bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-500/30",
          btnBg: "bg-[#ffedd5] text-[#ea580c] group-hover:bg-[#fed7aa]",
        };
      case 5:
        return {
          iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30",
          btnBg: "bg-[#e0e7ff] text-[#4f46e5] group-hover:bg-[#c7d2fe]",
        };
      case 6:
      default:
        return {
          iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500 shadow-cyan-500/30",
          btnBg: "bg-[#cff4fc] text-[#0891b2] group-hover:bg-[#a5f3fc]",
        };
    }
  };

  return (
    <section id="features" className="py-24 bg-[#e6f7f6] text-[#0f172a] relative overflow-hidden reveal font-sans">
      
      {/* Background Distinct Translucent Geometric Bubble Arcs */}
      {/* Top Left Layered Bubbles */}
      <div className="w-[600px] h-[600px] bg-[#d3f4ef]/60 rounded-full absolute -top-48 -left-48 pointer-events-none"></div>
      <div className="w-[380px] h-[380px] bg-[#bdf0e9]/75 rounded-full absolute -top-24 -left-24 pointer-events-none"></div>

      {/* Top Right Layered Bubbles */}
      <div className="w-[550px] h-[550px] bg-[#d3f4ef]/60 rounded-full absolute -top-44 -right-44 pointer-events-none"></div>
      <div className="w-[340px] h-[340px] bg-[#bdf0e9]/75 rounded-full absolute -top-20 -right-20 pointer-events-none"></div>

      {/* Bottom Left Layered Bubbles */}
      <div className="w-[520px] h-[520px] bg-[#d3f4ef]/60 rounded-full absolute -bottom-44 -left-44 pointer-events-none"></div>
      <div className="w-[320px] h-[320px] bg-[#bdf0e9]/75 rounded-full absolute -bottom-20 -left-20 pointer-events-none"></div>

      {/* Bottom Right Layered Bubbles */}
      <div className="w-[620px] h-[620px] bg-[#d3f4ef]/50 rounded-full absolute -bottom-52 -right-52 pointer-events-none"></div>
      <div className="w-[400px] h-[400px] bg-[#bdf0e9]/80 rounded-full absolute -bottom-28 -right-28 pointer-events-none"></div>

      {/* Decorative Dotted Grid Patterns */}
      <div className="absolute top-24 left-16 grid grid-cols-4 gap-2.5 opacity-40 pointer-events-none z-0">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#00a8b5]"></div>
        ))}
      </div>
      <div className="absolute bottom-24 right-16 grid grid-cols-4 gap-2.5 opacity-40 pointer-events-none z-0">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#00a8b5]"></div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="px-6 py-2 bg-[#b2f5ea]/80 text-[#0d9488] text-xs font-extrabold rounded-full uppercase tracking-wider inline-block mb-5 shadow-sm border border-teal-300/40">
            Academic Ecosystem Highlights
          </span>
          <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-extrabold text-[#0f172a] mb-4 tracking-tight">
            Academic <span className="text-[#00a8b5]">Overview</span>
          </h2>
          <p className="text-[#475569] text-base lg:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Experience a revolutionary approach to learning with features designed to maximize your success
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const theme = getThemeStyles(feature.id);

            return (
              <div
                key={feature.id}
                className="group bg-white p-8 rounded-[2rem] shadow-xl shadow-cyan-900/5 border border-cyan-100/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  if (feature.click_then) {
                    navigate(feature.click_then);
                  }
                }}
              >
                <div>
                  {/* Icon Box */}
                  <div
                    className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-105`}
                  >
                    <i className={`fas ${feature.icon} text-white text-2xl`}></i>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#1e293b] mb-3 group-hover:text-[#00a8b5] transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#64748b] text-sm leading-relaxed font-normal mb-8">
                    {feature.description}
                  </p>
                </div>

                {/* Full-width Action Pill Button at Bottom */}
                <div
                  className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-between font-bold text-sm transition-all duration-300 ${theme.btnBg}`}
                >
                  <span>Access Resource</span>
                  <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
