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
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9] bg-[#f4f0e8] dark:bg-[#27272a] hover:bg-[#eae3d6] dark:hover:bg-[#3f3f46] border border-[#ded7cb] dark:border-[#3f3f46] rounded-xl transition-colors shadow-xs cursor-pointer"
      >
        <Bookmark className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
        <span>Saved Searches ({savedList.length})</span>
      </button>

      {/* Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1c1c20] w-full max-w-md rounded-3xl shadow-editorial-lg border border-[#e5e0d8] dark:border-[#27272a] overflow-hidden animate-scaleIn">
            <div className="bg-[#18181b] dark:bg-[#121214] text-white p-4 flex items-center justify-between border-b border-[#27272a]">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#d4b996]" />
                <h3 className="font-bold text-sm">Saved Search Queries</h3>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsSaving(false);
                }}
                className="p-1 rounded-lg text-[#a1a1aa] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto bg-white dark:bg-[#1c1c20]">
              {/* Save Current Search Form */}
              {!isSaving ? (
                <button
                  onClick={() => setIsSaving(true)}
                  className="w-full py-2.5 px-3 border-2 border-dashed border-[#ded7cb] dark:border-[#3f3f46] rounded-xl text-xs font-bold text-[#18181b] dark:text-[#d4b996] hover:bg-[#fbfbf9] dark:hover:bg-[#27272a] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#b58d59] dark:text-[#d4b996]" />
                  Save Current Filter Preset
                </button>
              ) : (
                <form onSubmit={handleSaveCurrent} className="bg-[#fbfbf9] dark:bg-[#141417] p-3 rounded-xl border border-[#e5e0d8] dark:border-[#27272a] space-y-2.5">
                  <label className="block text-xs font-semibold text-[#18181b] dark:text-[#fbfbf9]">Preset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Budget 2BHK in Vijayawada"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#ded7cb] dark:border-[#3f3f46] bg-white dark:bg-[#1c1c20] text-[#18181b] dark:text-[#fbfbf9] focus:ring-2 focus:ring-[#b58d59] focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSaving(false)}
                      className="px-2.5 py-1 text-xs text-[#71717a] dark:text-[#a1a1aa] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold text-white bg-[#18181b] hover:bg-black dark:bg-[#d4b996] dark:hover:bg-[#c5a880] dark:text-[#18181b] rounded-md shadow-sm cursor-pointer"
                    >
                      Save Preset
                    </button>
                  </div>
                </form>
              )}

              {/* Saved List */}
              {savedList.length === 0 ? (
                <div className="text-center py-6 text-[#8c827a] dark:text-[#71717a] text-xs">
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
                      className="p-3 bg-[#fbfbf9] dark:bg-[#141417] hover:bg-[#f4f0e8] dark:hover:bg-[#27272a] border border-[#e5e0d8] dark:border-[#27272a] hover:border-[#b58d59]/50 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] flex items-center gap-1.5">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] mt-0.5">
                          {item.filters.city || 'All Cities'} • {item.filters.propertyType || 'All Types'} • {item.filters.bedrooms ? `${item.filters.bedrooms} BHK` : 'Any BHK'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 text-[#8c827a] hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete saved search"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-[#8c827a] group-hover:text-[#b58d59] dark:group-hover:text-[#d4b996] group-hover:translate-x-0.5 transition-transform" />
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
