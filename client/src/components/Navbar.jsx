import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary-light to-primary shadow-lg shadow-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-white hover:opacity-90 transition">
            <div className="p-1.5 rounded-lg bg-white/15 backdrop-blur">
              <BookOpen className="w-6 h-6" />
            </div>
            <span>College Notice Board</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-white/90 hidden sm:inline flex items-center gap-2">
                  {user.name}
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-amber-400/30 rounded-md text-amber-100 text-xs font-medium">Admin</span>
                  )}
                  {user.role === 'faculty' && (
                    <span className="px-2 py-0.5 bg-emerald-400/30 rounded-md text-emerald-100 text-xs font-medium">Faculty</span>
                  )}
                  {user.role === 'student' && (
                    <span className="px-2 py-0.5 bg-white/20 rounded-md text-white/90 text-xs font-medium">Student</span>
                  )}
                </span>
                {(user.role === 'admin' || user.role === 'faculty') && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary font-medium hover:bg-white/95 transition shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
