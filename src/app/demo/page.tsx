'use client';
import React, { useState } from 'react';
import { useAuthWallet } from '@/wallet/hooks/auth-wallet';

const DemoPage = () => {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
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
    metaData: "123", // Using "123" as specified
    iso3: "USA", // Default country code
    referralCode, // Use the state value
    mode: 'login',
    onSuccess: (response) => {
      console.log('✅ Login successful:', response);
      setResult(response);
      setError('');
    },
    onError: (err) => {
      console.error('❌ Login failed:', err);
      setError(err?.message || 'Login failed');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Wallet Authentication Demo
          </h1>
          
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
              </div>
              
              <div className="space-y-4">
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
                    Default: DEMO123 (required by backend)
                  </p>
                </div>
                
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
                    'Test Authentication'
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
                  <div><strong>Required Fields:</strong></div>
                  <div className="ml-2">• <code>iso3</code>: Country code (e.g., "USA")</div>
                  <div className="ml-2">• <code>referralCode</code>: Referral code (required, default: "DEMO123")</div>
                  <div className="ml-2">• <code>signature</code>: Wallet signature</div>
                  <div className="ml-2">• <code>walletAddress</code>: Wallet address</div>
                  <div className="ml-2">• <code>content.nonce</code>: Nonce from server</div>
                  <div className="ml-2">• <code>content.metaData</code>: "123"</div>
                  <div><strong>Method:</strong> POST</div>
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
