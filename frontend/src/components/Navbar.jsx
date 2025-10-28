import { Link, useNavigate } from "react-router-dom";
import { UserCircle2, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logoo.png";

export default function Navbar({ onHamburgerClick, showHamburger }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo + Hamburger */}
          <div className="flex items-center gap-4">
            {showHamburger && (
              <button
                onClick={onHamburgerClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="GubaPost Logo"
                className="w-12 sm:w-14 h-10 sm:h-12 object-contain"
              />
              <span className="text-2xl sm:text-3xl font-extrabold text-green-600 tracking-tight hover:text-green-700 transition duration-200">
                GubaPost
              </span>
            </Link>
          </div>

          {/* Right: User profile */}
          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate("/account")}
                className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 transition duration-200"
              >
                <UserCircle2 className="w-8 h-8 text-gray-700 hover:text-green-600 transition duration-200" />
                <span className="hidden sm:inline text-gray-800 font-medium">{user.username}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Optional bottom border / shadow effect */}
      <div className="hidden sm:block border-t border-gray-100"></div>
    </nav>
  );
}
