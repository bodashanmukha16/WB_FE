import { useEffect, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/sections/Hero";
import Features from "../../components/sections/Features";
import Courses from "../../components/sections/Courses";
import Testimonials from "../../components/sections/Testimonials";
import Contact from "../../components/sections/Contact";
// import "./Dashboard.css";

export default function DashboardHome() {

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Courses />
      <Testimonials />
      <Contact />
      <Footer />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg"
        >
          ↑
        </button>
      )}
    </>
  );
}
