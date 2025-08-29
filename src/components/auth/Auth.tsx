'use client';
import React, { useState, useEffect } from 'react';
import { useAuthWallet } from '@/wallet/hooks/auth-wallet';
import { useDisconnect } from '@reown/appkit/react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { DecodedToken } from '@/store/auth';
import RoleSelectionModal from './RoleSelectionModal';
import { useSetRole } from '@/hooks/set-role';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'connect' | 'sign' | 'authenticate'>('connect');
  const [referralCode, setReferralCode] = useState('DEMO123'); // Default referral code
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const { roles, token } = useSelector((state: RootState) => state.auth);
  const { setRole, isLoading: setRoleLoading } = useSetRole();
  const router = useRouter();
  
  const { disconnect } = useDisconnect();
  
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
    iso3: "USA",
    referralCode, // Use the state value
    mode,
    onSuccess: (response) => {
      
      // Extract roles from the response token immediately
      let responseRoles: any[] = [];
      try {
        if (response.result && response.result.token) {
          const decoded = jwtDecode<DecodedToken>(response.result.token);
          responseRoles = decoded.roles || [];
        }
      } catch (error) {
        console.error('❌ Failed to decode token from response:', error);
      }
      
      // Check if user has roles to select from
      if (responseRoles && responseRoles.length > 0) {
        if (responseRoles.length === 1) {
          // Auto-set role if user has only one role
          handleAutoSetRole(responseRoles[0].roleId, response.result.token);
        } else {
          // Show modal if user has multiple roles
          setShowRoleModal(true);
        }
      } else {
        setSubmitted(true);
      }
    },
    onError: (err) => {
      console.error(`${mode} error:`, err);
      setError(err?.message || `${mode} failed`);
      setStep('connect'); // Reset to connect step on error
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading || setRoleLoading) {
      return;
    }
    
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

  const handleAutoSetRole = async (roleId: string, authToken: string) => {
    if (!authToken) {
      console.error('No token available for auto role setting');
      return;
    }

    try {
      await setRole(authToken, roleId);
      setSubmitted(true);
    } catch (error) {
      console.error('❌ Failed to auto-set role:', error);
      setError('Failed to set role automatically. Please try again.');
    }
  };

  const handleReset = () => {
    // Disconnect wallet and reset state for testing
    disconnect();
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
        return `${mode === 'login' ? 'Logging in' : 'Registering'} with the server...`;
      default:
        return '';
    }
  };

  const getButtonText = () => {
    if (isLoading || setRoleLoading) {
      switch (step) {
        case 'connect':
          return 'Connecting...';
        case 'sign':
          return 'Waiting for signature...';
        case 'authenticate':
          return mode === 'login' ? 'Logging in...' : 'Registering...';
        default:
          return setRoleLoading ? 'Setting Role...' : 'Processing...';
      }
    }
    
    if (!isConnected) {
      return 'Connect Wallet';
    }
    
    return mode === 'login' ? 'Login' : 'Register';
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-[var(--background)]">
        <div className="w-full max-w-md space-y-8 text-center bg-[var(--card-bg)] p-8 rounded-lg border border-[var(--card-border)]">
          <div className="text-[var(--success)] text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-heading">
            {mode === 'login' ? 'Login' : 'Registration'} Successful!
          </h2>
          <p className="text-[var(--text-secondary)]">
            {mode === 'login' 
              ? 'Your wallet has been authenticated successfully.'
              : 'Your wallet has been registered successfully.'
            }
            {roles && roles.length === 1 && (
              <span className="block mt-2">
                Your role has been automatically set.
              </span>
            )}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-[var(--button-primary)] text-[var(--button-primary-text)] py-2 px-4 rounded-md hover:bg-[var(--button-primary-hover)] transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-[var(--background)]">
      <div className="w-full max-w-md space-y-8 bg-[var(--card-bg)] p-8 rounded-lg border border-[var(--card-border)]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--text-primary)] font-heading">
            {mode === 'login' ? 'Login' : 'Register'} with Wallet
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)] font-body">
            {mode === 'login' 
              ? 'Connect your wallet to sign in to your account'
              : 'Connect your wallet to create a new account'
            }
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Progress Indicator */}
          {isConnected && (
            <div className="bg-[var(--info)] bg-opacity-10 p-4 rounded-lg border border-[var(--info)] border-opacity-20">
              <div className="text-[var(--info)] font-medium mb-2">Current Step:</div>
              <div className="text-[var(--text-secondary)] text-sm">{getStepDescription()}</div>
              {setRoleLoading && (
                <div className="mt-2 text-[var(--info)] text-sm">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[var(--info)] mr-2"></div>
                    Setting your role automatically...
                  </div>
                </div>
              )}
              {roles && roles.length > 0 && !setRoleLoading && (
                <div className="mt-2 text-[var(--success)] text-sm">
                  ✓ Found {roles.length} role{roles.length > 1 ? 's' : ''} available
                  {roles.length === 1 && (
                    <span className="ml-1">(will be set automatically)</span>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Referral Code Input - Only show for login mode */}
          {mode === 'login' && (
            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Referral Code
              </label>
              <input
                id="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code"
                className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--input-focus)] focus:border-[var(--input-focus)] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Default: DEMO123 (required for login)
              </p>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading || setRoleLoading}
              className="group relative flex w-full justify-center rounded-md bg-[var(--button-primary)] px-3 py-2 text-sm font-semibold text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--button-primary)] disabled:bg-[var(--text-muted)] disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--button-primary-text)] mr-2"></div>
                  {getButtonText()}
                </div>
              ) : (
                getButtonText()
              )}
            </button>
          </div>
          
          {/* Error Messages */}
          {walletError && (
            <div className="text-[var(--error)] text-center text-sm bg-[var(--error)] bg-opacity-10 p-3 rounded-md border border-[var(--error)] border-opacity-20">
              <div className="font-medium">Wallet Error:</div>
              {walletError}
            </div>
          )}
          {generalError && (
            <div className="text-[var(--error)] text-center text-sm bg-[var(--error)] bg-opacity-10 p-3 rounded-md border border-[var(--error)] border-opacity-20">
              <div className="font-medium">General Error:</div>
              {generalError}
            </div>
          )}
          {error && (
            <div className="text-[var(--error)] text-center text-sm bg-[var(--error)] bg-opacity-10 p-3 rounded-md border border-[var(--error)] border-opacity-20">
              <div className="font-medium">Error:</div>
              {error}
            </div>
          )}
          
          {/* Connection Status */}
          {isConnected && address && (
            <div className="text-center text-sm text-[var(--text-secondary)] bg-[var(--secondary)] p-3 rounded-md border border-[var(--border-light)]">
              <div className="font-medium text-[var(--text-primary)]">Wallet Connected</div>
              <div className="font-mono text-xs mt-1 text-[var(--text-secondary)]">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
              {/* Reset button for testing */}
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 text-xs text-[var(--error)] hover:text-[var(--error)] underline"
              >
                Reset for Testing
              </button>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-[var(--primary)] hover:text-[var(--primary-dark)] text-sm transition-colors duration-200"
            >
              {mode === 'login' 
                ? "Don't have an account? Register here"
                : "Already have an account? Login here"
              }
            </button>
          </div>
        </form>
      </div>
      
      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)} 
      />
    </div>
  );
};

export default Auth;
