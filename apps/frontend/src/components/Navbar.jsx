import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-[#011C6B] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#011C6B] font-bold text-lg">
            SS
          </div>
          <span className="text-2xl font-bold tracking-tight">SmartScrap AI</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-200">
          <Link to="#features" className="hover:text-white transition-colors duration-300">
            Features
          </Link>
          <Link to="#how-it-works" className="hover:text-white transition-colors duration-300">
            How it Works
          </Link>
          <Link to="#for-who" className="hover:text-white transition-colors duration-300">
            For Who
          </Link>
          <Link to="#pricing" className="hover:text-white transition-colors duration-300">
            Pricing
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-lg bg-[#F59E0B] text-[#111827] text-sm font-semibold hover:bg-[#F59E0B]/90 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;