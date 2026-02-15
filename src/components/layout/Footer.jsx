export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">

      <div className="container mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-12">

          {/* ===== COLUMN 1 ===== */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              WorkBench
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering students worldwide with cutting-edge educational technology.
            </p>
          </div>

          {/* ===== COLUMN 2 ===== */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-white transition">Home</a></li>
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#courses" className="hover:text-white transition">Courses</a></li>
              <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
            </ul>
          </div>

          {/* ===== COLUMN 3 ===== */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>

          {/* ===== COLUMN 4 ===== */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Newsletter
            </h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest updates and news.
            </p>

            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-lg bg-gray-800 text-gray-300 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-lg"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* ===== BOTTOM COPYRIGHT ===== */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500">
          © 2026 EduTech. All rights reserved.
        </div>

      </div>

    </footer>
  );
}
