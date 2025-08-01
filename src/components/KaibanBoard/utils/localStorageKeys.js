/**
 * Local Storage Keys Utility
 * Manages API keys and analytics data in localStorage
 */

const KEYS_STORAGE_KEY = 'kaibanboard_api_keys';
const ANALYTICS_STORAGE_KEY = 'kaibanboard_analytics';

// API Keys Management
export const saveKeysToLocalStorage = (keys) => {
  try {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
    return true;
  } catch (error) {
    console.error('Failed to save keys to localStorage:', error);
    return false;
  }
};

export const loadKeysFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(KEYS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load keys from localStorage:', error);
    return [];
  }
};

// Analytics Management
export const saveAnalyticsToLocalStorage = (analyticsData) => {
  try {
    const existing = loadAnalyticsFromLocalStorage();
    const updated = [...existing, analyticsData];
    
    // Keep only last 50 sessions to prevent localStorage bloat
    const limited = updated.slice(-50);
    
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Failed to save analytics to localStorage:', error);
    return false;
  }
};

export const loadAnalyticsFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load analytics from localStorage:', error);
    return [];
  }
};

export const generateAnalyticsSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getAnalyticsStorageStats = () => {
  try {
    const analytics = loadAnalyticsFromLocalStorage();
    const keys = loadKeysFromLocalStorage();
    
    return {
      analyticsCount: analytics.length,
      keysCount: keys.length,
      totalSessions: analytics.length,
      lastSessionDate: analytics.length > 0 ? analytics[analytics.length - 1].endTime : null,
      storageSize: {
        analytics: JSON.stringify(analytics).length,
        keys: JSON.stringify(keys).length
      }
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      analyticsCount: 0,
      keysCount: 0,
      totalSessions: 0,
      lastSessionDate: null,
      storageSize: { analytics: 0, keys: 0 }
    };
  }
};

export const deleteAnalyticsSession = (sessionId) => {
  try {
    const analytics = loadAnalyticsFromLocalStorage();
    const filtered = analytics.filter(session => session.sessionId !== sessionId);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete analytics session:', error);
    return false;
  }
};

export const clearAnalyticsFromLocalStorage = () => {
  try {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear analytics from localStorage:', error);
    return false;
  }
};