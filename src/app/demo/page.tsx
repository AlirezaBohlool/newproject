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
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-lg shadow-lg p-8 border border-[var(--card-border)]">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center font-heading">
            Your Wallet Dashboard
          </h1>
          
          {/* Authentication Status */}
          <div className="mb-6 p-4 rounded-lg border border-[var(--border-light)] bg-[var(--secondary)]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] font-heading">Authentication Status</h3>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[var(--error)] text-white rounded-lg hover:bg-[var(--error)] hover:opacity-80 text-sm transition-colors duration-200"
              >
                Logout
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${isAuthenticated ? 'bg-[var(--success)] bg-opacity-10 text-[var(--success)] border border-[var(--success)] border-opacity-20' : 'bg-[var(--error)] bg-opacity-10 text-[var(--error)] border border-[var(--error)] border-opacity-20'}`}>
                <div className="font-medium">Authentication</div>
                <div>{isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
              </div>
              <div className={`p-3 rounded-lg ${hasRoleSelected ? 'bg-[var(--success)] bg-opacity-10 text-[var(--success)] border border-[var(--success)] border-opacity-20' : 'bg-[var(--warning)] bg-opacity-10 text-[var(--warning)] border border-[var(--warning)] border-opacity-20'}`}>
                <div className="font-medium">Role Selection</div>
                <div>{hasRoleSelected ? '✅ Role Selected' : '⚠️ Role Not Selected'}</div>
              </div>
              <div className={`p-3 rounded-lg ${isFullyAuthenticated ? 'bg-[var(--success)] bg-opacity-10 text-[var(--success)] border border-[var(--success)] border-opacity-20' : 'bg-[var(--error)] bg-opacity-10 text-[var(--error)] border border-[var(--error)] border-opacity-20'}`}>
                <div className="font-medium">Full Access</div>
                <div>{isFullyAuthenticated ? '✅ Full Access' : '❌ Limited Access'}</div>
              </div>
            </div>
            
            {/* Role Selection Reminder */}
            {isAuthenticated && !hasRoleSelected && (
              <div className="mt-4 p-3 bg-[var(--warning)] bg-opacity-10 border border-[var(--warning)] border-opacity-20 rounded-lg">
                <div className="text-[var(--warning)] text-sm">
                  <strong>⚠️ Action Required:</strong> You need to select a role to access all features. 
                  <button
                    onClick={() => router.push('/auth')}
                    className="ml-2 text-[var(--warning)] hover:opacity-80 underline"
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
              <div className="bg-[var(--info)] bg-opacity-10 p-4 rounded-lg border border-[var(--info)] border-opacity-20">
                <h3 className="text-lg font-semibold text-[var(--info)] mb-2 font-heading">
                  Your Wallet Information
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Here's your wallet authentication details and current session information.
                </p>
              </div>
              
              <div className="space-y-4">
                {/* Wallet Address */}
                <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                  <h4 className="text-[var(--text-primary)] font-medium mb-2">Wallet Address</h4>
                  <div className="text-[var(--text-secondary)] text-sm font-mono bg-[var(--input-bg)] p-2 rounded border border-[var(--input-border)]">
                    {authId || 'Not available'}
                  </div>
                </div>

                {/* User ID */}
                <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                  <h4 className="text-[var(--text-primary)] font-medium mb-2">User ID</h4>
                  <div className="text-[var(--text-secondary)] text-sm font-mono bg-[var(--input-bg)] p-2 rounded border border-[var(--input-border)]">
                    {userId || 'Not available'}
                  </div>
                </div>

                {/* Current Role */}
                <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                  <h4 className="text-[var(--text-primary)] font-medium mb-2">Current Role</h4>
                  <div className="text-[var(--text-secondary)] text-sm bg-[var(--input-bg)] p-2 rounded border border-[var(--input-border)]">
                    {currentRole ? (
                      <div>
                        <div className="font-medium capitalize text-[var(--text-primary)]">{currentRole.slug.replace(/_/g, ' ')}</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">ID: {currentRole.roleId}</div>
                      </div>
                    ) : (
                      'No role selected'
                    )}
                  </div>
                </div>

                {/* Available Roles */}
                <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                  <h4 className="text-[var(--text-primary)] font-medium mb-2">Available Roles</h4>
                  <div className="space-y-2">
                    {roles && roles.length > 0 ? (
                      roles.map((role) => (
                        <div 
                          key={role.roleId}
                          className={`text-sm p-2 rounded border ${
                            currentRoleId === role.roleId 
                              ? 'bg-[var(--success)] bg-opacity-10 border-[var(--success)] border-opacity-20 text-[var(--success)]' 
                              : 'bg-[var(--input-bg)] border-[var(--input-border)] text-[var(--text-secondary)]'
                          }`}
                        >
                          <div className="font-medium capitalize text-[var(--text-primary)]">{role.slug.replace(/_/g, ' ')}</div>
                          <div className="text-xs text-[var(--text-muted)] mt-1">ID: {role.roleId}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-[var(--text-muted)] text-sm">No roles available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Session Details */}
            <div className="space-y-6">
              <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 font-heading">
                  Session Details
                </h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Your current session information and token details.
                </p>
              </div>
              
              {/* Token Information */}
              <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                <h4 className="text-[var(--text-primary)] font-medium mb-2">Authentication Token</h4>
                <div className="text-[var(--text-secondary)] text-sm bg-[var(--input-bg)] p-2 rounded border border-[var(--input-border)]">
                  <div className="font-mono text-xs break-all">
                    {token ? `${token.substring(0, 50)}...` : 'No token available'}
                  </div>
                </div>
              </div>

              {/* Access Token */}
              <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                <h4 className="text-[var(--text-primary)] font-medium mb-2">Access Token</h4>
                <div className="text-[var(--text-secondary)] text-sm bg-[var(--input-bg)] p-2 rounded border border-[var(--input-border)]">
                  <div className="font-mono text-xs break-all">
                    {accessToken ? `${accessToken.substring(0, 50)}...` : 'No access token available'}
                  </div>
                </div>
              </div>

              {/* Session Status */}
              <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                <h4 className="text-[var(--text-primary)] font-medium mb-2">Session Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Authentication:</span>
                    <span className={isAuthenticated ? 'text-[var(--success)]' : 'text-[var(--error)]'}>
                      {isAuthenticated ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Role Selection:</span>
                    <span className={hasRoleSelected ? 'text-[var(--success)]' : 'text-[var(--warning)]'}>
                      {hasRoleSelected ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Full Access:</span>
                    <span className={isFullyAuthenticated ? 'text-[var(--success)]' : 'text-[var(--error)]'}>
                      {isFullyAuthenticated ? 'Granted' : 'Limited'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[var(--secondary)] p-4 rounded-lg border border-[var(--border-light)]">
                <h4 className="text-[var(--text-primary)] font-medium mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/auth')}
                    className="w-full text-left p-2 text-sm text-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-10 rounded transition-colors duration-200"
                  >
                    🔄 Change Role
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 text-sm text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 rounded transition-colors duration-200"
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
