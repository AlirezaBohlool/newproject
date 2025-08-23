'use client';
import React, { useState } from 'react';
import { useEnhancedWalletLogin } from '@/wallet/hooks';

const Register = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isRegistration, setIsRegistration] = useState(true);
  
  const {
    isLoading,
    walletError,
    isConnected,
    address,
    handleConnectWallet,
    handleWalletLogin,
  } = useEnhancedWalletLogin({
    onLoginSuccess: () => setSubmitted(true),
    onLoginError: (err) => setError(err?.message || 'Registration failed'),
    onWalletSourceCreated: (response) => {
      console.log('Wallet source created during registration:', response);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isConnected) {
      handleConnectWallet();
      return;
    }
    try {
      await handleWalletLogin();
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    }
  };

  if (submitted) return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold">Registration Successful!</h2>
        <p className="text-gray-600">Your wallet has been authenticated and registered.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Register with Wallet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect your wallet to create a new account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {isLoading ? 'Processing...' : isConnected ? 'Complete Registration' : 'Connect Wallet'}
            </button>
          </div>
          {walletError && <div className="text-red-500 text-center">{walletError}</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
          {isConnected && address && (
            <div className="text-center text-sm text-gray-600">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
