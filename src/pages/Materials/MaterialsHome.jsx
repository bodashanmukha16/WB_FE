import React from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Navigate, useNavigate } from 'react-router-dom'

function MaterialsHome() {
     const navigate = useNavigate()
     const user = JSON.parse(localStorage.getItem('user'))
  return (
    <div>
        <Header></Header>
      
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ================= BANNER SECTION ================= */}
<section className="pt-32 pb-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden">

  <div className="container mx-auto px-6 text-center relative z-10">
    <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
      Academic <span className="text-yellow-300">Materials Hub</span>
    </h1>

    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
      Access semester-wise notes, previous papers, lab manuals and important questions —
      organized perfectly for your academic success.
    </p>

    <button
      onClick={() => document.getElementById("years").scrollIntoView({ behavior: "smooth" })}
      className="px-8 py-4 bg-white text-purple-700 rounded-xl text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
    >
      Explore Materials
    </button>
  </div>

  {/* Background Overlay Shape */}
  <div className="absolute -bottom-10 left-0 w-full h-32 bg-white rounded-t-[60px]"></div>

</section>
      
      {/* ATTRACTIVE SECOND SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Everything Organized For You
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            No more searching multiple websites. WorkBench provides all academic
            resources in a clean, structured format. Select your year, choose your semester,
            and access materials instantly.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-12">
            <div className="p-6 rounded-2xl bg-blue-50 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📘</div>
              <h3 className="font-semibold text-xl mb-2">Semester Wise</h3>
              <p className="text-gray-600">
                All materials organized clearly semester by semester.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📂</div>
              <h3 className="font-semibold text-xl mb-2">All Subjects</h3>
              <p className="text-gray-600">
                Notes, previous papers, lab manuals & more.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-pink-50 hover:shadow-lg transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-xl mb-2">Instant Access</h3>
              <p className="text-gray-600">
                Download materials quickly without confusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* YEAR CARDS SECTION */}
     <section
  id="years"
  className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
>
  <div className="container mx-auto px-6">

    <div className="text-center mb-16">
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Academic Year</span>
      </h2>

      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Select your year and access structured semester materials instantly.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-9">

      {[1,2,3,4].map((year, index) => {

        const colors = [
          "from-blue-500 to-purple-500",
          "from-green-500 to-teal-500",
          "from-orange-500 to-red-500",
          "from-indigo-500 to-pink-500"
        ];

        const badges = ["Foundation", "Core", "Advanced", "Final Year"];

        return (
          <div
            key={year}
            onClick={() => navigate(`/materials/${user.branch}/${year}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer"
          >

            {/* Top Gradient Banner */}
            <div className={`h-40 bg-gradient-to-br ${colors[index]} relative overflow-hidden`}>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-7xl font-bold opacity-80">
                  {year}
                </span>
              </div>

              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                {badges[index]}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">

              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                  Year {year}
                </span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-600 text-sm">
                  2 Semesters
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {year} Year Materials
              </h3>

              <p className="text-gray-600 mb-4">
                Access semester-wise structured materials including notes,
                question papers, and lab manuals.
              </p>

              <div className="flex items-center justify-between">
            
                <button className={`px-6 py-2 bg-gradient-to-r ${colors[index]} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}>
                  Explore
                </button>
              </div>

            </div>
          </div>
        );
      })}

    </div>

  </div>
</section>

    </div>
        <Footer></Footer>
    </div>
  )
}

export default MaterialsHome