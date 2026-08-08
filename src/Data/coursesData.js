// Modular Courses Data Loader from separate JSON files
import allCoursesCatalog from './courses/all_courses.json';
import webDevBootcamp from './courses/web_dev_bootcamp.json';
import machineLearningFundamentals from './courses/machine_learning_fundamentals.json';
import uiuxDesignMasterclass from './courses/uiux_design_masterclass.json';
import dsaAlgorithms from './courses/dsa_algorithms.json';
import cloudDevopsMastery from './courses/cloud_devops_mastery.json';
import cyberSecurityEssentials from './courses/cyber_security_essentials.json';

// Map of course detail JSON objects keyed by course ID
const courseDetailsMap = {
  "web-dev-bootcamp": webDevBootcamp,
  "machine-learning-fundamentals": machineLearningFundamentals,
  "uiux-design-masterclass": uiuxDesignMasterclass,
  "dsa-algorithms": dsaAlgorithms,
  "cloud-devops-mastery": cloudDevopsMastery,
  "cyber-security-essentials": cyberSecurityEssentials
};

// Combined array of full course details for backward compatibility
export const COURSES_DATA = allCoursesCatalog.map((catalogItem) => {
  const details = courseDetailsMap[catalogItem.id] || {};
  return {
    ...catalogItem,
    ...details
  };
});

// Helper to get master catalog of all courses
export const getAllCoursesCatalog = () => allCoursesCatalog;

// Helper to get specific detailed course content (syllabus, video links, modules)
export const getCourseDetails = (courseId) => {
  return courseDetailsMap[courseId] || COURSES_DATA.find((c) => c.id === courseId) || COURSES_DATA[0];
};

export default COURSES_DATA;
