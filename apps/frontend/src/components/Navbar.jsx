import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Features");

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "For Who", href: "#for-who" },
    { label: "Pricing", href: "#pricing" },
  ];

  const handleNavClick = (label) => {
    setActiveLink(label);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#011C6B] text-white border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">

        {/* Top Navbar */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setActiveLink("")}
            className="flex items-center gap-2 sm:gap-3 rounded-lg p-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#011C6B] font-bold text-base sm:text-lg">
              SS
            </div>

            <span className="text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap">
              SmartScrap AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => handleNavClick(link.label)}
                className={`transition-colors duration-300 px-2 py-1 rounded ${
                  activeLink === link.label
                    ? "text-[#F59E0B]"
                    : "text-gray-200 hover:text-[#F59E0B]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <Link
              to="/login"
              className="px-4 xl:px-5 py-2.5 rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-4 xl:px-5 py-2.5 rounded-lg bg-[#F59E0B] text-[#111827] text-sm font-semibold hover:bg-[#F59E0B]/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-3 border-t border-white/10 pt-4 max-h-[70vh] overflow-y-auto">

            {/* Mobile Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.label)}
                  className={`px-3 py-3 rounded-lg transition-colors duration-300 ${
                    activeLink === link.label
                      ? "text-[#F59E0B] bg-white/5"
                      : "text-gray-200 hover:text-[#F59E0B] hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full sm:w-auto text-center px-5 py-2.5 rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/10"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-lg bg-[#F59E0B] text-[#111827] text-sm font-semibold flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;