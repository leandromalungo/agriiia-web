import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { DashboardPage } from './components/dashboard/DashboardPage';
import { FarmsPage } from './components/farms/FarmsPage';
import { NewFarmPage } from './components/farms/NewFarmPage';
import { FarmDetailPage } from './components/farms/FarmDetailPage';
import { MapPage } from './components/maps/MapPage';
import { MonitoringPage } from './components/monitoring/MonitoringPage';
import { AiAssistantPage } from './components/ai-assistant/AiAssistantPage';
import { WeatherPage } from './components/weather/WeatherPage';
import { SatellitePage } from './components/satellite/SatellitePage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';

function AppRouterSwitch() {
  const { currentPath, params } = useRouter();

  // Route matching
  if (currentPath === '/login') {
    return <LoginPage />;
  }
  if (currentPath === '/register') {
    return <RegisterPage />;
  }
  if (currentPath === '/forgot-password') {
    return <ForgotPasswordPage />;
  }

  return (
    <AppLayout>
      {(() => {
        if (currentPath === '/dashboard' || currentPath === '/') {
          return <DashboardPage />;
        }
        if (currentPath === '/farms/new') {
          return <NewFarmPage />;
        }
        if (params.farmId) {
          return <FarmDetailPage />;
        }
        if (currentPath === '/farms') {
          return <FarmsPage />;
        }
        if (currentPath === '/map') {
          return <MapPage />;
        }
        if (currentPath === '/monitoring') {
          return <MonitoringPage />;
        }
        if (currentPath === '/ai-assistant') {
          return <AiAssistantPage />;
        }
        if (currentPath === '/weather') {
          return <WeatherPage />;
        }
        if (currentPath === '/satellite') {
          return <SatellitePage />;
        }
        if (currentPath === '/calendar') {
          return <CalendarPage />;
        }
        if (currentPath === '/reports') {
          return <ReportsPage />;
        }
        if (currentPath === '/notifications') {
          return <NotificationsPage />;
        }
        if (currentPath === '/settings') {
          return <SettingsPage />;
        }

        return <DashboardPage />;
      })()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <AppRouterSwitch />
      </AppProvider>
    </RouterProvider>
  );
}
