import { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  clearPythonAiCourse,
  generatePythonAiCourse,
  getPythonAiCourse,
} from "../../services/aiCourseService";

export default function AIAgentDashboard() {
  const [course, setCourse] = useState(getPythonAiCourse());

  const onGenerate = () => {
    const generated = generatePythonAiCourse();
    setCourse(generated);
  };

  const onReset = () => {
    clearPythonAiCourse();
    setCourse(null);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <section className="container mx-auto px-6">
          <div className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Python AI Course Agent</h1>
            <p className="mt-2 text-slate-600 max-w-3xl">
              This AI agent generates a complete Python course structure with module-wise topics and a video resource for each topic.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={onGenerate}
                className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
              >
                Generate Python Course
              </button>
              <button
                onClick={onReset}
                className="px-5 py-2.5 rounded-lg font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          {!course ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Click <span className="font-semibold">Generate Python Course</span> to build the complete course structure and videos.
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">Language</p>
                  <p className="font-semibold text-slate-900">{course.language}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">Modules</p>
                  <p className="font-semibold text-slate-900">{course.totalModules}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">Topics</p>
                  <p className="font-semibold text-slate-900">{course.totalTopics}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-xs text-slate-500">Estimated Hours</p>
                  <p className="font-semibold text-slate-900">{course.estimatedHours} hrs</p>
                </div>
              </div>

              <div className="space-y-5">
                {course.modules.map((module) => (
                  <article key={module.module} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <h2 className="text-xl font-bold text-slate-900">{module.module}</h2>
                    </div>

                    <ul className="p-5 space-y-4">
                      {module.topics.map((topic) => (
                        <li key={topic.title} className="rounded-lg border border-slate-200 p-4">
                          <h3 className="font-semibold text-slate-900">{topic.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{topic.description}</p>

                          <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-md bg-blue-50 px-3 py-2">
                            <div>
                              <p className="text-sm font-medium text-blue-900">🎬 {topic.video.title}</p>
                              <p className="text-xs text-blue-700">Suggested duration: {topic.video.duration}</p>
                            </div>
                            <a
                              href={topic.video.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                            >
                              Open Video →
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
