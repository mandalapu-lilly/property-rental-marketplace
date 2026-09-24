import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

const STORAGE_KEY = 'havenstay_compare_properties';
const MAX_COMPARE_LIMIT = 4;

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load compare items from localStorage:', e);
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
    } catch (e) {
      console.warn('Failed to save compare items to localStorage:', e);
    }
  }, [compareList]);

  // Auto-dismiss toast notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
  };

  const isInCompare = (propertyId) => {
    if (!propertyId) return false;
    return compareList.some((item) => (item._id || item.id) === propertyId);
  };

  const addToCompare = (property) => {
    if (!property || !property._id) return false;

    if (isInCompare(property._id)) {
      showToast(`"${property.title || 'Property'}" is already in your comparison list.`, 'info');
      return false;
    }

    if (compareList.length >= MAX_COMPARE_LIMIT) {
      showToast(`You can compare up to ${MAX_COMPARE_LIMIT} properties at a time. Remove one to add another.`, 'warning');
      return false;
    }

    // Keep minimal required properties to be resilient
    const itemToAdd = {
      _id: property._id,
      title: property.title,
      price: property.price,
      location: property.location,
      city: property.city,
      state: property.state,
      address: property.address,
      propertyType: property.propertyType,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      images: Array.isArray(property.images) ? property.images : [],
      status: property.status || 'available',
      averageRating: property.averageRating || 0,
      totalReviews: property.totalReviews || 0,
      description: property.description || '',
      verificationStatus: property.verificationStatus || 'approved',
      owner: property.owner,
    };

    setCompareList((prev) => [...prev, itemToAdd]);
    showToast(`Added "${property.title || 'Property'}" to comparison list (${compareList.length + 1}/${MAX_COMPARE_LIMIT}).`, 'success');
    return true;
  };

  const removeFromCompare = (propertyId) => {
    if (!propertyId) return;
    setCompareList((prev) => {
      const removedItem = prev.find((item) => (item._id || item.id) === propertyId);
      if (removedItem) {
        showToast(`Removed "${removedItem.title || 'Property'}" from comparison.`, 'info');
      }
      return prev.filter((item) => (item._id || item.id) !== propertyId);
    });
  };

  const toggleCompare = (property) => {
    if (!property || !property._id) return;
    if (isInCompare(property._id)) {
      removeFromCompare(property._id);
    } else {
      addToCompare(property);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('Comparison list cleared.', 'info');
  };

  const value = {
    compareList,
    compareCount: compareList.length,
    maxLimit: MAX_COMPARE_LIMIT,
    addToCompare,
    removeFromCompare,
    toggleCompare,
    clearCompare,
    isInCompare,
    notification,
    dismissNotification: () => setNotification(null),
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}

export default CompareContext;
