import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSES_DATA } from '../../Data/coursesData';
import {
  enrollStudentInCourse,
  getStudentCourseProgress,
  updateCourseTopicProgress,
  getCurrentStudent
} from '../../services/enrollmentService';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import TopicVideoPlayer from '../../components/courses/TopicVideoPlayer';

export default function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Find target course from COURSES_DATA
  const course = COURSES_DATA.find((c) => c.id === courseId) || COURSES_DATA[0];

  // Selected topic & completion state
  const firstTopic = course.modules?.[0]?.topics?.[0];
  const [activeTopic, setActiveTopic] = useState(firstTopic);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [enrollmentRecord, setEnrollmentRecord] = useState(null);

  const student = getCurrentStudent();

  // Load course enrollment & topic completion state directly from Mongoose DB
  useEffect(() => {
    initCourseState();
  }, [courseId]);

  const initCourseState = async () => {
    let record = await getStudentCourseProgress(course.id);
    if (!record) {
      record = await enrollStudentInCourse(course);
    }
    setEnrollmentRecord(record);
    if (record && Array.isArray(record.completedTopics)) {
      setCompletedTopics(record.completedTopics);
    }
    if (course?.modules?.[0]?.topics?.[0]) {
      setActiveTopic(course.modules[0].topics[0]);
    }
  };

  // Calculate total topics count & progress percentage
  const totalTopicsCount = course.modules.reduce((acc, m) => acc + m.topics.length, 0);
  const progressPercent = totalTopicsCount > 0
    ? Math.min(100, Math.round((completedTopics.length / totalTopicsCount) * 100))
    : 0;

  // Mark topic as completed permanently in Mongoose database (no rollback)
  const markTopicAsCompleted = async (topicId, e) => {
    e?.stopPropagation();
    if (!topicId || completedTopics.includes(topicId)) {
      return; // Already completed, permanently locked
    }

    const updated = [...completedTopics, topicId];
    setCompletedTopics(updated);

    const record = await updateCourseTopicProgress(course.id, updated, totalTopicsCount);
    if (record) {
      setEnrollmentRecord(record);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col font-sans">
      <Header />

      {/* Main Studio Toolbar Header */}
      <div className="pt-20 bg-slate-950 border-b border-gray-800 px-6 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
              title="Back to Courses catalog"
            >
              <i className="fas fa-arrow-left text-sm"></i>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30">
                  {course.category}
                </span>
                <span className="text-gray-400 text-xs">• {course.level}</span>
                {enrollmentRecord?.status && (
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    enrollmentRecord.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {enrollmentRecord.status}
                  </span>
                )}
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white line-clamp-1">{course.title}</h1>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <div className="text-xs text-gray-400 font-medium">Mongoose Database Progress</div>
              <div className="text-sm font-bold text-emerald-400">{progressPercent}% Completed</div>
            </div>

            <div className="w-32 bg-gray-800 h-2.5 rounded-full overflow-hidden border border-gray-700">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold border border-gray-700 transition"
            >
              <i className={`fas ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} mr-1.5`}></i>
              {isSidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}
            </button>
          </div>

        </div>
      </div>

      {/* Course Completion Banner */}
      {progressPercent === 100 && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border-b border-emerald-700 px-6 py-3 text-center text-xs md:text-sm font-bold text-emerald-200 flex items-center justify-center gap-2">
          <i className="fas fa-trophy text-yellow-400 text-base"></i>
          <span>Congratulations! You have completed all syllabus topics for {course.title}. Entry recorded in Mongoose database!</span>
        </div>
      )}

      {/* Main Studio Body Grid */}
      <div className="flex-1 container mx-auto px-4 md:px-6 py-6 grid lg:grid-cols-12 gap-6">
        
        {/* SYLLABUS SIDEBAR */}
        {isSidebarOpen && (
          <div className="lg:col-span-4 xl:col-span-3 bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col h-[760px] overflow-hidden shadow-2xl">
            
            {/* Sidebar Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-500 text-xs"></i>
                <input
                  type="text"
                  placeholder="Filter syllabus topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Modules & Topics Tree */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {course.modules.map((mod, modIdx) => {
                const filteredTopics = mod.topics.filter((t) =>
                  t.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (filteredTopics.length === 0 && searchQuery) return null;

                return (
                  <div key={mod.id || modIdx} className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 px-2 py-1 bg-purple-950/40 rounded border border-purple-900/30">
                      {mod.title}
                    </h3>

                    <div className="space-y-1">
                      {filteredTopics.map((t) => {
                        const isActive = activeTopic?.id === t.id;
                        const isDone = completedTopics.includes(t.id);

                        return (
                          <div
                            key={t.id}
                            onClick={() => setActiveTopic(t)}
                            className={`p-3 rounded-xl cursor-pointer text-xs transition flex items-center justify-between border ${
                              isActive
                                ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500 text-white shadow'
                                : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:bg-gray-900 hover:border-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <button
                                onClick={(e) => markTopicAsCompleted(t.id, e)}
                                disabled={isDone}
                                title={isDone ? "Topic completed in Mongoose DB" : "Mark topic completed"}
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-400 text-black font-bold cursor-default'
                                    : 'border-gray-600 text-transparent hover:border-emerald-400'
                                }`}
                              >
                                <i className="fas fa-check text-[10px]"></i>
                              </button>

                              <div className="truncate">
                                <p className={`font-semibold truncate ${isActive ? 'text-purple-300' : 'text-gray-200'}`}>
                                  {t.title}
                                </p>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  <i className="fas fa-clock mr-1"></i>{t.duration}
                                </span>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded border border-blue-500/30 shrink-0 flex items-center gap-1">
                              <i className="fas fa-play text-[8px]"></i> Lecture
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Instructor Box Footer */}
            <div className="pt-3 mt-3 border-t border-gray-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {course.instructor.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white">{course.instructor}</p>
                <p className="text-[10px] text-gray-400 truncate">{course.instructorRole}</p>
              </div>
            </div>

          </div>
        )}

        {/* MAIN VIDEO WORKSPACE CONTENT AREA */}
        <div className={`${isSidebarOpen ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} space-y-6`}>
          
          {/* Main Topic Toolbar */}
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-600 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2">
                <i className="fas fa-play-circle"></i>
                <span>Topic Video Lecture</span>
              </span>
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                {activeTopic?.title}
              </span>
            </div>

            <button
              onClick={(e) => markTopicAsCompleted(activeTopic?.id, e)}
              disabled={completedTopics.includes(activeTopic?.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl shadow transition flex items-center gap-2 ${
                completedTopics.includes(activeTopic?.id)
                  ? 'bg-emerald-600/90 text-white cursor-default opacity-90'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <i className={`fas ${completedTopics.includes(activeTopic?.id) ? 'fa-check-circle' : 'fa-circle'}`}></i>
              <span>{completedTopics.includes(activeTopic?.id) ? 'Topic Completed in DB' : 'Mark Completed'}</span>
            </button>
          </div>

          {/* TOPIC VIDEO PLAYER */}
          <TopicVideoPlayer
            topic={activeTopic}
            courseTitle={course.title}
          />

        </div>

      </div>

      <Footer />
    </div>
  );
}
