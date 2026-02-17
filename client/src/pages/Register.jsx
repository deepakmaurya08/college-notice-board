import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, GraduationCap } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });
      register(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/90 backdrop-blur rounded-2xl shadow-xl border border-slate-600/50 p-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Create account</h2>
          <p className="text-slate-400 mb-6">Join the college notice board</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                    errors.name ? 'border-red-500' : 'border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  placeholder="Your name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                    errors.email ? 'border-red-500' : 'border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  placeholder="you@college.edu"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Register as</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={form.role === 'student'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="text-primary"
                  />
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="faculty"
                    checked={form.role === 'faculty'}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="text-primary"
                  />
                  <span className="text-slate-300">Faculty</span>
                </label>
              </div>
              <p className="text-slate-500 text-xs mt-1">Faculty can post notices on the board.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                    errors.password ? 'border-red-500' : 'border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  placeholder="Min 6 characters"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600 bg-slate-700/50 text-slate-100 placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-medium hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 transition"
            >
              <UserPlus className="w-5 h-5" />
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="mt-6 text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
