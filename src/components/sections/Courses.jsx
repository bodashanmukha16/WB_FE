export default function Courses() {
  return (
    <section id="courses" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Popular Courses
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="course-card">
            <h3>Advanced Mathematics</h3>
            <p>Master algebra and calculus concepts.</p>
          </div>
          <div className="course-card">
            <h3>Computer Science</h3>
            <p>Learn programming & data structures.</p>
          </div>
          <div className="course-card">
            <h3>Physics</h3>
            <p>Understand motion and energy.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
