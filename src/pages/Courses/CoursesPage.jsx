import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_API_URL } from '../../config/apiConfig';
import {
  enrollStudentInCourse,
  fetchAllUserEnrollments,
  getCurrentStudent
} from '../../services/enrollmentService';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function CoursesPage() {
  const navigate = useNavigate();
  const currentStudent = getCurrentStudent();

  const [coursesList, setCoursesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [previewCourse, setPreviewCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Student enrollment state mapping: { [courseId]: { status, progressPercentage } }
  const [enrollmentsMap, setEnrollmentsMap] = useState({});
  const [filterView, setFilterView] = useState('all'); // 'all' | 'my-courses'
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  // Category filter tabs matching homepage Courses section
  const categories = [
    { name: 'All', icon: 'fas fa-grid-2' },
    { name: 'Programming', icon: 'code' },
    { name: 'AI & ML', icon: 'fas fa-brain' },
    { name: 'Design', icon: 'fas fa-palette' },
    { name: 'Cloud & Security', icon: 'fas fa-cloud' },
    { name: 'Data Science', icon: 'fas fa-database' },
    { name: 'Electronics', icon: 'fas fa-microchip' },
    { name: 'Management', icon: 'fas fa-chart-line' }
  ];

  // Default popular featured courses
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
      instructor: 'Dr. Angela Yu',
      badge: 'Best Seller',
      badgeColor: 'bg-[#d8b4fe] text-[#7e22ce] border border-purple-300/60',
      bgGradient: 'from-[#e0f2fe] via-[#f0f9ff] to-[#e0e7ff]',
      description: 'Learn Python from scratch with hands-on projects and real-world examples.',
      overview: 'Master Python syntax, object-oriented programming, file handling, data structures, and build real applications.',
      tags: ['Python', 'Programming', 'Beginner'],
      cardType: 'python',
      learningOutcomes: [
        'Write clean, readable, and efficient Python 3 code',
        'Understand object-oriented programming (OOP) principles',
        'Build desktop applications and automation scripts'
      ],
      modules: [
        { id: 'm1', title: 'Module 1: Python Syntax & Data Types', topics: [{ id: 't1', title: 'Variables & Data Types' }, { id: 't2', title: 'Control Flow & Loops' }] },
        { id: 'm2', title: 'Module 2: Functions & OOP', topics: [{ id: 't3', title: 'Functions & Lambdas' }, { id: 't4', title: 'Classes & Inheritance' }] }
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
      instructor: 'Andrew Ng',
      badge: '🔥 Trending',
      badgeColor: 'bg-[#f472b6] text-white',
      bgGradient: 'from-[#fce7f3] via-[#fdf2f8] to-[#f3e8ff]',
      description: 'Understand machine learning concepts with practical implementations.',
      overview: 'Learn supervised & unsupervised machine learning algorithms using Python, NumPy, Pandas, and Scikit-Learn.',
      tags: ['Machine Learning', 'AI', 'Data Science'],
      cardType: 'ai',
      learningOutcomes: [
        'Implement Linear Regression and Logistic Regression from scratch',
        'Train Neural Networks and Decision Trees using Scikit-Learn',
        'Evaluate model accuracy and tuning hyper-parameters'
      ],
      modules: [
        { id: 'm1', title: 'Module 1: Supervised Learning', topics: [{ id: 't1', title: 'Linear & Logistic Regression' }, { id: 't2', title: 'Classification Models' }] },
        { id: 'm2', title: 'Module 2: Neural Networks', topics: [{ id: 't3', title: 'Perceptrons & Activation Functions' }, { id: 't4', title: 'Deep Learning Introduction' }] }
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
      instructor: 'Stephane Maarek',
      badge: '📊 Most Enrolled',
      badgeColor: 'bg-[#34d399] text-white',
      bgGradient: 'from-[#dcfce7] via-[#f0fdf4] to-[#e0e7ff]',
      description: 'Learn cloud fundamentals with AWS and real-world deployment.',
      overview: 'Explore cloud infrastructure, AWS core services (EC2, S3, IAM, VPC), serverless computing, and security best practices.',
      tags: ['AWS', 'Cloud', 'DevOps'],
      cardType: 'cloud',
      learningOutcomes: [
        'Deploy applications to AWS cloud infrastructure',
        'Configure Security Groups, IAM Roles, and S3 Buckets',
        'Understand Cloud Architecture and Serverless Workloads'
      ],
      modules: [
        { id: 'm1', title: 'Module 1: AWS Core Services', topics: [{ id: 't1', title: 'EC2 & Virtual Servers' }, { id: 't2', title: 'S3 Storage & IAM Security' }] },
        { id: 'm2', title: 'Module 2: Cloud Architecture', topics: [{ id: 't3', title: 'Virtual Private Cloud (VPC)' }, { id: 't4', title: 'Lambda & Serverless' }] }
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
      instructor: 'Daniel Walter Scott',
      badge: '✦ New',
      badgeColor: 'bg-[#fbbf24] text-amber-950',
      bgGradient: 'from-[#fef3c7] via-[#fffbeb] to-[#fce7f3]',
      description: 'Design modern and user-friendly interfaces with Figma.',
      overview: 'Learn user research, wireframing, interactive prototyping, color theory, typography, and design systems in Figma.',
      tags: ['UI/UX', 'Figma', 'Design'],
      cardType: 'design',
      learningOutcomes: [
        'Master Figma tools, auto-layout, and interactive components',
        'Conduct user research and map out user journeys',
        'Create high-fidelity responsive prototypes'
      ],
      modules: [
        { id: 'm1', title: 'Module 1: User Research & Wireframing', topics: [{ id: 't1', title: 'User Personas & Information Architecture' }, { id: 't2', title: 'Low-Fidelity Wireframes' }] },
        { id: 'm2', title: 'Module 2: Figma UI Prototyping', topics: [{ id: 't3', title: 'Auto-Layout & Design Systems' }, { id: 't4', title: 'Interactive Prototypes & Handoff' }] }
      ]
    }
  ];

  // Enrich raw course data with 3D gradients and badges
  const enrichCourseData = (c, idx) => {
    const fallback = defaultPopularCourses[idx % defaultPopularCourses.length];
    
    let cardType = c.cardType || fallback.cardType;
    let bgGradient = c.bgGradient || fallback.bgGradient;
    let badgeColor = c.badgeColor || fallback.badgeColor;
    let badge = c.badge || fallback.badge;

    const titleLower = (c.title || '').toLowerCase();
    const catLower = (c.category || '').toLowerCase();

    if (titleLower.includes('python') || catLower.includes('programming')) {
      cardType = 'python';
      bgGradient = 'from-[#e0f2fe] via-[#f0f9ff] to-[#e0e7ff]';
      badgeColor = 'bg-[#d8b4fe] text-[#7e22ce] border border-purple-300/60';
    } else if (titleLower.includes('machine') || titleLower.includes('ai') || catLower.includes('ai')) {
      cardType = 'ai';
      bgGradient = 'from-[#fce7f3] via-[#fdf2f8] to-[#f3e8ff]';
      badgeColor = 'bg-[#f472b6] text-white';
    } else if (titleLower.includes('cloud') || titleLower.includes('aws') || catLower.includes('cloud')) {
      cardType = 'cloud';
      bgGradient = 'from-[#dcfce7] via-[#f0fdf4] to-[#e0e7ff]';
      badgeColor = 'bg-[#34d399] text-white';
    } else if (titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('design') || catLower.includes('design')) {
      cardType = 'design';
      bgGradient = 'from-[#fef3c7] via-[#fffbeb] to-[#fce7f3]';
      badgeColor = 'bg-[#fbbf24] text-amber-950';
    }

    const tags = c.tags || [
      c.category || 'Tech',
      c.level || 'All Levels',
      'Certified'
    ];

    return {
      id: c.courseId || c.id || fallback.id,
      title: c.title || fallback.title,
      category: c.category || fallback.category,
      level: c.level || fallback.level,
      duration: c.duration || fallback.duration,
      rating: c.rating || fallback.rating,
      reviewsCount: c.reviewsCount || fallback.reviewsCount,
      enrolledCount: c.enrolledCount || fallback.enrolledCount,
      price: c.price || 'Free',
      instructor: c.instructor || fallback.instructor,
      badge,
      badgeColor,
      bgGradient,
      cardType,
      description: c.description || fallback.description,
      overview: c.overview || c.description || fallback.overview,
      tags,
      learningOutcomes: c.learningOutcomes || fallback.learningOutcomes,
      modules: (c.modules && c.modules.length > 0) ? c.modules : fallback.modules
    };
  };

  // Load student course enrollments and provisioned courses on mount
  useEffect(() => {
    loadUserEnrollments();
    fetchProvisionedCourses();
  }, []);

  const fetchProvisionedCourses = async () => {
    setLoadingCourses(true);
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
        const formatted = res.data.courses.map((c, idx) => enrichCourseData(c, idx));
        setCoursesList(formatted);
      } else {
        setCoursesList(defaultPopularCourses);
      }
    } catch (err) {
      setCoursesList(defaultPopularCourses);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadUserEnrollments = async () => {
    const records = await fetchAllUserEnrollments();
    const map = {};
    if (Array.isArray(records)) {
      records.forEach((r) => {
        map[r.courseId] = r;
      });
    }
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

  // Filter logic
  let filteredCourses = displayCourses.filter((course) => {
    const matchesCat = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || (course.level && course.level.toLowerCase().includes(selectedLevel.toLowerCase()));

    const isEnrolled = !!enrollmentsMap[course.id];
    const matchesEnrollmentFilter = filterView === 'all' || (filterView === 'my-courses' && isEnrolled);

    return matchesCat && matchesSearch && matchesLevel && matchesEnrollmentFilter;
  });

  // Sorting
  if (sortBy === 'rating') {
    filteredCourses.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    filteredCourses.sort((a, b) => parseFloat(b.reviewsCount || 0) - parseFloat(a.reviewsCount || 0));
  }

  const enrolledCount = Object.keys(enrollmentsMap).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans relative overflow-hidden">
      <Header />

      {/* Ambient Background Radial Glows matching reference screenshot */}
      <div className="w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-3xl absolute top-10 -left-24 pointer-events-none z-0"></div>
      <div className="w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl absolute top-10 -right-24 pointer-events-none z-0"></div>
      <div className="w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-3xl absolute bottom-32 -right-40 pointer-events-none z-0"></div>

      {/* Main Page Container */}
      <main className="flex-1 w-full pt-16 sm:pt-20 lg:pt-22 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        
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
        {/* 2. CATEGORY FILTER TABS & SEARCH / FILTER TOOLBAR                        */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 mb-6 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl sm:rounded-full border border-purple-100/90 shadow-sm shadow-indigo-950/5">
          
          {/* Category Chips Row - Touch Friendly Smooth Horizontal Scroll */}
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

          {/* Search Bar & Dropdown Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
            
            {/* Search Box */}
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <i className="fas fa-search absolute left-4 top-3.5 text-[#94a3b8] text-sm"></i>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-purple-200/80 rounded-full text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-200 transition shadow-sm"
              />
            </div>

            {/* Level Select */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full sm:w-auto bg-white hover:bg-purple-50/50 text-[#0f172a] text-xs font-bold px-3.5 py-2.5 rounded-full border border-purple-200/80 outline-none focus:border-[#7c3aed] transition cursor-pointer shadow-sm"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-white hover:bg-purple-50/50 text-[#0f172a] text-xs font-bold px-3.5 py-2.5 rounded-full border border-purple-200/80 outline-none focus:border-[#7c3aed] transition cursor-pointer shadow-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. VIEW FILTER TOGGLE & COURSE GRID HEADER                                */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] flex items-center gap-2">
              <span>🔥</span> {filterView === 'my-courses' ? 'My Enrolled Courses' : 'Popular & Featured Courses'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748b] mt-0.5">
              Showing {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'} based on your filters
            </p>
          </div>

          {/* View Filter Pill (All Courses vs My Enrolled Courses) */}
          <div className="inline-flex p-1 bg-white backdrop-blur-md rounded-full border border-purple-200/80 shadow-sm gap-1 self-stretch sm:self-auto">
            <button
              onClick={() => setFilterView('all')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
                filterView === 'all'
                  ? 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-md'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <i className="fas fa-globe text-xs"></i>
              <span>All Courses ({displayCourses.length})</span>
            </button>

            <button
              onClick={() => setFilterView('my-courses')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
                filterView === 'my-courses'
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-md'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              <i className="fas fa-user-check text-xs"></i>
              <span>Enrolled ({enrolledCount})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. COURSES GRID (CARDS MATCHING EXACT HOMEPAGE COURSES SECTION)           */}
        {/* ========================================================================= */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-purple-100 p-8 shadow-sm">
            <div className="w-16 h-16 bg-purple-50 text-[#7c3aed] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
              <i className="fas fa-folder-open"></i>
            </div>
            <h3 className="text-lg font-black text-[#0f172a] mb-1">
              {filterView === 'my-courses' ? 'No enrolled courses found' : 'No courses match your search'}
            </h3>
            <p className="text-[#64748b] text-xs max-w-md mx-auto mb-5">
              {filterView === 'my-courses'
                ? 'Browse available courses and click "Enroll Now" to add them to your student profile.'
                : 'Try clearing your search query or selecting a different category filter.'}
            </p>
            <button
              onClick={() => {
                setFilterView('all');
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6366f1] text-white rounded-2xl font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              Reset Filters & Browse All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
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

                    {/* Render Specific 3D Graphics matching card type */}
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

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => setPreviewCourse(course)}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0f172a] font-extrabold text-xs rounded-2xl transition cursor-pointer border border-slate-200/80 text-center"
                      >
                        Syllabus
                      </button>

                      {isEnrolled ? (
                        <button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="py-2.5 bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Continue</span>
                          <i className="fas fa-play text-[10px]"></i>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleEnrollClick(e, course)}
                          disabled={isEnrolling}
                          className="py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-purple-500/20 transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          {isEnrolling ? (
                            <i className="fas fa-spinner fa-spin text-xs"></i>
                          ) : (
                            <>
                              <span>Enroll</span>
                              <i className="fas fa-arrow-right text-[10px]"></i>
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

      </main>

      {/* QUICK SYLLABUS PREVIEW MODAL */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative font-sans border border-purple-100">
            <button
              onClick={() => setPreviewCourse(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg cursor-pointer transition"
            >
              &times;
            </button>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 bg-[#ede9fe] text-[#7c3aed] text-xs font-extrabold rounded-full">
                {previewCourse.category}
              </span>
              <span className="text-[#64748b] text-xs font-bold">• {previewCourse.level}</span>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-2">{previewCourse.title}</h2>
              <p className="text-[#64748b] text-xs md:text-sm leading-relaxed">{previewCourse.overview || previewCourse.description}</p>
            </div>

            {/* Learning Outcomes */}
            {previewCourse.learningOutcomes && previewCourse.learningOutcomes.length > 0 && (
              <div>
                <h4 className="font-extrabold text-[#0f172a] text-sm mb-3">What You Will Learn:</h4>
                <ul className="space-y-2 text-xs text-[#334155]">
                  {previewCourse.learningOutcomes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 font-medium">
                      <i className="fas fa-check-circle text-emerald-500 mt-0.5 shrink-0"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modules List */}
            {previewCourse.modules && previewCourse.modules.length > 0 && (
              <div>
                <h4 className="font-extrabold text-[#0f172a] text-sm mb-3">Course Syllabus & Topic Lectures:</h4>
                <div className="space-y-3">
                  {previewCourse.modules.map((mod, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2">
                      <h5 className="font-extrabold text-xs md:text-sm text-[#7c3aed]">{mod.title}</h5>
                      <div className="flex flex-wrap gap-2">
                        {mod.topics?.map((top, tIdx) => (
                          <span key={tIdx} className="px-3 py-1 bg-white border border-slate-200 text-[#334155] text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                            <i className="fas fa-play-circle text-[#7c3aed]"></i> {typeof top === 'string' ? top : top.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#94a3b8] font-semibold block">Instructor</span>
                <span className="text-xs font-extrabold text-[#0f172a]">{previewCourse.instructor || 'Senior Faculty'}</span>
              </div>

              {enrollmentsMap[previewCourse.id] ? (
                <button
                  onClick={() => {
                    setPreviewCourse(null);
                    navigate(`/courses/${previewCourse.id}`);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  Continue Learning ➔
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    handleEnrollClick(e, previewCourse);
                    setPreviewCourse(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-purple-500/20 transition cursor-pointer"
                >
                  Enroll Now ➔
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
