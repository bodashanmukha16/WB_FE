import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function YearTemplate() {
  const navigate = useNavigate();
  const { branch, year } = useParams();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Set loaded to true once the component mounts
    setLoaded(true);
  }, []); // Empty dependency array ensures it runs once on mount

  const semesters = [
    { id: 1, label: `${year}-1`, title: "Semester 1" },
    { id: 2, label: `${year}-2`, title: "Semester 2" },
  ];

  return (
    <>
    <Header></Header>
    <div className="mt-18 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden relative">
      {/* 🔥 Animated Background Blobs */}
      {" "}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 reveal">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-bold text-white mb-6">
                Welcome to the WorkBench Meterials Page
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Go To below to access your Semesters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <i className="fas fa-rocket mr-2"></i>Get Started
                </button>
            </div>
        </div>
    </section>
      {/* ================= HERO SECTION ================= */}
      <section
        className={`pt-32 pb-20 text-center px-6 transition-all duration-1000 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          {branch}{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {year} Year
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Explore structured semester-wise materials, syllabus papers, previous
          questions, and complete academic resources.
        </p>
      </section>

      {/* ================= SEMESTER CARDS ================= */}
      <section className="pb-24 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {semesters.map((sem, index) => (
              <div
                key={sem.id}
                onClick={() =>
                  navigate(`/materials/${branch}/${year}/${sem.label}`)
                }
                className={`backdrop-blur-xl bg-white/30 border border-white/40 
                rounded-3xl p-8 shadow-xl cursor-pointer
                hover:shadow-2xl hover:scale-105 transition-all duration-500
                ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Card Top Banner */}
                <div
                  className={`h-32 rounded-2xl flex items-center justify-center mb-6 
                  bg-gradient-to-br ${
                    index === 0
                      ? "from-blue-500 to-purple-500"
                      : "from-green-500 to-teal-500"
                  }`}
                >
                  <span className="text-white text-5xl font-bold opacity-80">
                    {sem.label}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {sem.title}
                </h3>

                <p className="text-gray-600 mb-6">
                  Access syllabus, 5-unit materials, previous papers, important
                  questions, and references.
                </p>

                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Explore Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Footer></Footer>
    </>
  );
}