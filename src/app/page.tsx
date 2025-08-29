import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-[var(--background)]">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl font-bold tracking-tight gradient-text font-heading">
            Welcome to Our dApp
          </h1>
          <p className="mt-4 text-center text-[var(--text-secondary)] font-body text-lg leading-relaxed">
            Connect your wallet to get started with the future of decentralized applications
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/auth"
            className="group relative flex w-full justify-center rounded-md bg-[var(--button-primary)] px-3 py-2 text-sm font-semibold text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] transition-colors duration-200 shadow-lg hover:shadow-xl font-body"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}
