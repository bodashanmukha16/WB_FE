export default function Courses() {
  return (
    <section id="courses" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 reveal">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-bold text-gray-900 mb-4">
                    Popular <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Courses</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Explore our most popular courses and start your learning journey today
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fas fa-code text-white text-6xl opacity-20"></i>
                        </div>
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                            Trending
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">Programming</span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-600 text-sm"><i className="fas fa-clock mr-1"></i>24 hours</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Web Development Bootcamp</h3>
                        <p className="text-gray-600 mb-4">Master HTML, CSS, JavaScript and build modern responsive websites from scratch.</p>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1">
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <span className="text-gray-600 text-sm ml-2">4.9 (2.5k)</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-gray-900">$49</span>
                            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>
              
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="h-48 bg-gradient-to-br from-green-500 to-teal-500 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fas fa-brain text-white text-6xl opacity-20"></i>
                        </div>
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600">
                            Popular
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">AI &amp; ML</span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-600 text-sm"><i className="fas fa-clock mr-1"></i>36 hours</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Machine Learning Fundamentals</h3>
                        <p className="text-gray-600 mb-4">Learn the basics of AI and ML with hands-on projects and real-world applications.</p>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1">
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <span className="text-gray-600 text-sm ml-2">4.8 (1.8k)</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-gray-900">$79</span>
                            <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>
                
               
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="h-48 bg-gradient-to-br from-orange-500 to-red-500 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fas fa-paint-brush text-white text-6xl opacity-20"></i>
                        </div>
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600">
                            New
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full">Design</span>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-600 text-sm"><i className="fas fa-clock mr-1"></i>18 hours</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">UI/UX Design Masterclass</h3>
                        <p className="text-gray-600 mb-4">Create stunning user interfaces and experiences with modern design principles.</p>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1">
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-yellow-400"></i>
                                <i className="fas fa-star text-gray-300"></i>
                                <span className="text-gray-600 text-sm ml-2">4.7 (920)</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-gray-900">$59</span>
                            <button className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center mt-12">
                <button className="px-8 py-4 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:shadow-xl border-2 border-gray-200 transform hover:scale-105 transition-all duration-300">
                    View All Courses <i className="fas fa-arrow-right ml-2"></i>
                </button>
            </div>
        </div>
    </section>
  );
}
