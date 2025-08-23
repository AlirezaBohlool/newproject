'use client';
import React, { useState } from 'react';
import { useEnhancedWalletLogin } from '@/wallet/hooks';
import { WalletApiService } from '@/services/wallet-api';
import { 
  createWalletAuthPayload, 
  generateRandomSeed, 
  generateDeviceIdentifier,
  generateRandomHex 
} from '@/utils/wallet-utils';

const DemoPage = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  
  const {
    isLoading,
    walletError,
    isConnected,
    address,
    handleConnectWallet,
    handleWalletLogin,
  } = useEnhancedWalletLogin({
    onLoginSuccess: (response) => {
      addTestResult('✅ Login successful!');
      console.log('Login response:', response);
    },
    onLoginError: (err) => {
      addTestResult(`❌ Login failed: ${err?.message || 'Unknown error'}`);
    },
    onWalletSourceCreated: (response) => {
      addTestResult('✅ Wallet source created successfully!');
      console.log('Wallet source response:', response);
    },
  });

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testUtilityFunctions = () => {
    addTestResult('🧪 Testing utility functions...');
    
    try {
      const deviceId = generateDeviceIdentifier();
      const randomHex = generateRandomHex();
      const randomSeed = generateRandomSeed();
      
      addTestResult(`✅ Device ID: ${deviceId}`);
      addTestResult(`✅ Random Hex: ${randomHex}`);
      addTestResult(`✅ Random Seed: ${randomSeed}`);
      
      // Test wallet auth payload creation
      const testPayload = createWalletAuthPayload(
        '0x1234567890123456789012345678901234567890',
        '0xsignature123',
        'testseed123',
        'testmetadata'
      );
      
      addTestResult(`✅ Auth Payload: ${JSON.stringify(testPayload, null, 2)}`);
      
    } catch (error) {
      addTestResult(`❌ Utility test failed: ${error}`);
    }
  };

  const testApiService = async () => {
    addTestResult('🧪 Testing API service...');
    setIsTesting(true);
    
    try {
      // Test nonce endpoint (this will fail without a real API, but we can test the structure)
      addTestResult('📡 Testing nonce endpoint structure...');
      
      // Test wallet auth payload structure
      const testAuthPayload = createWalletAuthPayload(
        '0x1234567890123456789012345678901234567890',
        '0xsignature123',
        'testseed123',
        'testmetadata'
      );
      
      addTestResult(`✅ Auth payload structure: ${JSON.stringify(testAuthPayload, null, 2)}`);
      
      // Test wallet source payload structure
      const testSourcePayload = {
        wallet: '0x1234567890123456789012345678901234567890'
      };
      
      addTestResult(`✅ Source payload structure: ${JSON.stringify(testSourcePayload, null, 2)}`);
      
    } catch (error) {
      addTestResult(`❌ API service test failed: ${error}`);
    } finally {
      setIsTesting(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Wallet Authentication API Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates the new wallet authentication API implementation using RTK Query and the enhanced wallet authentication hook.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Wallet Connection</h2>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </div>
                {address && (
                  <div className="text-sm text-gray-600">
                    Address: {address}
                  </div>
                )}
                <button
                  onClick={handleConnectWallet}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 disabled:bg-blue-300"
                >
                  {isLoading ? 'Processing...' : isConnected ? 'Reconnect Wallet' : 'Connect Wallet'}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Testing Tools</h2>
              <div className="space-y-2">
                <button
                  onClick={testUtilityFunctions}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500"
                >
                  Test Utility Functions
                </button>
                <button
                  onClick={testApiService}
                  disabled={isTesting}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-500 disabled:bg-purple-300"
                >
                  {isTesting ? 'Testing...' : 'Test API Service'}
                </button>
                <button
                  onClick={clearResults}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results</h2>
          <div className="bg-gray-100 rounded-md p-4 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center">No test results yet. Run some tests to see results here.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono bg-white p-2 rounded border">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {walletError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-6">
            <h3 className="text-red-800 font-medium">Wallet Error</h3>
            <p className="text-red-600 text-sm">{walletError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;
