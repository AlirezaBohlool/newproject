'use client';

import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useDisconnect } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const { isFullyAuthenticated, currentRoleId } = useAuthStatus();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const handleLogout = () => {
    disconnect();
    router.push('/auth');
  };

  if (!isFullyAuthenticated) {
    return null;
  }

  return (
    <div className="p-4 border-t border-[var(--border)]">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
          U
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-[var(--text-primary)]">کاربر احراز هویت شده</div>
          <div className="text-xs text-[var(--text-secondary)]">
            نقش: {currentRoleId || 'پکیج پایه'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
          title="خروج"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
