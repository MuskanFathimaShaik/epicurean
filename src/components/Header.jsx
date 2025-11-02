import { ChefHat, Heart, Bookmark, Utensils, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <ChefHat className="text-white" size={24} />
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/20 to-transparent mix-blend-overlay" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent tracking-tight">
                  Epicurean
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">
                  CULINARY EXCELLENCE
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink
                to="/"
                icon={<Utensils size={18} />}
                isActive={location.pathname === "/"}
              >
                Home
              </NavLink>
              <NavLink
                to="/all-recipes"
                isActive={location.pathname === "/all-recipes"}
              >
                All Recipes
              </NavLink>
              <NavLink
                to="/categories"
                isActive={location.pathname === "/categories"}
              >
                Categories
              </NavLink>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <ActionButton
                  to="/liked-recipes"
                  icon={<Heart size={18} />}
                  accent="red"
                >
                  Liked
                </ActionButton>
                <ActionButton
                  to="/saved-recipes"
                  icon={<Bookmark size={18} />}
                  accent="blue"
                >
                  Saved
                </ActionButton>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="fixed top-0 right-0 h-screen w-80 max-w-full bg-white/95 backdrop-blur-lg border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300">
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-6 space-y-4">
                  <MobileNavLink
                    to="/"
                    icon={<Utensils size={20} />}
                    isActive={location.pathname === "/"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </MobileNavLink>
                  <MobileNavLink
                    to="/all-recipes"
                    isActive={location.pathname === "/all-recipes"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    All Recipes
                  </MobileNavLink>
                  <MobileNavLink
                    to="/categories"
                    isActive={location.pathname === "/categories"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Categories
                  </MobileNavLink>
                </nav>

                {/* Action Buttons Section */}
                <div className="p-6 border-t border-gray-200 space-y-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    My Recipes
                  </div>
                  <MobileActionButton
                    to="/liked-recipes"
                    icon={<Heart size={20} />}
                    accent="red"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Liked Recipes
                  </MobileActionButton>
                  <MobileActionButton
                    to="/saved-recipes"
                    icon={<Bookmark size={20} />}
                    accent="blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Saved Recipes
                  </MobileActionButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

// Desktop NavLink Component
const NavLink = ({ to, children, icon, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
        isActive
          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm"
          : "text-gray-600 hover:text-green-600 hover:bg-green-50"
      }`}
    >
      {icon && <span>{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </Link>
  );
};

// Mobile NavLink Component
const MobileNavLink = ({ to, children, icon, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-base ${
        isActive
          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 shadow-sm"
          : "text-gray-700 hover:text-green-600 hover:bg-green-50"
      }`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

// Desktop Action Button Component
const ActionButton = ({ to, icon, children, accent = "gray" }) => {
  const accentColors = {
    red: "text-red-600 hover:bg-red-50 hover:text-red-700",
    blue: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  };

  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${accentColors[accent]}`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

// Mobile Action Button Component
const MobileActionButton = ({
  to,
  icon,
  children,
  accent = "gray",
  onClick,
}) => {
  const accentColors = {
    red: "text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200",
    blue: "text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200",
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-base border ${accentColors[accent]}`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default Header;
