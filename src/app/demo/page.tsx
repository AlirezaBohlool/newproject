'use client';
import React, { useState, useEffect } from 'react';
import { useAuthWallet } from '@/wallet/hooks/auth-wallet';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/auth';

const DemoPage = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [referralCode, setReferralCode] = useState('DEMO123'); // Default referral code
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const { isAuthenticated, hasRoleSelected, isFullyAuthenticated } = useAuthStatus();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const {
    isLoading,
    walletError,
    generalError,
    isConnected,
    address,
    handleConnectWallet,
    handleAuth,
  } = useAuthWallet({
    metaData: "123", // Using "123" as specified
    iso3: "USA", // Default country code
    referralCode, // Use the state value
    mode,
    onSuccess: (response) => {
      console.log(`✅ ${mode} successful:`, response);
      setResult(response);
      setError('');
    },
    onError: (err) => {
      console.error(`❌ ${mode} failed:`, err);
      setError(err?.message || `${mode} failed`);
      setResult(null);
    },
  });

  const handleTestLogin = async () => {
    if (!isConnected) {
      handleConnectWallet();
      return;
    }
    
    try {
      await handleAuth();
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(err?.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Wallet Authentication Demo
          </h1>
          
          {/* Authentication Status */}
          <div className="mb-6 p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Authentication Status</h3>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">Authentication</div>
                <div>{isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
              </div>
              <div className={`p-3 rounded-lg ${hasRoleSelected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <div className="font-medium">Role Selection</div>
                <div>{hasRoleSelected ? '✅ Role Selected' : '⚠️ Role Not Selected'}</div>
              </div>
              <div className={`p-3 rounded-lg ${isFullyAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">Full Access</div>
                <div>{isFullyAuthenticated ? '✅ Full Access' : '❌ Limited Access'}</div>
              </div>
            </div>
            
            {/* Role Selection Reminder */}
            {isAuthenticated && !hasRoleSelected && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-yellow-800 text-sm">
                  <strong>⚠️ Action Required:</strong> You need to select a role to access all features. 
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="ml-2 text-yellow-600 hover:text-yellow-700 underline"
                  >
                    Go to Role Selection
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Test Wallet Authentication
                </h3>
                <p className="text-blue-700 text-sm">
                  This demo tests the wallet authentication flow using the new unified 
                  <code className="bg-blue-100 px-1 rounded">/api/v1/user/wallet/authenticate</code> endpoint.
                </p>
                <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                  <strong>Testing Tip:</strong> If you get duplicate nonce errors, disconnect and reconnect your wallet between tests.
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      mode === 'login'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Login Mode
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      mode === 'register'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Register Mode
                  </button>
                </div>
                
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
                      Default: DEMO123 (required for login only)
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleTestLogin}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : isConnected ? (
                    `Test ${mode === 'login' ? 'Login' : 'Registration'}`
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
                
                {isConnected && address && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-800 font-medium">Wallet Connected</div>
                    <div className="text-green-700 text-sm font-mono mt-1">
                      {address}
                    </div>
                    <button
                      onClick={() => {
                        // Disconnect wallet for testing
                        window.location.reload();
                      }}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
                    >
                      Reset for Testing
                    </button>
                  </div>
                )}
              </div>
              
              {/* Error Display */}
              {(walletError || generalError || error) && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-red-800 font-medium mb-2">Errors:</h4>
                  {walletError && (
                    <div className="text-red-700 text-sm mb-1">
                      <strong>Wallet Error:</strong> {walletError}
                    </div>
                  )}
                  {generalError && (
                    <div className="text-red-700 text-sm mb-1">
                      <strong>General Error:</strong> {generalError}
                    </div>
                  )}
                  {error && (
                    <div className="text-red-700 text-sm">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Right Column - Results */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Authentication Result
                </h3>
                <p className="text-gray-600 text-sm">
                  The result of the wallet authentication will appear here.
                </p>
              </div>
              
              {result && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-green-800 font-medium mb-2">✅ Success!</h4>
                  <div className="text-green-700 text-sm">
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* API Information */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-yellow-800 font-medium mb-2">API Details</h4>
                <div className="text-yellow-700 text-sm space-y-1">
                  <div><strong>Nonce Endpoint:</strong> <code>https://auth.exmodules.org/api/v1/wallet/nonce</code></div>
                  <div><strong>Auth Endpoint:</strong> <code>https://auth.exmodules.org/api/v1/user/wallet/authenticate</code></div>
                  <div><strong>Current Mode:</strong> <span className="font-bold">{mode === 'login' ? 'Login' : 'Registration'}</span></div>
                  <div><strong>Required Fields:</strong></div>
                  {mode === 'login' ? (
                    <>
                      <div className="ml-2">• <code>iso3</code>: Country code (e.g., "USA")</div>
                      <div className="ml-2">• <code>referralCode</code>: Referral code (required, default: "DEMO123")</div>
                    </>
                  ) : (
                    <div className="ml-2 text-green-700">• <code>iso3</code> and <code>referralCode</code>: Not required for registration</div>
                  )}
                  <div className="ml-2">• <code>signature</code>: Wallet signature</div>
                  <div className="ml-2">• <code>walletAddress</code>: Wallet address</div>
                  <div className="ml-2">• <code>content.nonce</code>: Nonce from server (required for both)</div>
                  <div className="ml-2">• <code>content.metaData</code>: "123"</div>
                  <div><strong>Method:</strong> POST</div>
                  <div className="mt-2 text-xs">
                    <strong>Note:</strong> Both login and register fetch nonce first, then sign and authenticate with different field sets
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
