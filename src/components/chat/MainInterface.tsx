'use client';

import { useState } from 'react';
import ChatInterface from './ChatInterface';
import PackagesInterface from './PackagesInterface';

type ViewType = 'chat' | 'packages';

export default function MainInterface() {
  const [currentView, setCurrentView] = useState<ViewType>('chat');

  return (
    <div className="h-screen bg-[var(--background)]">
      {currentView === 'chat' ? (
        <ChatInterface onViewChange={setCurrentView} />
      ) : (
        <PackagesInterface onViewChange={setCurrentView} />
      )}
    </div>
  );
}
