import AuthGuard from '../components/auth/AuthGuard';
import MainInterface from '../components/chat/MainInterface';

export default function HomePage() {
  return (
    <AuthGuard requireAuth={true}>
      <MainInterface />
    </AuthGuard>
  );
}
