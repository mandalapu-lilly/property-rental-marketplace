import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ArrowRight, Plus, X, Search, Check } from 'lucide-react';

const STORAGE_KEY = 'havenstay_saved_searches';

export default function SavedSearchesDrawer({ currentFilters, onApplySearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedList, setSavedList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadSaved = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedList(JSON.parse(raw));
      }
    } catch {
      setSavedList([]);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleSaveCurrent = (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      name: searchName.trim(),
      filters: { ...currentFilters },
      savedAt: new Date().toLocaleDateString(),
    };

    const updated = [newEntry, ...savedList];
    setSavedList(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSearchName('');
    setIsSaving(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = savedList.filter((s) => s.id !== id);
    setSavedList(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl transition-colors shadow-sm"
      >
        <Bookmark className="w-3.5 h-3.5" />
        <span>Saved Searches ({savedList.length})</span>
      </button>

      {/* Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm">Saved Search Queries</h3>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsSaving(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Save Current Search Form */}
              {!isSaving ? (
                <button
                  onClick={() => setIsSaving(true)}
                  className="w-full py-2.5 px-3 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Save Current Filter Preset
                </button>
              ) : (
                <form onSubmit={handleSaveCurrent} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-700">Preset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Budget 2BHK in Vijayawada"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSaving(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
                    >
                      Save Preset
                    </button>
                  </div>
                </form>
              )}

              {/* Saved List */}
              {savedList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No saved searches yet. Click above to save your active filters.
                </div>
              ) : (
                <div className="space-y-2">
                  {savedList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onApplySearch(item.filters);
                        setIsOpen(false);
                      }}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {item.filters.city || 'All Cities'} • {item.filters.propertyType || 'All Types'} • {item.filters.bedrooms ? `${item.filters.bedrooms} BHK` : 'Any BHK'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete saved search"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
