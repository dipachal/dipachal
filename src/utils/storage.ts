// Utility functions for local storage and system activity logging

export function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  userName: string;
  details: string;
  category: 'booking' | 'fleet' | 'security' | 'financial' | 'general';
}

export function logActivity(
  action: string, 
  userName: string, 
  details: string, 
  category: 'booking' | 'fleet' | 'security' | 'financial' | 'general' | string = 'general'
): void {
  try {
    const logs = getLocalItem<ActivityLog[]>('dwipachal_activity_logs', []);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      userName,
      details,
      category: category as any,
    };
    const updatedLogs = [newLog, ...logs].slice(0, 100); // keep last 100 logs
    setLocalItem('dwipachal_activity_logs', updatedLogs);
  } catch (e) {
    console.warn('Failed to record activity log:', e);
  }
}
