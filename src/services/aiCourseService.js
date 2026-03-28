const STORAGE_KEY = "wb_python_ai_course_v2";

const pythonModuleBlueprint = [
  {
    moduleTitle: "Python Basics & Environment",
    topics: [
      "Python Installation",
      "IDE Setup (VS Code / PyCharm)",
      "First Python Program",
      "Python Syntax Rules",
    ],
  },
  {
    moduleTitle: "Core Syntax and Data Types",
    topics: [
      "Variables and Naming",
      "Numbers, Strings, Booleans",
      "Type Casting",
      "Input and Output",
    ],
  },
  {
    moduleTitle: "Operators and Decision Making",
    topics: [
      "Arithmetic and Logical Operators",
      "Comparison Operators",
      "if / elif / else",
      "Nested Conditions",
    ],
  },
  {
    moduleTitle: "Loops and Iteration",
    topics: ["for Loop", "while Loop", "break/continue/pass", "Loop Practice Problems"],
  },
  {
    moduleTitle: "Functions and Modular Code",
    topics: [
      "Defining Functions",
      "Parameters and Return Values",
      "Default and Keyword Arguments",
      "Lambda Functions",
    ],
  },
  {
    moduleTitle: "Collections and Comprehensions",
    topics: ["Lists and Tuples", "Sets", "Dictionaries", "List/Dict Comprehension"],
  },
  {
    moduleTitle: "Files and Exception Handling",
    topics: [
      "Reading Files",
      "Writing Files",
      "try / except / finally",
      "Raising Custom Exceptions",
    ],
  },
  {
    moduleTitle: "Object-Oriented Programming",
    topics: ["Classes and Objects", "Inheritance", "Polymorphism", "Encapsulation"],
  },
  {
    moduleTitle: "Intermediate Python Concepts",
    topics: ["Iterators", "Generators", "Decorators", "Virtual Environments & pip"],
  },
  {
    moduleTitle: "Real-World Python",
    topics: ["REST API Calls", "SQLite Basics", "Project Structuring", "Capstone Project"],
  },
];

function toVideoResources(topic, moduleTitle) {
  const safeTopic = encodeURIComponent(`python ${topic} tutorial`);
  const safeModule = encodeURIComponent(`python ${moduleTitle}`);

  return [
    {
      provider: "YouTube",
      title: `${topic} - Concept Video`,
      url: `https://www.youtube.com/results?search_query=${safeTopic}`,
      estimatedMinutes: 25,
    },
    {
      provider: "YouTube",
      title: `${moduleTitle} - Practice Session`,
      url: `https://www.youtube.com/results?search_query=${safeModule}+practice`,
      estimatedMinutes: 35,
    },
  ];
}

function buildCourseModules() {
  return pythonModuleBlueprint.map((module, moduleIndex) => ({
    section: moduleIndex + 1,
    sectionTitle: `Section ${moduleIndex + 1}: ${module.moduleTitle}`,
    topics: module.topics.map((topic, topicIndex) => ({
      topicNumber: `${moduleIndex + 1}.${topicIndex + 1}`,
      topicTitle: topic,
      objective: `Understand and apply ${topic.toLowerCase()} in Python projects.`,
      videos: toVideoResources(topic, module.moduleTitle),
    })),
  }));
}

function createPythonCourse() {
  const modules = buildCourseModules();
  const totalTopics = modules.reduce((sum, module) => sum + module.topics.length, 0);
  const totalVideos = modules.reduce(
    (sum, module) => sum + module.topics.reduce((acc, topic) => acc + topic.videos.length, 0),
    0,
  );

  return {
    id: `python-ai-course-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    title: "AI Generated Python Programming Master Course",
    language: "Python",
    level: "Beginner to Advanced",
    sections: modules,
    stats: {
      totalSections: modules.length,
      totalTopics,
      totalVideos,
      estimatedHours: Math.round((totalVideos * 30) / 60),
    },
  };
}

export function generatePythonAiCourse() {
  const data = createPythonCourse();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function getPythonAiCourse() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPythonAiCourse() {
  localStorage.removeItem(STORAGE_KEY);
}
