import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Farm,
  AgriculturalActivity,
  AgriculturalAlert,
  NotificationItem,
  UserProfile,
} from '../types';
import { FarmService } from '../lib/services/farmService';
import { ActivityService } from '../lib/services/activityService';
import { AlertService } from '../lib/services/alertService';
import { NotificationService } from '../lib/services/notificationService';
import { DEFAULT_USER_PROFILE } from '../data/mock-data';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  farms: Farm[];
  activities: AgriculturalActivity[];
  alerts: AgriculturalAlert[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  selectedFarmId: string;
  setSelectedFarmId: (id: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  refreshData: () => void;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'agriia_user_profile_v1';
const AUTH_STORAGE_KEY = 'agriia_auth_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [farms, setFarms] = useState<Farm[]>(() => FarmService.getAll());
  const [activities, setActivities] = useState<AgriculturalActivity[]>(() => ActivityService.getAll());
  const [alerts, setAlerts] = useState<AgriculturalAlert[]>(() => AlertService.getAll());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => NotificationService.getAll());
  const [selectedFarmId, setSelectedFarmId] = useState<string>('farm-1');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USER_PROFILE;
  });

  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return true; // Default logged in for smooth exploration of the SaaS dashboard
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshData = useCallback(() => {
    setFarms(FarmService.getAll());
    setActivities(ActivityService.getAll());
    setAlerts(AlertService.getAll());
    setNotifications(NotificationService.getAll());
  }, []);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = useCallback(
    (title: string, description?: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        farms,
        activities,
        alerts,
        notifications,
        unreadNotifsCount,
        selectedFarmId,
        setSelectedFarmId,
        userProfile,
        updateUserProfile,
        isAuthenticated,
        setIsAuthenticated,
        refreshData,
        toasts,
        showToast,
        dismissToast,
        sidebarCollapsed,
        setSidebarCollapsed,
        searchOpen,
        setSearchOpen,
        helpOpen,
        setHelpOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
