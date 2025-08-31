import AuthGuard from '@/components/auth/AuthGuard';
import Auth from '@/components/auth/Auth';

export default function AuthPage() {
  return (
    <AuthGuard requireAuth={false}>
      <Auth />
    </AuthGuard>
  );
}
