import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COURSES_DATA } from '../../Data/coursesData';
import {
  enrollStudentInCourse,
  isStudentEnrolled,
  fetchAllUserEnrollments,
  getCurrentStudent
} from '../../services/enrollmentService';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function CoursesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [previewCourse, setPreviewCourse] = useState(null);

  // Student enrollment state mapping: { [courseId]: { status, progressPercentage } }
  const [enrollmentsMap, setEnrollmentsMap] = useState({});
  const [filterView, setFilterView] = useState('all'); // 'all' | 'my-courses'
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const categories = ['All', 'Programming', 'AI & ML', 'Design', 'Cloud & Security'];
  const currentStudent = getCurrentStudent();

  // Load student course enrollments on mount
  useEffect(() => {
    loadUserEnrollments();
  }, []);

  const loadUserEnrollments = async () => {
    const records = await fetchAllUserEnrollments();
    const map = {};
    records.forEach((r) => {
      map[r.courseId] = r;
    });
    setEnrollmentsMap(map);
  };

  // Handle explicit enroll click
  const handleEnrollClick = async (e, course) => {
    e.stopPropagation();
    setEnrollingCourseId(course.id);
    try {
      const record = await enrollStudentInCourse(course);
      setEnrollmentsMap((prev) => ({
        ...prev,
        [course.id]: record
      }));
      // Navigate to course viewer after enrollment
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

  // Filter logic
  let filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level.includes(selectedLevel);

    const isEnrolled = !!enrollmentsMap[course.id];
    const matchesEnrollmentFilter = filterView === 'all' || (filterView === 'my-courses' && isEnrolled);

    return matchesCat && matchesSearch && matchesLevel && matchesEnrollmentFilter;
  });

  // Sorting
  if (sortBy === 'rating') {
    filteredCourses.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    filteredCourses.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  const enrolledCount = Object.keys(enrollmentsMap).length;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans">
      <Header />

      {/* Hero Banner Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-slate-900 via-gray-900 to-purple-950 text-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="px-4 py-1.5 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 uppercase tracking-widest inline-block mb-4">
            Official Course Catalog & Student Enrollments
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-['Poppins']">
            Master Premium <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Courses</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto font-light">
            Enroll in full-stack programming, artificial intelligence, cloud architectures, and UI/UX design with real video lectures and progress database tracking.
          </p>

          {/* Hero Search Box */}
          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl overflow-hidden mb-6">
            <input
              type="text"
              placeholder="Search courses by technology, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:bg-white/20 text-base"
            />
            <i className="fas fa-search absolute left-5 top-5 text-gray-400 text-lg"></i>
          </div>

          {/* View Filter Toggle (All Courses vs My Enrolled Courses) */}
          <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 gap-2">
            <button
              onClick={() => setFilterView('all')}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                filterView === 'all'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <i className="fas fa-globe"></i>
              <span>All Courses ({COURSES_DATA.length})</span>
            </button>

            <button
              onClick={() => setFilterView('my-courses')}
              className={`px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                filterView === 'my-courses'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <i className="fas fa-user-check"></i>
              <span>My Enrolled Courses ({enrolledCount})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filters Toolbar - Fully Responsive Mobile & Tablet Layout */}
      <section className="py-4 lg:py-5 bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Chips - Touch-friendly Smooth Horizontal Scroll on Mobile & Tablet */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none touch-pan-x -mx-4 px-4 lg:mx-0 lg:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dropdown Filters & Sorting - Balanced Layout on Mobile & Tablet */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100">
            
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 flex-1 sm:flex-none">
              <i className="fas fa-filter text-purple-600 text-xs"></i>
              <span className="hidden sm:inline text-xs">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 font-medium transition cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 flex-1 sm:flex-none">
              <i className="fas fa-sort text-purple-600 text-xs"></i>
              <span className="hidden sm:inline text-xs">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 font-medium transition cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

          </div>

        </div>
      </section>

      {/* Main Course Grid */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-6">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filterView === 'my-courses' ? 'My Enrolled Courses' : 'Available Courses'} ({filteredCourses.length})
            </h2>
            <span className="text-xs text-gray-500 font-mono">Student: {currentStudent?.email}</span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <i className="fas fa-folder-open text-5xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                {filterView === 'my-courses' ? 'No enrolled courses found' : 'No courses match your search'}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                {filterView === 'my-courses'
                  ? 'Browse available courses below and click "Enroll Now" to add them to your database record.'
                  : 'Try searching for alternate keywords like "React", "Python", "Docker", or reset filters.'}
              </p>
              <button
                onClick={() => {
                  setFilterView('all');
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-xs shadow hover:bg-purple-700 transition"
              >
                Browse All Available Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => {
                const enrollmentRecord = enrollmentsMap[course.id];
                const isEnrolled = !!enrollmentRecord;
                const progressPct = enrollmentRecord?.progressPercentage || 0;
                const isEnrolling = enrollingCourseId === course.id;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col transform hover:-translate-y-1.5"
                  >
                    {/* Card Banner Header */}
                    <div className={`h-48 bg-gradient-to-br ${course.color} relative p-6 flex flex-col justify-between overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                        <i className={`${course.icon} text-white text-9xl`}></i>
                      </div>

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 font-bold text-xs rounded-full shadow">
                          {course.badge}
                        </span>
                        
                        {isEnrolled ? (
                          <span className="px-3 py-1 bg-emerald-500 text-white font-bold text-xs rounded-full shadow flex items-center gap-1">
                            <i className="fas fa-check-circle"></i> Enrolled ({progressPct}%)
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-black/40 text-white font-medium text-xs rounded-full backdrop-blur-md">
                            {course.duration}
                          </span>
                        )}
                      </div>

                      <div className="relative z-10">
                        <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-lg backdrop-blur-md inline-block">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                        <p className="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">{course.description}</p>
                      </div>

                      {/* Progress Bar if Enrolled */}
                      {isEnrolled && (
                        <div className="space-y-1 bg-purple-50 p-3 rounded-xl border border-purple-100">
                          <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
                            <span>Enrollment Progress</span>
                            <span>{progressPct}%</span>
                          </div>
                          <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-purple-600 h-full transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Stats & Instructor */}
                      <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-yellow-500 font-bold">
                            <i className="fas fa-star"></i> {course.rating} ({course.reviewsCount})
                          </span>
                          <span className="text-gray-600 font-medium">
                            <i className="fas fa-layer-group text-purple-500 mr-1"></i>
                            {course.modules.reduce((a, m) => a + m.topics.length, 0)} Syllabus Topics
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <i className="fas fa-user-circle text-blue-600"></i>
                            {course.instructor}
                          </span>
                          <span className="font-bold text-emerald-600 text-sm">{course.price}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => setPreviewCourse(course)}
                          className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition border border-gray-200"
                        >
                          Syllabus
                        </button>

                        {isEnrolled ? (
                          <button
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                          >
                            <span>Continue Learning</span>
                            <i className="fas fa-play text-[10px]"></i>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleEnrollClick(e, course)}
                            disabled={isEnrolling}
                            className="py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
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
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* QUICK PREVIEW MODAL */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative font-sans">
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
              <h4 className="font-bold text-gray-900 text-sm mb-3">What You Will Learn:</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                {previewCourse.learningOutcomes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <i className="fas fa-check-circle text-green-500 mt-1 shrink-0"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modules List */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3">Course Syllabus & Topic Lectures:</h4>
              <div className="space-y-3">
                {previewCourse.modules.map((mod, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <h5 className="font-bold text-xs md:text-sm text-purple-900">{mod.title}</h5>
                    <div className="flex flex-wrap gap-2">
                      {mod.topics.map((top) => (
                        <span key={top.id} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-[11px] font-medium rounded-lg flex items-center gap-1.5">
                          <i className="fas fa-play-circle text-purple-600"></i> {top.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg transition"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
