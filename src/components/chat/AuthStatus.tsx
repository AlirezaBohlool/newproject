'use client';

import { useAuthStatus } from '@/hooks/useAuthStatus';

export default function AuthStatus() {
  const { isFullyAuthenticated, currentRoleId } = useAuthStatus();

  if (!isFullyAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className="w-2 h-2 bg-[var(--success)] rounded-full"></div>
      <span className="text-[var(--text-secondary)]">احراز هویت شده</span>
      {currentRoleId && (
        <span className="text-[var(--primary)] font-medium">• {currentRoleId}</span>
      )}
    </div>
  );
}
