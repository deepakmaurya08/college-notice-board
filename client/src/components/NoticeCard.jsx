import { Calendar, User, Tag, Trash2 } from 'lucide-react';

const categoryColors = {
  Exam: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  Holiday: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  Event: 'bg-blue-900/40 text-blue-300 border-blue-700/50'
};

export default function NoticeCard({ notice, onDelete, canDelete }) {
  const date = new Date(notice.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <article className="group bg-slate-800/80 backdrop-blur rounded-2xl shadow-lg border border-slate-600/50 hover:border-slate-500/70 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-0.5">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryColors[notice.category] || 'bg-slate-700/50 text-slate-300 border-slate-600'}`}
          >
            <Tag className="w-3 h-3" />
            {notice.category}
          </span>
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(notice._id)}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 px-2 py-1 rounded-lg transition text-sm"
              title="Delete notice"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
        <h3 className="font-semibold text-slate-100 text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">{notice.title}</h3>
        <p className="text-slate-400 text-sm flex-1 line-clamp-4">{notice.content}</p>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-600/50 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {notice.postedBy?.name || 'Admin'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
        </div>
      </div>
    </article>
  );
}
