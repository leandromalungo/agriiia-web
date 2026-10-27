import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/ToastContainer';
import { SearchModal } from '../ui/SearchModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentPath } = useRouter();

  // If on auth routes, render full screen without dashboard shell
  const isAuthPage =
    currentPath === '/login' ||
    currentPath === '/register' ||
    currentPath === '/forgot-password';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#F8FAF5] font-sans text-[#1F2937]">
        {children}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAF5] font-sans text-[#1F2937]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <SearchModal />
      <ToastContainer />
    </div>
  );
}
