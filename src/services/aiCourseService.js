const STORAGE_KEY = "wb_ai_courses_state_v1";

const defaultStudents = [
  { id: "stu-001", name: "Aarav", email: "aarav@student.com" },
  { id: "stu-002", name: "Diya", email: "diya@student.com" },
  { id: "stu-003", name: "Rahul", email: "rahul@student.com" },
];

function buildLesson(moduleIndex, lessonIndex, language) {
  const topics = [
    "Syntax Essentials",
    "Control Flow",
    "Functions",
    "Object-Oriented Concepts",
    "Data Structures",
    "Testing Basics",
    "Debugging",
    "Project Build",
  ];

  const topic = topics[(moduleIndex * 3 + lessonIndex) % topics.length];

  return {
    id: `lesson-${moduleIndex + 1}-${lessonIndex + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: `${language} ${topic}`,
    durationMinutes: 35 + lessonIndex * 10,
  };
}

function generateModules(language, weeks) {
  const moduleCount = Math.min(Math.max(Number(weeks) || 4, 2), 12);

  return Array.from({ length: moduleCount }, (_, moduleIndex) => ({
    id: `module-${moduleIndex + 1}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: `Week ${moduleIndex + 1}: ${language} Mastery Track`,
    lessons: Array.from({ length: 3 }, (_, lessonIndex) =>
      buildLesson(moduleIndex, lessonIndex, language),
    ),
  }));
}

function initialState() {
  return {
    students: defaultStudents,
    courses: [],
    progressByStudent: {},
  };
}

function readState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState();

    const parsed = JSON.parse(saved);
    return {
      students: parsed.students?.length ? parsed.students : defaultStudents,
      courses: parsed.courses || [],
      progressByStudent: parsed.progressByStudent || {},
    };
  } catch {
    return initialState();
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function getAiLearningState() {
  return readState();
}

export function generateCourse(payload) {
  const state = readState();
  const language = payload.language.trim();

  const modules = generateModules(language, payload.weeks);

  const newCourse = {
    id: `course-${Date.now()}`,
    language,
    level: payload.level,
    weeks: Number(payload.weeks) || 4,
    goal: payload.goal.trim(),
    createdAt: new Date().toISOString(),
    modules,
  };

  state.courses.unshift(newCourse);

  const allLessonIds = modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));

  for (const student of state.students) {
    if (!state.progressByStudent[student.id]) {
      state.progressByStudent[student.id] = {};
    }

    state.progressByStudent[student.id][newCourse.id] = {
      completedLessonIds: [],
      pendingLessonIds: allLessonIds,
      startedAt: new Date().toISOString(),
      completedAt: null,
    };
  }

  writeState(state);
  return newCourse;
}

export function toggleLessonForStudent(studentId, courseId, lessonId) {
  const state = readState();

  const progress = state.progressByStudent?.[studentId]?.[courseId];
  if (!progress) return null;

  const set = new Set(progress.completedLessonIds);
  if (set.has(lessonId)) {
    set.delete(lessonId);
  } else {
    set.add(lessonId);
  }

  const course = state.courses.find((item) => item.id === courseId);
  const allLessonIds = (course?.modules || []).flatMap((module) =>
    module.lessons.map((lesson) => lesson.id),
  );

  progress.completedLessonIds = Array.from(set);
  progress.pendingLessonIds = allLessonIds.filter((id) => !set.has(id));
  progress.completedAt = progress.pendingLessonIds.length === 0 ? new Date().toISOString() : null;

  writeState(state);
  return progress;
}

export function getCourseStatsForStudent(studentId, courseId) {
  const state = readState();
  const progress = state.progressByStudent?.[studentId]?.[courseId];

  if (!progress) {
    return {
      completed: 0,
      pending: 0,
      total: 0,
      completionPercentage: 0,
    };
  }

  const completed = progress.completedLessonIds.length;
  const pending = progress.pendingLessonIds.length;
  const total = completed + pending;

  return {
    completed,
    pending,
    total,
    completionPercentage: total ? Math.round((completed / total) * 100) : 0,
  };
}
