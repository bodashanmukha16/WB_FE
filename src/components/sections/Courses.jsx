import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_API_URL } from '../../config/apiConfig';
import {
  enrollStudentInCourse,
  fetchAllUserEnrollments,
  getCurrentStudent
} from '../../services/enrollmentService';

export default function Courses() {
  const navigate = useNavigate();
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewCourse, setPreviewCourse] = useState(null);
  
  // Student enrollments state
  const [enrollmentsMap, setEnrollmentsMap] = useState({});
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const currentStudent = getCurrentStudent();

  // Category filter tabs matching exact screenshot
  const categories = [
    { name: 'All', icon: 'fas fa-[#7c3aed] fa-[#6366f1] fa-grid-2' },
    { name: 'Programming', icon: 'code' },
    { name: 'AI & ML', icon: 'fas fa-brain' },
    { name: 'Design', icon: 'fas fa-palette' },
    { name: 'Cloud & Security', icon: 'fas fa-cloud' },
    { name: 'Data Science', icon: 'fas fa-database' },
    { name: 'Electronics', icon: 'fas fa-microchip' },
    { name: 'Management', icon: 'fas fa-chart-line' }
  ];

  // Default featured courses matching exact reference screenshot
  const defaultPopularCourses = [
    {
      id: 'python-101',
      title: 'Python for Beginners',
      category: 'Programming',
      level: 'Beginner',
      duration: '12 Hours',
      rating: 4.8,
      reviewsCount: '1.2K',
      enrolledCount: '3.5K',
      price: 'Free',
      badge: 'Best Seller',
      badgeColor: 'bg-[#d8b4fe] text-[#7e22ce] border border-purple-300/60',
      bgGradient: 'from-[#e0f2fe] via-[#f0f9ff] to-[#e0e7ff]',
      description: 'Learn Python from scratch with hands-on projects and real-world examples.',
      tags: ['Python', 'Programming', 'Beginner'],
      cardType: 'python',
      modules: [
        { title: 'Python Syntax & Data Types', topics: ['Variables', 'Lists & Dicts', 'Control Flow'] },
        { title: 'Functions & OOP', topics: ['Functions', 'Classes', 'Inheritance'] }
      ]
    },
    {
      id: 'ml-basics',
      title: 'Machine Learning Basics',
      category: 'AI & ML',
      level: 'Intermediate',
      duration: '8 Hours',
      rating: 4.7,
      reviewsCount: '980',
      enrolledCount: '2.9K',
      price: 'Free',
      badge: '🔥 Trending',
      badgeColor: 'bg-[#f472b6] text-white',
      bgGradient: 'from-[#fce7f3] via-[#fdf2f8] to-[#f3e8ff]',
      description: 'Understand machine learning concepts with practical implementations.',
      tags: ['Machine Learning', 'AI', 'Data Science'],
      cardType: 'ai',
      modules: [
        { title: 'Supervised Learning', topics: ['Regression', 'Classification'] },
        { title: 'Neural Networks', topics: ['Perceptrons', 'Deep Learning Intro'] }
      ]
    },
    {
      id: 'cloud-essentials',
      title: 'Cloud Computing Essentials',
      category: 'Cloud & Security',
      level: 'All Levels',
      duration: '6 Hours',
      rating: 4.6,
      reviewsCount: '860',
      enrolledCount: '2.1K',
      price: 'Free',
      badge: '📊 Most Enrolled',
      badgeColor: 'bg-[#34d399] text-white',
      bgGradient: 'from-[#dcfce7] via-[#f0fdf4] to-[#e0f2fe]',
      description: 'Learn cloud fundamentals with AWS and real-world deployment.',
      tags: ['AWS', 'Cloud', 'DevOps'],
      cardType: 'cloud',
      modules: [
        { title: 'AWS Core Services', topics: ['EC2', 'S3', 'IAM'] },
        { title: 'Cloud Architecture', topics: ['VPC', 'Serverless'] }
      ]
    },
    {
      id: 'uiux-fundamentals',
      title: 'UI/UX Design Fundamentals',
      category: 'Design',
      level: 'Beginner',
      duration: '10 Hours',
      rating: 4.8,
      reviewsCount: '640',
      enrolledCount: '1.8K',
      price: 'Free',
      badge: '✦ New',
      badgeColor: 'bg-[#fbbf24] text-amber-950',
      bgGradient: 'from-[#fef3c7] via-[#fffbeb] to-[#fce7f3]',
      description: 'Design modern and user-friendly interfaces with Figma.',
      tags: ['UI/UX', 'Figma', 'Design'],
      cardType: 'design',
      modules: [
        { title: 'User Research & Wireframing', topics: ['Personas', 'Wireframes'] },
        { title: 'Figma UI Prototyping', topics: ['Auto-layout', 'Design Systems'] }
      ]
    }
  ];

  // Load student enrollments and provisioned courses on mount
  useEffect(() => {
    loadEnrollments();
    fetchStudentCourses();
  }, []);

  const fetchStudentCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_API_URL}/superadmin/public/courses`, {
        headers: {
          'x-tenant-id': currentStudent.orgId,
          'x-branch': currentStudent.branch,
          'x-year': currentStudent.year
        },
        params: {
          orgId: currentStudent.orgId,
          branch: currentStudent.branch,
          year: currentStudent.year
        }
      });

      if (res.data.success && Array.isArray(res.data.courses) && res.data.courses.length > 0) {
        const formatted = res.data.courses.map((c, idx) => {
          const fallback = defaultPopularCourses[idx % defaultPopularCourses.length];
          return {
            id: c.courseId || c._id,
            title: c.title,
            category: c.category || fallback.category,
            level: c.level || fallback.level,
            duration: c.duration || fallback.duration,
            rating: c.rating || fallback.rating,
            reviewsCount: c.reviewsCount || fallback.reviewsCount,
            enrolledCount: c.enrolledCount || fallback.enrolledCount,
            price: c.price || 'Free',
            badge: c.badge || fallback.badge,
            badgeColor: fallback.badgeColor,
            bgGradient: fallback.bgGradient,
            description: c.description || fallback.description,
            tags: c.tags || fallback.tags,
            cardType: fallback.cardType,
            modules: c.modules || fallback.modules
          };
        });
        setCoursesList(formatted);
      } else {
        setCoursesList(defaultPopularCourses);
      }
    } catch (err) {
      setCoursesList(defaultPopularCourses);
    } finally {
      setLoading(false);
    }
  };

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

  // Handle explicit enroll action
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
      }, 300);
    } catch (err) {
      setEnrollingCourseId(null);
      navigate(`/courses/${course.id}`);
    }
  };

  const displayCourses = coursesList.length > 0 ? coursesList : defaultPopularCourses;

  const filteredCourses = displayCourses.filter((course) => {
    const matchesCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="courses" className="py-4 sm:py-6 lg:py-8 bg-[#f8fafc] text-slate-900 font-sans relative overflow-hidden reveal w-full">
      
      {/* Background Pastel Radial Ambient Light Orbs matching exact reference screenshot */}
      <div className="w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-3xl absolute -top-24 -left-24 pointer-events-none z-0"></div>
      <div className="w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl absolute -top-24 -right-24 pointer-events-none z-0"></div>
      <div className="w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-3xl absolute -bottom-40 -right-40 pointer-events-none z-0"></div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO TOP BANNER CARD: Explore Courses & Build Your Future             */}
        {/* ========================================================================= */}
        <div className="w-full bg-gradient-to-r from-[#f4f7ff] via-[#f7f5ff] to-[#fff3f9] rounded-3xl p-4 sm:p-5 lg:p-6 border border-purple-100/90 shadow-lg shadow-indigo-950/5 relative overflow-hidden mb-5">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative z-10">
            
            {/* Left Content Column */}
            <div className="flex-1 text-center lg:text-left z-10 w-full lg:max-w-[55%]">
              
              {/* Top Chip Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ede9fe] text-[#7c3aed] text-xs font-extrabold rounded-full border border-[#ddd6fe]/60 mb-4 shadow-sm">
                <i className="fas fa-graduation-cap text-xs"></i>
                <span>Official Course Catalog & Student Database</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight leading-[1.15]">
                Explore <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent">Courses</span> &
              </h1>
              <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#d946ef] bg-clip-text text-transparent font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight block mt-0.5 leading-[1.15]">
                Build Your Future
              </span>

              {/* Subtitle */}
              <p className="text-[#64748b] text-xs sm:text-sm font-normal leading-relaxed mt-3 mb-5 max-w-xl mx-auto lg:mx-0">
                Enroll in industry-ready courses, learn from expert faculty, track your progress, and gain certificates to boost your career.
              </p>

              {/* 4 Feature Highlights Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-xl mx-auto lg:mx-0">
                
                {/* Feature 1 */}
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/90 border border-pink-100/80 shadow-sm">
                  <div className="w-7 h-7 rounded-xl bg-pink-100/80 text-pink-600 flex items-center justify-center text-xs flex-shrink-0">
                    <i className="fas fa-book-open"></i>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#0f172a] leading-none">Learn</div>
                    <div className="text-[10px] text-[#64748b] font-medium leading-tight">New Skills</div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/90 border border-blue-100/80 shadow-sm">
                  <div className="w-7 h-7 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">
                    <i className="fas fa-chart-column"></i>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#0f172a] leading-none">Track</div>
                    <div className="text-[10px] text-[#64748b] font-medium leading-tight">Your Progress</div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/80 border border-amber-100/80 shadow-sm">
                  <div className="w-7 h-7 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center text-xs flex-shrink-0">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#0f172a] leading-none">Earn</div>
                    <div className="text-[10px] text-[#64748b] font-medium leading-tight">Certificates</div>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/80 border border-emerald-100/80 shadow-sm">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#0f172a] leading-none">Grow</div>
                    <div className="text-[10px] text-[#64748b] font-medium leading-tight">Your Career</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Group: 3D Artwork + Floating Note + Stats Glass Card */}
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 flex-shrink-0 z-10 w-full lg:w-auto justify-center lg:justify-end">
              
              {/* 3D Student Artwork Container */}
              <div className="relative flex items-center justify-center flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 lg:w-[270px] lg:h-[270px]">
                
                {/* Background Soft Pastel Circular Aura Glow behind Student Artwork */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#c7d2fe]/60 via-[#f0abfc]/50 to-[#bae6fd]/60 rounded-full blur-2xl pointer-events-none"></div>

                {/* Lightbulb Doodle */}
                <div className="absolute -top-3 left-0 text-amber-400 text-2xl animate-bounce-subtle pointer-events-none z-10">
                  💡
                </div>

                {/* Paper Plane Doodle */}
                <div className="absolute -top-4 right-4 text-purple-400 text-xl transform -rotate-12 pointer-events-none z-10">
                  ✈
                </div>

                {/* 3D Student Boy Artwork */}
                <img
                  src="/assets/hero_3d_student_crisp.png"
                  alt="3D Student Boy"
                  className="w-full h-full object-contain scale-110 transform drop-shadow-[0_15px_30px_rgba(99,102,241,0.22)] relative z-10"
                />

                {/* Tilted Sticky Note Sticker: Learn Practice Achieve Grow ♡ */}
                <div className="hidden xl:block absolute -right-6 top-4 rotate-6 bg-white shadow-xl shadow-purple-950/10 border border-purple-100/80 px-3.5 py-2.5 rounded-2xl text-center pointer-events-none z-20">
                  <div className="font-serif italic text-xs font-bold text-[#7c3aed] leading-tight space-y-0.5">
                    <div>Learn</div>
                    <div>Practice</div>
                    <div>Achieve</div>
                    <div>Grow</div>
                    <div className="text-pink-500 text-xs mt-0.5">♡</div>
                  </div>
                </div>

              </div>

              {/* Far-Right Floating Stats Glass Card */}
              <div className="bg-white/90 backdrop-blur-md shadow-xl shadow-indigo-950/5 border border-purple-100/80 p-4 sm:p-5 rounded-3xl space-y-3.5 w-full sm:w-52 flex-shrink-0 z-10">
                
                {/* Stat 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">
                    <i className="fas fa-chart-column"></i>
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#0f172a] leading-none">24+</div>
                    <div className="text-[11px] font-medium text-[#64748b] leading-tight">Courses Available</div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <div className="text-sm font-black text-[#0f172a] leading-none">5K+</div>
                    <div className="text-[11px] font-medium text-[#64748b] leading-tight">Students Enrolled</div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0f172a] leading-none">Industry</div>
                    <div className="text-[11px] font-medium text-[#64748b] leading-tight">Relevant Content</div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CATEGORY FILTER TABS & SEARCH BAR (MIDDLE BAR)                        */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 mb-6 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl sm:rounded-full border border-purple-100/90 shadow-sm shadow-indigo-950/5">
          
          {/* Category Chips Row - Touch Friendly Smooth Horizontal Scroll on Mobile & Tablet */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none w-full lg:w-auto touch-pan-x -mx-1 px-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-md shadow-purple-500/25 scale-105'
                      : 'bg-white hover:bg-purple-50/80 text-[#475569] border border-slate-200/80'
                  }`}
                >
                  {cat.name === 'All' && <i className="fas fa-grid-2 text-xs"></i>}
                  {cat.name === 'Programming' && <code className="font-mono text-xs font-black">&lt;/&gt;</code>}
                  {cat.name === 'AI & ML' && <i className="fas fa-brain text-purple-500 text-xs"></i>}
                  {cat.name === 'Design' && <i className="fas fa-palette text-pink-500 text-xs"></i>}
                  {cat.name === 'Cloud & Security' && <i className="fas fa-cloud text-blue-500 text-xs"></i>}
                  {cat.name === 'Data Science' && <i className="fas fa-database text-teal-500 text-xs"></i>}
                  {cat.name === 'Electronics' && <i className="fas fa-microchip text-indigo-500 text-xs"></i>}
                  {cat.name === 'Management' && <i className="fas fa-chart-line text-emerald-500 text-xs"></i>}
                  <span className="whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80 flex-shrink-0">
            <i className="fas fa-search absolute left-4 top-3.5 text-[#94a3b8] text-sm"></i>
            <input
              type="text"
              placeholder="Search courses, skills or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-purple-200/80 rounded-full text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-200 transition shadow-sm"
            />
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. POPULAR COURSES GRID (4 FEATURED CARDS)                               */}
        {/* ========================================================================= */}
        <div className="mb-6">
          
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] flex items-center gap-2">
                <span>🔥</span> Popular Courses
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#64748b] mt-0.5">
                Most enrolled courses by students like you
              </p>
            </div>

            <button
              onClick={() => navigate('/courses')}
              className="text-[#7c3aed] hover:text-[#6366f1] font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer group"
            >
              <span>View All Courses</span>
              <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition"></i>
            </button>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.slice(0, 4).map((course) => {
              const enrollmentRecord = enrollmentsMap[course.id];
              const isEnrolled = !!enrollmentRecord;
              const progressPct = enrollmentRecord?.progressPercentage || 0;
              const isEnrolling = enrollingCourseId === course.id;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-indigo-950/5 border border-purple-100/90 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  
                  {/* Top Graphic Header Box inside Card */}
                  <div className={`bg-gradient-to-br ${course.bgGradient || 'from-purple-100 to-indigo-100'} rounded-[2rem] p-5 relative overflow-hidden flex items-center justify-center h-48 group-hover:scale-[1.02] transition duration-300`}>
                    
                    {/* Badge Top Left */}
                    <span className={`absolute top-3.5 left-3.5 ${course.badgeColor || 'bg-purple-600 text-white'} text-[11px] font-black px-3 py-1 rounded-full shadow-sm z-10`}>
                      {course.badge || 'Featured'}
                    </span>

                    {/* Duration Top Right */}
                    <span className="absolute top-3.5 right-3.5 bg-white/85 text-[#0f172a] text-[11px] font-black px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm z-10 flex items-center gap-1">
                      <i className="far fa-clock text-[10px]"></i>
                      {course.duration || '10 Hours'}
                    </span>

                    {/* Render Specific 3D Graphics matching exact card type */}
                    {course.cardType === 'python' && (
                      <div className="relative flex items-center justify-center">
                        <div className="w-24 h-20 bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-700 flex flex-col justify-between">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          </div>
                          <div className="font-mono text-[9px] text-emerald-400 font-bold leading-tight">
                            def main():<br/>&nbsp;&nbsp;print("Python!")
                          </div>
                        </div>
                        {/* Floating Python Logo */}
                        <div className="absolute -top-3 -right-4 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center text-white text-lg shadow-lg">
                          <i className="fab fa-python"></i>
                        </div>
                        <div className="absolute -bottom-2 -left-3 w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-md">
                          <i className="fas fa-code"></i>
                        </div>
                      </div>
                    )}

                    {course.cardType === 'ai' && (
                      <div className="relative flex items-center justify-center">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#a855f7] to-[#ec4899] flex items-center justify-center text-white text-3xl shadow-xl shadow-purple-500/30">
                          <i className="fas fa-brain"></i>
                        </div>
                        <div className="absolute -top-2 -left-3 w-8 h-8 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-xs font-black shadow-md">
                          AI
                        </div>
                        <div className="absolute -bottom-2 -right-3 w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xs shadow-md">
                          <i className="fas fa-network-wired"></i>
                        </div>
                      </div>
                    )}

                    {course.cardType === 'cloud' && (
                      <div className="relative flex items-center justify-center">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0284c7] via-[#06b6d4] to-[#10b981] flex items-center justify-center text-white text-3xl shadow-xl shadow-cyan-500/30">
                          <i className="fas fa-cloud"></i>
                        </div>
                        <div className="absolute -top-2 -right-3 w-9 h-9 rounded-xl bg-amber-500 text-white text-xs font-black flex items-center justify-center shadow-md">
                          AWS
                        </div>
                        <div className="absolute -bottom-2 -left-3 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shadow-md">
                          <i className="fas fa-server"></i>
                        </div>
                      </div>
                    )}

                    {course.cardType === 'design' && (
                      <div className="relative flex items-center justify-center">
                        <div className="w-24 h-16 bg-white rounded-2xl p-2.5 shadow-xl border border-pink-200 flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
                            F
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                            <i className="fas fa-layer-group"></i>
                          </div>
                        </div>
                        <div className="absolute -bottom-3 -right-2 text-indigo-600 text-2xl transform rotate-12 drop-shadow-md">
                          <i className="fas fa-mouse-pointer"></i>
                        </div>
                      </div>
                    )}

                    {!['python', 'ai', 'cloud', 'design'].includes(course.cardType) && (
                      <div className="w-16 h-16 rounded-2xl bg-white/90 text-[#7c3aed] flex items-center justify-center text-3xl shadow-lg">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                    )}

                  </div>

                  {/* Card Content Body */}
                  <div className="pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#0f172a] tracking-tight mb-1.5 line-clamp-1 group-hover:text-[#7c3aed] transition">
                        {course.title}
                      </h3>
                      <p className="text-xs font-medium text-[#64748b] leading-relaxed mb-3 line-clamp-2 min-h-[34px]">
                        {course.description}
                      </p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 font-extrabold text-[#0f172a]">
                        <i className="fas fa-star text-amber-400 text-xs"></i>
                        <span>{course.rating || '4.8'}</span>
                        <span className="text-[#94a3b8] font-normal text-[11px]">({course.reviewsCount || '1.2K'})</span>
                      </div>

                      <div className="text-[#64748b] font-extrabold text-[11px] flex items-center gap-1">
                        <i className="fas fa-users text-slate-400 text-xs"></i>
                        <span>{course.enrolledCount || '3.5K'} Enrolled</span>
                      </div>
                    </div>

                    {/* Tag Chips Row */}
                    <div className="flex flex-wrap items-center gap-1.5 my-2">
                      {course.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            idx === 0
                              ? 'bg-blue-100/70 text-blue-700'
                              : idx === 1
                              ? 'bg-purple-100/70 text-purple-700'
                              : 'bg-emerald-100/70 text-emerald-700'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-2">
                      {isEnrolled ? (
                        <button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="w-full py-3 bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Continue Course ({progressPct}%)</span>
                          <i className="fas fa-play text-xs"></i>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleEnrollClick(e, course)}
                          disabled={isEnrolling}
                          className="w-full py-3 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-purple-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isEnrolling ? (
                            <i className="fas fa-spinner fa-spin text-xs"></i>
                          ) : (
                            <>
                              <span>Enroll Now</span>
                              <i className="fas fa-arrow-right text-xs"></i>
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

        </div>

      </div>

    </section>
  );
}
