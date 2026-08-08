import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES_DATA } from '../../Data/coursesData';
import {
  enrollStudentInCourse,
  fetchAllUserEnrollments,
  getCurrentStudent
} from '../../services/enrollmentService';

export default function Courses() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewCourse, setPreviewCourse] = useState(null);
  
  // Student enrollments state from Mongoose DB
  const [enrollmentsMap, setEnrollmentsMap] = useState({});
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const categories = ['All', 'Programming', 'AI & ML', 'Design', 'Cloud & Security'];
  const currentStudent = getCurrentStudent();

  // Load student enrollments on component mount
  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    const records = await fetchAllUserEnrollments();
    const map = {};
    if (Array.isArray(records)) {
      records.forEach((r) => {
        map[r.courseId] = r;
      });
    }
    setEnrollmentsMap(map);
  };

  // Handle explicit enroll action on Dashboard
  const handleEnrollClick = async (e, course) => {
    e.stopPropagation();
    setEnrollingCourseId(course.id);
    try {
      const record = await enrollStudentInCourse(course);
      setEnrollmentsMap((prev) => ({
        ...prev,
        [course.id]: record
      }));
      setTimeout(() => {
        setEnrollingCourseId(null);
        navigate(`/courses/${course.id}`);
      }, 400);
    } catch (err) {
      console.error("Enrollment error:", err);
      setEnrollingCourseId(null);
      navigate(`/courses/${course.id}`);
    }
  };

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="courses" className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-purple-950 text-white relative overflow-hidden reveal font-sans">
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 bg-purple-500/20 text-purple-300 text-xs font-extrabold rounded-full border border-purple-500/30 uppercase tracking-widest inline-block mb-3">
            Official Course Catalog & Student Database
          </span>
          <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-extrabold text-white mb-4">
            Featured <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Courses</span> & Enrollments
          </h2>
          <p className="text-lg text-gray-300 font-light">
            Enroll directly in industry-ready tech courses with real topic video lectures, progress tracking, and Mongoose database persistence.
          </p>
        </div>

        {/* Category Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <i className="fas fa-search absolute left-3.5 top-3 text-gray-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search course title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

        </div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.slice(0, 6).map((course) => {
            const topicCount = course.modules.reduce((acc, m) => acc + m.topics.length, 0);
            const enrollmentRecord = enrollmentsMap[course.id];
            const isEnrolled = !!enrollmentRecord;
            const progressPct = enrollmentRecord?.progressPercentage || 0;
            const isEnrolling = enrollingCourseId === course.id;

            return (
              <div
                key={course.id}
                className="bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-800 hover:border-purple-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between"
              >
                
                {/* Header Image/Banner */}
                <div className={`h-48 bg-gradient-to-br ${course.color} relative p-6 flex flex-col justify-between overflow-hidden`}>
                  <div className="absolute inset-0 opacity-15 flex items-center justify-center pointer-events-none">
                    <i className={`${course.icon} text-white text-9xl`}></i>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 bg-white/90 text-gray-900 font-extrabold text-xs rounded-full shadow">
                      {course.badge}
                    </span>

                    {isEnrolled ? (
                      <span className="px-3 py-1 bg-emerald-500 text-white font-bold text-xs rounded-full shadow flex items-center gap-1">
                        <i className="fas fa-check-circle"></i> Enrolled ({progressPct}%)
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-black/50 text-white font-medium text-xs rounded-full backdrop-blur-md">
                        <i className="fas fa-clock mr-1"></i>{course.duration}
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 bg-black/40 text-blue-300 text-xs font-semibold rounded-lg backdrop-blur-md">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30">
                      <i className="fas fa-video mr-1"></i>Video Lectures
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2">{course.description}</p>
                  </div>

                  {/* Progress Bar if Enrolled */}
                  {isEnrolled && (
                    <div className="space-y-1 bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/40">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300">
                        <span>Database Progress</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                      <i className="fas fa-star"></i>
                      <span>{course.rating}</span>
                      <span className="text-gray-400 text-[11px] font-normal">({course.reviewsCount})</span>
                    </div>

                    <div className="text-gray-300 font-mono">
                      <i className="fas fa-book-open text-purple-400 mr-1"></i>
                      {topicCount} Syllabus Topics
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-extrabold text-emerald-400">{course.price}</span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewCourse(course)}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl transition border border-gray-700"
                        title="Quick Syllabus Overview"
                      >
                        Syllabus
                      </button>

                      {isEnrolled ? (
                        <button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
                        >
                          <span>Continue</span>
                          <i className="fas fa-play text-[10px]"></i>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleEnrollClick(e, course)}
                          disabled={isEnrolling}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
                        >
                          {isEnrolling ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fas fa-plus-circle text-xs"></i>
                              <span>Enroll Now</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14">
          <button
            onClick={() => navigate('/courses')}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-base font-bold border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <span>Explore All Courses & My Enrollments</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

      </div>

      {/* QUICK PREVIEW MODAL */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-gray-900 font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative">
            <button
              onClick={() => setPreviewCourse(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
            >
              &times;
            </button>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                {previewCourse.category}
              </span>
              <span className="text-gray-400 text-xs">• {previewCourse.level}</span>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{previewCourse.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{previewCourse.overview}</p>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Key Learning Outcomes:</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                {previewCourse.learningOutcomes?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <i className="fas fa-check-circle text-green-500 mt-1 shrink-0"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Instructor</span>
                <span className="text-xs font-bold text-gray-800">{previewCourse.instructor}</span>
              </div>

              {enrollmentsMap[previewCourse.id] ? (
                <button
                  onClick={() => {
                    setPreviewCourse(null);
                    navigate(`/courses/${previewCourse.id}`);
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg transition"
                >
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    handleEnrollClick(e, previewCourse);
                    setPreviewCourse(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
                >
                  <span>Enroll Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
