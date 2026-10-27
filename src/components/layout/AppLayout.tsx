import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../ui/ToastContainer';
import { SearchModal } from '../ui/SearchModal';
import { HelpModal } from '../ui/HelpModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentPath } = useRouter();
  const { helpOpen, setHelpOpen } = useApp();

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

        <main className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
          <div className="max-w-7xl mx-auto space-y-4">{children}</div>
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <SearchModal />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
      <ToastContainer />
    </div>
  );
}
