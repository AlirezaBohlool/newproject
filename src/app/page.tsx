import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl font-bold tracking-tight text-yellow-500">
            Welcome to Our dApp
          </h1>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/auth/login"
            className="group relative flex w-full justify-center rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-400 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="group relative flex w-full justify-center rounded-md border-2 border-yellow-500 px-3 py-2 text-sm font-semibold text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
