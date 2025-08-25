import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#0a0a0a]">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl font-bold tracking-tight text-[#ffd700]">
            Welcome to Our dApp
          </h1>
          <p className="mt-4 text-center text-[#d4d4d4]">
            Connect your wallet to get started with the future of decentralized applications
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/auth"
            className="group relative flex w-full justify-center rounded-md bg-[#ffd700] px-3 py-2 text-sm font-semibold text-[#0a0a0a] hover:bg-[#b8860b] transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}
