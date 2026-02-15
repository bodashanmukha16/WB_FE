export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Platform Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="feature-card">
            <i className="fas fa-user-graduate text-4xl text-blue-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Student Portal</h3>
            <p>View results, attendance and materials.</p>
          </div>

          <div className="feature-card">
            <i className="fas fa-chalkboard-teacher text-4xl text-purple-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Faculty Access</h3>
            <p>Manage classes and track performance.</p>
          </div>

          <div className="feature-card">
            <i className="fas fa-chart-line text-4xl text-pink-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p>Visual insights and academic reports.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
