import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '../services/api';

export default function AvailabilityCalendar({ propertyId, price = 0 }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    let isMounted = true;
    if (!propertyId) return;

    // Fetch existing confirmed/pending bookings for this property
    api.get(`/api/bookings/property/${propertyId}`)
      .then((res) => {
        if (isMounted && res.data?.bookings) {
          setBookedDates(res.data.bookings);
        }
      })
      .catch(() => {
        // Fallback or empty if not available
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [propertyId]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Compute days in current month
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const isDateBooked = (day) => {
    const checkDate = new Date(currentYear, currentMonth, day, 12, 0, 0);
    return bookedDates.some((b) => {
      if (b.status === 'cancelled' || b.status === 'rejected') return false;
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return checkDate >= start && checkDate <= end;
    });
  };

  const isPast = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentYear, currentMonth, day);
    return checkDate < today;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Property Availability Calendar</h3>
            <p className="text-xs text-slate-500">Live booking status and available stay dates</p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-sm text-slate-800 min-w-[120px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Empty slots for start of month */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl bg-slate-50/50" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const booked = isDateBooked(day);
          const past = isPast(day);

          let cellClass = "bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80";
          let badgeText = "Available";

          if (past) {
            cellClass = "bg-slate-50 border-slate-200/50 text-slate-300 cursor-not-allowed";
            badgeText = "Past";
          } else if (booked) {
            cellClass = "bg-rose-50 border-rose-200 text-rose-700 cursor-not-allowed";
            badgeText = "Booked";
          }

          return (
            <div
              key={`day-${day}`}
              className={`h-10 sm:h-12 rounded-xl border flex flex-col items-center justify-center transition-all text-xs font-medium relative ${cellClass}`}
              title={`${monthNames[currentMonth]} ${day}, ${currentYear} - ${badgeText}`}
            >
              <span className="font-bold">{day}</span>
              <span className="text-[9px] scale-90 hidden sm:inline-block opacity-80">{badgeText}</span>
            </div>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300" />
          <span>Available for Rent</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-300" />
          <span>Already Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-300" />
          <span>Past Dates</span>
        </div>
      </div>
    </div>
  );
}
