import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  generateCourse,
  getAiLearningState,
  getCourseStatsForStudent,
  toggleLessonForStudent,
} from "../../services/aiCourseService";

const defaultForm = {
  language: "Python",
  level: "Beginner",
  weeks: 4,
  goal: "Build practical projects and become interview-ready.",
};

export default function AIAgentDashboard() {
  const [form, setForm] = useState(defaultForm);
  const [state, setState] = useState(getAiLearningState());
  const [selectedStudentId, setSelectedStudentId] = useState(
    getAiLearningState().students[0]?.id || "",
  );

  const selectedStudent = useMemo(
    () => state.students.find((student) => student.id === selectedStudentId),
    [state.students, selectedStudentId],
  );

  const createCourse = (event) => {
    event.preventDefault();
    if (!form.language.trim() || !form.goal.trim()) return;

    generateCourse(form);
    setState(getAiLearningState());
  };

  const onToggleLesson = (courseId, lessonId) => {
    if (!selectedStudentId) return;
    toggleLessonForStudent(selectedStudentId, courseId, lessonId);
    setState(getAiLearningState());
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <section className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900">AI Course Agent Studio</h1>
            <p className="mt-2 text-slate-600 max-w-3xl">
              Generate language-specific online courses and track completion/pending status for every student.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <form
              onSubmit={createCourse}
              className="lg:col-span-1 bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4"
            >
              <h2 className="text-xl font-semibold text-slate-900">Generate New Course</h2>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Programming Language</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.language}
                  onChange={(event) => setForm((prev) => ({ ...prev, language: event.target.value }))}
                  placeholder="Python"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Level</span>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.level}
                  onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Duration (weeks)</span>
                <input
                  type="number"
                  min={2}
                  max={12}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.weeks}
                  onChange={(event) => setForm((prev) => ({ ...prev, weeks: event.target.value }))}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Learning Goal</span>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  value={form.goal}
                  onChange={(event) => setForm((prev) => ({ ...prev, goal: event.target.value }))}
                />
              </label>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
              >
                Generate Course Plan
              </button>
            </form>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Student Progress View</h2>
                    <p className="text-sm text-slate-500">Track each learner status course-by-course.</p>
                  </div>

                  <select
                    className="rounded-lg border border-slate-300 px-3 py-2"
                    value={selectedStudentId}
                    onChange={(event) => setSelectedStudentId(event.target.value)}
                  >
                    {state.students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {state.courses.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  No courses generated yet. Create your first AI-generated programming course.
                </div>
              ) : (
                state.courses.map((course) => {
                  const stats = getCourseStatsForStudent(selectedStudentId, course.id);

                  return (
                    <article key={course.id} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{course.language}</span>
                          <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">{course.level}</span>
                          <span className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">{course.weeks} weeks</span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900">{course.language} AI Course Track</h3>
                        <p className="text-slate-600 mt-1">{course.goal}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Student</p>
                            <p className="font-semibold text-slate-900">{selectedStudent?.name || "-"}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Completed</p>
                            <p className="font-semibold text-emerald-600">{stats.completed}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Pending</p>
                            <p className="font-semibold text-orange-600">{stats.pending}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">Completion</p>
                            <p className="font-semibold text-blue-600">{stats.completionPercentage}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        {course.modules.map((module, moduleIndex) => (
                          <div key={module.id} className="border border-slate-200 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900">
                              Module {moduleIndex + 1}: {module.title}
                            </h4>
                            <ul className="mt-3 space-y-2">
                              {module.lessons.map((lesson) => {
                                const isDone = state.progressByStudent?.[selectedStudentId]?.[course.id]?.completedLessonIds?.includes(
                                  lesson.id,
                                );

                                return (
                                  <li
                                    key={lesson.id}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-md px-3 py-2 bg-slate-50"
                                  >
                                    <div>
                                      <p className="font-medium text-slate-800">{lesson.title}</p>
                                      <p className="text-xs text-slate-500">{lesson.durationMinutes} min</p>
                                    </div>
                                    <button
                                      onClick={() => onToggleLesson(course.id, lesson.id)}
                                      className={`px-3 py-1.5 text-sm rounded-md font-medium ${
                                        isDone
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {isDone ? "Completed" : "Pending"}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
