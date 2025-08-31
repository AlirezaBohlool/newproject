'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/hooks/useAuthStatus';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isFullyAuthenticated } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isFullyAuthenticated) {
      // اگر احراز هویت نیاز است ولی کاربر احراز هویت نشده، به صفحه auth هدایت کن
      router.push('/auth');
    } else if (!requireAuth && isFullyAuthenticated) {
      // اگر احراز هویت نیاز نیست ولی کاربر احراز هویت شده، به صفحه اصلی (چت) هدایت کن
      router.push('/');
    }
  }, [isFullyAuthenticated, requireAuth, router]);

  // اگر در حال بررسی احراز هویت هستیم، loading نشان بده
  if (requireAuth && !isFullyAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  // اگر احراز هویت نیاز نیست ولی کاربر احراز هویت شده، loading نشان بده
  if (!requireAuth && isFullyAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">در حال هدایت به چت...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
