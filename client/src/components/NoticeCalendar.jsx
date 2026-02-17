import { useState } from 'react';
import Calendar from 'react-calendar';
import { CalendarDays } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

export default function NoticeCalendar({ notices, onDateSelect, selectedDate, compact }) {
  const datesWithNotices = notices.reduce((acc, n) => {
    if (n.createdAt) {
      const d = new Date(n.createdAt);
      const key = d.toDateString();
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  const tileClassName = ({ date }) => {
    const key = date.toDateString();
    return datesWithNotices[key] ? 'has-notice' : '';
  };

  const tileContent = ({ date }) => {
    const key = date.toDateString();
    const count = datesWithNotices[key];
    if (count) {
      return <span className="notice-dot" title={`${count} notice(s)`} />;
    }
    return null;
  };

  return (
    <div className={`notice-calendar-widget flex flex-col h-full overflow-hidden ${compact ? 'calendar-compact min-h-0' : 'min-h-[320px]'}`}>
      <div className="px-2 py-2 border-b border-slate-600/50 flex items-center gap-1.5 shrink-0">
        <CalendarDays className={`text-primary ${compact ? 'w-3.5 h-3.5' : 'w-5 h-5'}`} />
        <h3 className={`font-semibold text-slate-200 ${compact ? 'text-xs' : ''}`}>Notice Calendar</h3>
      </div>
      <div className={`flex-1 flex flex-col ${compact ? 'p-1.5' : 'p-3'}`}>
        <Calendar
          onChange={onDateSelect}
          value={selectedDate}
          tileClassName={tileClassName}
          tileContent={tileContent}
          prev2Label={null}
          next2Label={null}
        />
      </div>
    </div>
  );
}
