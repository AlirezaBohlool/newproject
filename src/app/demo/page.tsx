'use client';
import React, { useEffect } from 'react';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/auth';
import { RootState } from '@/store/store';

const DemoPage = () => {
  const { isAuthenticated, hasRoleSelected, isFullyAuthenticated, token, accessToken, currentRoleId } = useAuthStatus();
  const { authId, userId, roles, currentRole } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth');
  };

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Wallet Dashboard
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
                    onClick={() => router.push('/auth')}
                    className="ml-2 text-yellow-600 hover:text-yellow-700 underline"
                  >
                    Go to Role Selection
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Wallet Information */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Your Wallet Information
                </h3>
                <p className="text-blue-700 text-sm">
                  Here's your wallet authentication details and current session information.
                </p>
              </div>
              
              <div className="space-y-4">
                {/* Wallet Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-gray-800 font-medium mb-2">Wallet Address</h4>
                  <div className="text-gray-700 text-sm font-mono bg-white p-2 rounded border">
                    {authId || 'Not available'}
                  </div>
                </div>

                {/* User ID */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-gray-800 font-medium mb-2">User ID</h4>
                  <div className="text-gray-700 text-sm font-mono bg-white p-2 rounded border">
                    {userId || 'Not available'}
                  </div>
                </div>

                {/* Current Role */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-gray-800 font-medium mb-2">Current Role</h4>
                  <div className="text-gray-700 text-sm bg-white p-2 rounded border">
                    {currentRole ? (
                      <div>
                        <div className="font-medium capitalize">{currentRole.slug.replace(/_/g, ' ')}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {currentRole.roleId}</div>
                      </div>
                    ) : (
                      'No role selected'
                    )}
                  </div>
                </div>

                {/* Available Roles */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-gray-800 font-medium mb-2">Available Roles</h4>
                  <div className="space-y-2">
                    {roles && roles.length > 0 ? (
                      roles.map((role) => (
                        <div 
                          key={role.roleId}
                          className={`text-sm p-2 rounded border ${
                            currentRoleId === role.roleId 
                              ? 'bg-green-100 border-green-300 text-green-800' 
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="font-medium capitalize">{role.slug.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-gray-500 mt-1">ID: {role.roleId}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No roles available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Session Details */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Session Details
                </h3>
                <p className="text-gray-600 text-sm">
                  Your current session information and token details.
                </p>
              </div>
              
              {/* Token Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-gray-800 font-medium mb-2">Authentication Token</h4>
                <div className="text-gray-700 text-sm bg-white p-2 rounded border">
                  <div className="font-mono text-xs break-all">
                    {token ? `${token.substring(0, 50)}...` : 'No token available'}
                  </div>
                </div>
              </div>

              {/* Access Token */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-gray-800 font-medium mb-2">Access Token</h4>
                <div className="text-gray-700 text-sm bg-white p-2 rounded border">
                  <div className="font-mono text-xs break-all">
                    {accessToken ? `${accessToken.substring(0, 50)}...` : 'No access token available'}
                  </div>
                </div>
              </div>

              {/* Session Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-gray-800 font-medium mb-2">Session Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Authentication:</span>
                    <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                      {isAuthenticated ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role Selection:</span>
                    <span className={hasRoleSelected ? 'text-green-600' : 'text-yellow-600'}>
                      {hasRoleSelected ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Access:</span>
                    <span className={isFullyAuthenticated ? 'text-green-600' : 'text-red-600'}>
                      {isFullyAuthenticated ? 'Granted' : 'Limited'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-gray-800 font-medium mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/auth')}
                    className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    🔄 Change Role
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    🚪 Logout
                  </button>
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
