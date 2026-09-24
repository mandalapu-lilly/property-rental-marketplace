import { Link, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import {
  Layers,
  X,
  ArrowRight,
  Trash2,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

export default function CompareBar() {
  const {
    compareList,
    compareCount,
    maxLimit,
    removeFromCompare,
    clearCompare,
    notification,
    dismissNotification,
  } = useCompare();

  const location = useLocation();

  const isComparePage = location.pathname === '/compare';

  return (
    <>
      {/* Dynamic Floating Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-bounce-in max-w-sm">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40 shadow-emerald-950/30'
                : notification.type === 'warning'
                ? 'bg-amber-950/90 text-amber-100 border-amber-500/40 shadow-amber-950/30'
                : 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-slate-950/40'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : notification.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {notification.message}
            </div>
            <button
              onClick={dismissNotification}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Comparison Dock (Visible when 1+ items and not on /compare) */}
      {compareCount > 0 && !isComparePage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl animate-slide-up">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-3.5 sm:p-4 shadow-2xl shadow-indigo-950/50 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            {/* Left: Indicator & Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
              <div className="flex items-center gap-2 pr-2 border-r border-slate-700/70 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Compare Properties</span>
                    <span className="bg-indigo-500/30 text-indigo-300 px-2 py-0.2 rounded-full text-[10px] font-extrabold border border-indigo-500/40">
                      {compareCount}/{maxLimit}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    {compareCount < 2 ? 'Select 1 more to compare' : `${compareCount} stays ready`}
                  </p>
                </div>
              </div>

              {/* Thumbnails of selected properties */}
              <div className="flex items-center gap-2 shrink-0">
                {compareList.map((item) => (
                  <div
                    key={item._id}
                    className="relative group w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0"
                    title={item.title}
                  >
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                    <button
                      onClick={() => removeFromCompare(item._id)}
                      className="absolute inset-0 bg-rose-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 justify-end shrink-0">
              <button
                onClick={clearCompare}
                className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>

              <Link
                to="/compare"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Compare Side-by-Side</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
