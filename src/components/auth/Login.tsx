'use client';
import React, { useState } from 'react';
import { useEnhancedWalletLogin } from '@/wallet/hooks';

const Login = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const {
    isLoading,
    walletError,
    isConnected,
    address,
    handleConnectWallet,
    handleWalletLogin,
  } = useEnhancedWalletLogin({
    onLoginSuccess: () => setSubmitted(true),
    onLoginError: (err) => setError(err?.message || 'Login failed'),
    onWalletSourceCreated: (response) => {
      console.log('Wallet source created:', response);
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
      setError(err?.message || 'Login failed');
    }
  };

  if (submitted) return <div>Login successful!</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Login with Wallet
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              {isConnected ? 'Login' : 'Connect Wallet'}
            </button>
          </div>
          {walletError && <div className="text-red-500 text-center">{walletError}</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
