const STORAGE_KEY = "wb_python_ai_course_v1";

const pythonCurriculum = [
  {
    module: "Module 1: Python Foundations",
    topics: [
      {
        title: "What is Python and Setup",
        description: "Install Python, understand interpreter, run first script.",
        video: {
          title: "Python Setup + First Program",
          url: "https://www.youtube.com/results?search_query=python+installation+first+program",
          duration: "20 min",
        },
      },
      {
        title: "Variables and Data Types",
        description: "Numbers, strings, booleans, type conversion and formatting.",
        video: {
          title: "Python Variables and Data Types",
          url: "https://www.youtube.com/results?search_query=python+variables+data+types+tutorial",
          duration: "35 min",
        },
      },
      {
        title: "Input, Output and Basic Operators",
        description: "Take user input, print output, arithmetic and logical operators.",
        video: {
          title: "Python Input Output Operators",
          url: "https://www.youtube.com/results?search_query=python+input+output+operators",
          duration: "30 min",
        },
      },
    ],
  },
  {
    module: "Module 2: Control Flow",
    topics: [
      {
        title: "Conditional Statements",
        description: "if, elif, else and nested conditions.",
        video: {
          title: "Python If Else Tutorial",
          url: "https://www.youtube.com/results?search_query=python+if+elif+else+tutorial",
          duration: "28 min",
        },
      },
      {
        title: "Loops in Python",
        description: "for and while loops, break, continue, pass.",
        video: {
          title: "Python For and While Loops",
          url: "https://www.youtube.com/results?search_query=python+for+while+loops+break+continue",
          duration: "40 min",
        },
      },
      {
        title: "Pattern and Logic Practice",
        description: "Practice problems for logic-building using loops.",
        video: {
          title: "Python Loop Practice Questions",
          url: "https://www.youtube.com/results?search_query=python+loop+practice+problems",
          duration: "45 min",
        },
      },
    ],
  },
  {
    module: "Module 3: Functions and Reusability",
    topics: [
      {
        title: "Defining Functions",
        description: "Parameters, return statements, default arguments.",
        video: {
          title: "Python Functions Explained",
          url: "https://www.youtube.com/results?search_query=python+functions+arguments+return",
          duration: "35 min",
        },
      },
      {
        title: "Scope and Lambda",
        description: "Local/global scope, lambda, map/filter basics.",
        video: {
          title: "Python Scope and Lambda",
          url: "https://www.youtube.com/results?search_query=python+scope+lambda+map+filter",
          duration: "32 min",
        },
      },
      {
        title: "Mini Project: Utility Functions",
        description: "Create reusable utility module for common tasks.",
        video: {
          title: "Python Function Project",
          url: "https://www.youtube.com/results?search_query=python+mini+project+functions",
          duration: "38 min",
        },
      },
    ],
  },
  {
    module: "Module 4: Data Structures",
    topics: [
      {
        title: "Lists and Tuples",
        description: "Create, modify, iterate and common methods.",
        video: {
          title: "Python Lists and Tuples",
          url: "https://www.youtube.com/results?search_query=python+lists+tuples+tutorial",
          duration: "42 min",
        },
      },
      {
        title: "Sets and Dictionaries",
        description: "Key-value storage, uniqueness, fast lookups.",
        video: {
          title: "Python Dictionary and Set",
          url: "https://www.youtube.com/results?search_query=python+dictionary+set+tutorial",
          duration: "39 min",
        },
      },
      {
        title: "Comprehensions",
        description: "List, dictionary and set comprehensions.",
        video: {
          title: "Python Comprehensions",
          url: "https://www.youtube.com/results?search_query=python+list+dictionary+comprehension",
          duration: "25 min",
        },
      },
    ],
  },
  {
    module: "Module 5: File Handling and Error Management",
    topics: [
      {
        title: "Read/Write Files",
        description: "Work with text files and CSV basics.",
        video: {
          title: "Python File Handling",
          url: "https://www.youtube.com/results?search_query=python+file+handling+read+write",
          duration: "30 min",
        },
      },
      {
        title: "Exception Handling",
        description: "try/except/finally and custom exceptions.",
        video: {
          title: "Python Exception Handling",
          url: "https://www.youtube.com/results?search_query=python+exception+handling+tutorial",
          duration: "34 min",
        },
      },
      {
        title: "Logging Basics",
        description: "Use logging module for debugging and observability.",
        video: {
          title: "Python Logging Tutorial",
          url: "https://www.youtube.com/results?search_query=python+logging+module+tutorial",
          duration: "22 min",
        },
      },
    ],
  },
  {
    module: "Module 6: Object-Oriented Python",
    topics: [
      {
        title: "Classes and Objects",
        description: "Create classes, methods, constructors.",
        video: {
          title: "Python OOP Basics",
          url: "https://www.youtube.com/results?search_query=python+classes+objects+oop",
          duration: "45 min",
        },
      },
      {
        title: "Inheritance and Polymorphism",
        description: "Reuse behavior with inheritance and override methods.",
        video: {
          title: "Python Inheritance and Polymorphism",
          url: "https://www.youtube.com/results?search_query=python+inheritance+polymorphism",
          duration: "36 min",
        },
      },
      {
        title: "Encapsulation and Dunder Methods",
        description: "Data hiding and magic methods in real projects.",
        video: {
          title: "Python Dunder Methods",
          url: "https://www.youtube.com/results?search_query=python+dunder+methods+encapsulation",
          duration: "30 min",
        },
      },
    ],
  },
  {
    module: "Module 7: Intermediate Python Essentials",
    topics: [
      {
        title: "Iterators and Generators",
        description: "Lazy evaluation patterns for scalable code.",
        video: {
          title: "Python Iterators and Generators",
          url: "https://www.youtube.com/results?search_query=python+iterators+generators",
          duration: "31 min",
        },
      },
      {
        title: "Decorators",
        description: "Wrap and extend function behavior elegantly.",
        video: {
          title: "Python Decorators",
          url: "https://www.youtube.com/results?search_query=python+decorators+tutorial",
          duration: "33 min",
        },
      },
      {
        title: "Virtual Environments and Pip",
        description: "Manage dependencies and isolated project environments.",
        video: {
          title: "Python venv and pip",
          url: "https://www.youtube.com/results?search_query=python+virtual+environment+pip",
          duration: "24 min",
        },
      },
    ],
  },
  {
    module: "Module 8: Real-World Development",
    topics: [
      {
        title: "API Requests",
        description: "Consume REST APIs using requests library.",
        video: {
          title: "Python REST API Requests",
          url: "https://www.youtube.com/results?search_query=python+requests+api+tutorial",
          duration: "30 min",
        },
      },
      {
        title: "Database Basics with SQLite",
        description: "Store and query persistent data.",
        video: {
          title: "Python SQLite Tutorial",
          url: "https://www.youtube.com/results?search_query=python+sqlite3+tutorial",
          duration: "35 min",
        },
      },
      {
        title: "Capstone Project Blueprint",
        description: "Plan and implement a complete Python project.",
        video: {
          title: "Python Capstone Project Guide",
          url: "https://www.youtube.com/results?search_query=python+capstone+project+tutorial",
          duration: "50 min",
        },
      },
    ],
  },
];

function createPythonCourseBlueprint() {
  const totalTopics = pythonCurriculum.reduce((acc, module) => acc + module.topics.length, 0);

  return {
    id: `python-course-${Date.now()}`,
    language: "Python",
    title: "AI-Generated Python Developer Course",
    level: "Beginner to Intermediate",
    createdAt: new Date().toISOString(),
    totalModules: pythonCurriculum.length,
    totalTopics,
    estimatedHours: 32,
    modules: pythonCurriculum,
  };
}

export function getPythonAiCourse() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function generatePythonAiCourse() {
  const blueprint = createPythonCourseBlueprint();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blueprint));
  return blueprint;
}

export function clearPythonAiCourse() {
  localStorage.removeItem(STORAGE_KEY);
}
