import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Send, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api/axios';
import NoticeCard from '../components/NoticeCard';
import NoticeCalendar from '../components/NoticeCalendar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['Exam', 'Holiday', 'Event'];

export default function Home() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [allNotices, setAllNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', content: '', category: 'Exam' });
  const [submitting, setSubmitting] = useState(false);
  const [addErrors, setAddErrors] = useState({});

  const fetchNotices = async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    const data = await api.get(`/api/notices?${params}`).then((res) => res.data).catch(() => []);
    setAllNotices(data);
    return data;
  };

  useEffect(() => {
    setLoading(true);
    fetchNotices().then((data) => {
      let filtered = data;
      if (selectedDate) {
        const dateStr = new Date(selectedDate).toDateString();
        filtered = data.filter((n) => new Date(n.createdAt).toDateString() === dateStr);
      }
      setNotices(filtered);
    }).finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => {
    if (!selectedDate) {
      setNotices(allNotices);
    } else {
      const dateStr = new Date(selectedDate).toDateString();
      setNotices(allNotices.filter((n) => new Date(n.createdAt).toDateString() === dateStr));
    }
  }, [selectedDate, allNotices]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const validateAdd = () => {
    const e = {};
    if (!addForm.title.trim()) e.title = 'Title is required';
    if (!addForm.content.trim()) e.content = 'Content is required';
    setAddErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!validateAdd()) return;
    setSubmitting(true);
    try {
      await api.post('/api/notices', addForm);
      setAddForm({ title: '', content: '', category: 'Exam' });
      setAddErrors({});
      setShowAddForm(false);
      const data = await fetchNotices();
      setNotices(selectedDate ? data.filter((n) => new Date(n.createdAt).toDateString() === new Date(selectedDate).toDateString()) : data);
      toast.success('Notice posted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post notice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await api.delete(`/api/notices/${id}`);
      const data = await fetchNotices();
      if (selectedDate) {
        const d = new Date(selectedDate);
        setNotices(data.filter((n) => new Date(n.createdAt).toDateString() === d.toDateString()));
      } else {
        setNotices(data);
      }
      toast.success('Notice deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    }
  };

  const canAddNotice = user?.role === 'admin' || user?.role === 'faculty';

  return (
    <div className="min-h-screen">
      {/* Calendar - fixed top right, small */}
      <aside className="fixed top-20 right-4 z-30 w-48 rounded-xl overflow-hidden border border-slate-600/50 bg-slate-800/95 backdrop-blur shadow-xl">
        <NoticeCalendar
          notices={allNotices}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          compact
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            className="w-full px-2 py-2 text-xs font-medium text-slate-300 hover:text-primary hover:bg-slate-700/50 transition border-t border-slate-600/50"
          >
            Clear date
          </button>
        )}
      </aside>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-2 tracking-tight">
            Notice Board
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Stay updated with college announcements, exams, holidays, and events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pr-56">
        {canAddNotice && (
          <div className="mb-8 bg-slate-800/80 backdrop-blur rounded-2xl shadow-xl border border-slate-600/50 overflow-hidden">
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/50 transition"
            >
              <span className="flex items-center gap-2 font-semibold text-slate-100">
                <Plus className="w-5 h-5 text-primary" />
                Add New Notice
              </span>
              {showAddForm ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            {showAddForm && (
              <form onSubmit={handleAddNotice} className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={addForm.title}
                    onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                    placeholder="Notice title"
className={`w-full px-4 py-2.5 rounded-xl border outline-none transition bg-slate-700/50 text-slate-100 placeholder-slate-500 ${
                    addErrors.title ? 'border-red-500' : 'border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                  />
                  {addErrors.title && <p className="text-red-500 text-sm mt-1">{addErrors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  value={addForm.content}
                  onChange={(e) => setAddForm({ ...addForm, content: e.target.value })}
                  rows={3}
                  placeholder="Notice content..."
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition resize-none bg-slate-700/50 text-slate-100 placeholder-slate-500 ${
                    addErrors.content ? 'border-red-500' : 'border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  }`}
                />
                  {addErrors.content && <p className="text-red-500 text-sm mt-1">{addErrors.content}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-600 bg-slate-700/50 text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-medium hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60 transition"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Notice'}
                </button>
              </form>
            )}
          </div>
        )}

        <div>
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-800/60 backdrop-blur text-slate-100 placeholder-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-slate-400 shrink-0" />
                <button
                  onClick={() => setCategory('')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm ${
                    !category ? 'bg-primary text-white' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/80 border border-slate-600'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm ${
                      category === cat ? 'bg-primary text-white' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/80 border border-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-600/50 shadow-lg">
                <p className="text-slate-400 text-lg">No notices found.</p>
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Clear date filter
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notices.map((notice) => (
                  <NoticeCard
                    key={notice._id}
                    notice={notice}
                    onDelete={canAddNotice ? () => handleDeleteNotice(notice._id) : undefined}
                    canDelete={canAddNotice}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
