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

  const handleGenerate = () => {
    const generated = generatePythonAiCourse();
    setCourse(generated);
  };

  const handleClear = () => {
    clearPythonAiCourse();
    setCourse(null);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <section className="container mx-auto px-6">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Python AI Agent</h1>
            <p className="mt-2 text-slate-600">
              Generates complete Python course structure with section-wise topics and videos for every topic.
            </p>

            <div className="mt-5 flex gap-3 flex-wrap">
              <button
                onClick={handleGenerate}
                className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
              >
                Generate Python Course Structure
              </button>
              <button
                onClick={handleClear}
                className="px-5 py-2.5 rounded-lg font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Clear Generated Course
              </button>
            </div>
          </div>

          {!course ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500">
              Click <span className="font-semibold">Generate Python Course Structure</span> to create AI course sections and videos.
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Sections" value={course.stats.totalSections} />
                <StatCard label="Topics" value={course.stats.totalTopics} />
                <StatCard label="Video Resources" value={course.stats.totalVideos} />
                <StatCard label="Estimated Hours" value={`${course.stats.estimatedHours} hrs`} />
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
                <p className="text-xs text-slate-500">Generated At</p>
                <p className="text-sm font-medium text-slate-900">{new Date(course.generatedAt).toLocaleString()}</p>
              </div>

              <div className="space-y-5">
                {course.sections.map((section) => (
                  <article key={section.sectionTitle} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <h2 className="text-xl font-bold text-slate-900">{section.sectionTitle}</h2>
                    </div>

                    <ul className="p-5 space-y-4">
                      {section.topics.map((topic) => (
                        <li key={topic.topicNumber} className="rounded-lg border border-slate-200 p-4">
                          <p className="text-xs font-semibold text-blue-700">Topic {topic.topicNumber}</p>
                          <h3 className="font-semibold text-slate-900 mt-1">{topic.topicTitle}</h3>
                          <p className="text-sm text-slate-600 mt-1">{topic.objective}</p>

                          <div className="mt-3 grid md:grid-cols-2 gap-3">
                            {topic.videos.map((video) => (
                              <a
                                key={video.title}
                                href={video.url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md bg-blue-50 px-3 py-2 border border-blue-100 hover:bg-blue-100 transition"
                              >
                                <p className="text-sm font-semibold text-blue-900">🎬 {video.title}</p>
                                <p className="text-xs text-blue-700">
                                  {video.provider} • ~{video.estimatedMinutes} min
                                </p>
                              </a>
                            ))}
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

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}
