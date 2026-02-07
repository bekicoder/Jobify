export default function Footer(){
    return(
        <footer className="bg-[#0a2540] text-white mt-24">
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
    {/* Logo & Description */}
    <div className="flex flex-col gap-4">
      <a href="/" className="flex items-center gap-3">
        <div className="relative">
          <span className="block w-8 h-8 rounded-full bg-sky-500/50"></span>
          <span className="block w-8 h-8 rounded-full bg-sky-500 absolute top-0 -right-2 animate-circle"></span>
        </div>
        <span className="font-bold text-xl">Jobify</span>
      </a>
      <p className="text-gray-300 text-sm">
        Jobify connects job seekers with the best opportunities worldwide. Apply in seconds and land your dream role.
      </p>
    </div>

    {/* Quick Links */}
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
      <a href="/" className="hover:text-sky-500 transition">Home</a>
      <a href="/jobs" className="hover:text-sky-500 transition">Find Jobs</a>
      <a href="/jobs?route=appliedJobs" className="hover:text-sky-500 transition">Applied Jobs</a>
      <a href="/jobs?route=savedJobs" className="hover:text-sky-500 transition">Saved Jobs</a>
    </div>

    {/* About */}
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-lg mb-2">About</h3>
      <p className="text-gray-300 text-sm">
        Founded in 2026 by Bereket Girma, Jobify operates in 80+ countries, simplifying hiring and job searching.
      </p>
      <a href="/about" className="hover:text-sky-500 transition mt-2">Learn More</a>
    </div>

    {/* Contact & Social */}
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-lg mb-2">Contact</h3>
      <p className="text-gray-300 text-sm">Email: support@jobify.com</p>
      <p className="text-gray-300 text-sm">Phone: +1 (555) 123-4567</p>
      <div className="flex gap-3 mt-4">
        <a href="#" className="p-2 bg-sky-500 rounded-full hover:bg-sky-400 transition">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="#" className="p-2 bg-sky-500 rounded-full hover:bg-sky-400 transition">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" className="p-2 bg-sky-500 rounded-full hover:bg-sky-400 transition">
          <i className="fab fa-linkedin-in"></i>
        </a>
      </div>
    </div>
  </div>

  <div className="border-t border-gray-700 mt-12 py-4 text-center text-gray-400 text-sm">
    &copy; {new Date().getFullYear()} Jobify. All rights reserved.
  </div>
</footer>

    )
}