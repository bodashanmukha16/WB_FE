import features from "../../Data/academic_overview.json";
export default function Features() {
  return (
    <section id="features" className="py-20 bg-white reveal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-bold text-gray-900 mb-4">
            Academic{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Overview
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience a revolutionary approach to learning with features
            designed to maximize your success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group bg-white p-8 rounded-2xl border-2 border-gray-100 ${feature.hoverBorder} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`} style={{cursor:"pointer"}}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <i className={`fas ${feature.icon} text-white text-2xl`}></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
