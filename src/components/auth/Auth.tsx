'use client';
import React, { useState } from 'react';
import { useAuthWallet } from '@/wallet/hooks/auth-wallet';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'connect' | 'sign' | 'authenticate'>('connect');
  const [referralCode, setReferralCode] = useState('DEMO123'); // Default referral code
  
  const {
    isLoading,
    walletError,
    generalError,
    isConnected,
    address,
    handleConnectWallet,
    handleAuth,
  } = useAuthWallet({
    metaData: "123",
    iso3: "USA", // You can make this configurable or get from user preferences
    referralCode, // Use the state value instead of empty string
    mode,
    onSuccess: () => setSubmitted(true),
    onError: (err) => {
      console.error(`${mode} error:`, err);
      setError(err?.message || `${mode} failed`);
      setStep('connect'); // Reset to connect step on error
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('connect');
    
    if (!isConnected) {
      handleConnectWallet();
      return;
    }
    
    try {
      setStep('sign');
      await handleAuth();
      setStep('authenticate');
    } catch (err: any) {
      console.error(`${mode} submission error:`, err);
      setError(err?.message || `${mode} failed`);
      setStep('connect');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSubmitted(false);
    setStep('connect');
  };

  const getStepDescription = () => {
    switch (step) {
      case 'connect':
        return 'Connect your wallet to get started';
      case 'sign':
        return 'Please sign the message in your wallet';
      case 'authenticate':
        return 'Authenticating with the server...';
      default:
        return '';
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      switch (step) {
        case 'connect':
          return 'Connecting...';
        case 'sign':
          return 'Waiting for signature...';
        case 'authenticate':
          return 'Authenticating...';
        default:
          return 'Processing...';
      }
    }
    
    if (!isConnected) {
      return 'Connect Wallet';
    }
    
    return mode === 'login' ? 'Login' : 'Complete Registration';
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Login' : 'Registration'} Successful!
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Your wallet has been authenticated.'
              : 'Your wallet has been authenticated and registered.'
            }
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            {mode === 'login' ? 'Login' : 'Register'} with Wallet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' 
              ? 'Connect your wallet to sign in to your account'
              : 'Connect your wallet to create a new account'
            }
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Progress Indicator */}
          {isConnected && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-800 font-medium mb-2">Current Step:</div>
              <div className="text-blue-700 text-sm">{getStepDescription()}</div>
            </div>
          )}
          
          {/* Referral Code Input */}
          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 mb-2">
              Referral Code
            </label>
            <input
              id="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter referral code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to use default: DEMO123
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {getButtonText()}
                </div>
              ) : (
                getButtonText()
              )}
            </button>
          </div>
          
          {/* Error Messages */}
          {walletError && (
            <div className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-md">
              <div className="font-medium">Wallet Error:</div>
              {walletError}
            </div>
          )}
          {generalError && (
            <div className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-md">
              <div className="font-medium">General Error:</div>
              {generalError}
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-md">
              <div className="font-medium">Error:</div>
              {error}
            </div>
          )}
          
          {/* Connection Status */}
          {isConnected && address && (
            <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <div className="font-medium">Wallet Connected</div>
              <div className="font-mono text-xs mt-1">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              {mode === 'login' 
                ? "Don't have an account? Register here"
                : "Already have an account? Login here"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
