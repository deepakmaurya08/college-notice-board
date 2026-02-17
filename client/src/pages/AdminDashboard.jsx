import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Send, LayoutDashboard } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import NoticeCard from '../components/NoticeCard';
import toast from 'react-hot-toast';

const CATEGORIES = ['Exam', 'Holiday', 'Event'];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', category: 'Exam' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'faculty'))) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'faculty') {
      api
        .get('/api/notices')
        .then((res) => setNotices(res.data))
        .catch(() => setNotices([]))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.content.trim()) e.content = 'Content is required';
    if (!form.category) e.category = 'Category is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/notices', form);
      setNotices((prev) => [data, ...prev]);
      setForm({ title: '', content: '', category: 'Exam' });
      setErrors({});
      toast.success('Notice posted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post notice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await api.delete(`/api/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notice deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    }
  };

  if (authLoading || (!user || (user.role !== 'admin' && user.role !== 'faculty'))) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            {user.role === 'admin' ? 'Admin' : 'Faculty'} Dashboard
          </h1>
          <p className="text-slate-400">Post and manage college notices.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800/80 backdrop-blur rounded-2xl shadow-xl border border-slate-600/50 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Post New Notice
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition ${
                    errors.title ? 'border-red-500' : 'border-slate-600 bg-slate-700/50 text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  placeholder="Notice title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition resize-none ${
                    errors.content ? 'border-red-500' : 'border-slate-600 bg-slate-700/50 text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  placeholder="Notice content..."
                />
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-medium hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 transition"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Posting...' : 'Post Notice'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">All Notices</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-slate-200/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/60 rounded-2xl border border-slate-600/50">
              <p className="text-slate-400">No notices yet. Post one above!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {notices.map((notice) => (
                <NoticeCard key={notice._id} notice={notice} onDelete={handleDelete} canDelete={user.role === 'admin' || user.role === 'faculty'} />
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
