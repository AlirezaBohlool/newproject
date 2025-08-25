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

  // Debug logging for roles
  useEffect(() => {
    console.log('🔍 Auth Component - Available roles:', roles);
    console.log('🔍 Auth Component - Token available:', !!token);
  }, [roles, token]);
  
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
      console.log('🎉 Authentication successful, response:', response);
      
      // Extract roles from the response token immediately
      let responseRoles: any[] = [];
      try {
        if (response.result && response.result.token) {
          const decoded = jwtDecode<DecodedToken>(response.result.token);
          responseRoles = decoded.roles || [];
          console.log('🔍 Roles from response token:', responseRoles);
        }
      } catch (error) {
        console.error('❌ Failed to decode token from response:', error);
      }
      
      // Check if user has roles to select from
      if (responseRoles && responseRoles.length > 0) {
        console.log('✅ Found roles, checking count:', responseRoles.length);
        if (responseRoles.length === 1) {
          // Auto-set role if user has only one role
          console.log('🔄 Auto-setting single role:', responseRoles[0].roleId);
          handleAutoSetRole(responseRoles[0].roleId, response.result.token);
        } else {
          // Show modal if user has multiple roles
          console.log('📋 Showing role selection modal for multiple roles');
          setShowRoleModal(true);
        }
      } else {
        console.log('⚠️ No roles found, proceeding without role selection');
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
      console.log('⚠️ Request already in progress, ignoring submission');
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
      console.log('🔄 Auto-setting role:', roleId);
      await setRole(authToken, roleId);
      console.log('✅ Role auto-set successfully');
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
    console.log('🔄 Reset completed - ready for new test');
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
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Login' : 'Registration'} Successful!
          </h2>
          <p className="text-gray-600">
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
            onClick={() => router.push('/demo')}
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
              {setRoleLoading && (
                <div className="mt-2 text-blue-600 text-sm">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                    Setting your role automatically...
                  </div>
                </div>
              )}
              {roles && roles.length > 0 && !setRoleLoading && (
                <div className="mt-2 text-green-600 text-sm">
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
                Default: DEMO123 (required for login)
              </p>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading || setRoleLoading}
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
              {/* Reset button for testing */}
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
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
      
      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={showRoleModal} 
        onClose={() => setShowRoleModal(false)} 
      />
    </div>
  );
};

export default Auth;
