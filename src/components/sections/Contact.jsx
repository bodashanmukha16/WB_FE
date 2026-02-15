export default function Contact() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 reveal">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-bold text-white mb-6">
                Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join 50,000+ students already learning on EduTech. Get instant access to all courses and start transforming your future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <i className="fas fa-rocket mr-2"></i>Get Started Free
                </button>
                <button className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                    <i className="fas fa-phone mr-2"></i>Contact Sales
                </button>
            </div>
        </div>
    </section>
  );
}
