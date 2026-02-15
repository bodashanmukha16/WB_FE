export default function Features() {
  return (
   <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-bold text-gray-900 mb-4">
                    Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduTech</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Experience a revolutionary approach to learning with features designed to maximize your success
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-laptop-code text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Interactive Learning</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Engage with dynamic content, interactive exercises, and hands-on projects that make learning enjoyable and effective.
                    </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-user-friends text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert Instructors</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Learn from industry professionals and experienced educators who are passionate about your success.
                    </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-chart-line text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Progress</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Monitor your learning journey with detailed analytics, performance metrics, and personalized insights.
                    </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-mobile-alt text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Learn Anywhere</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Access your courses on any device, anytime, anywhere. Learn at your own pace with flexible scheduling.
                    </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-pink-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-certificate text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Earn Certificates</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Get recognized for your achievements with industry-recognized certificates upon course completion.
                    </p>
                </div>
                
                <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-comments text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Support</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Connect with fellow learners, participate in discussions, and get help from our supportive community.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}
