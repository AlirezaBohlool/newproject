'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSetRole } from '@/hooks/set-role';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const { roles, token } = useSelector((state: RootState) => state.auth);
  const { setRole, isLoading, error, isSuccess } = useSetRole();
  const router = useRouter();

  // Auto-select first role if only one is available
  useEffect(() => {
    if (roles.length === 1 && !selectedRoleId) {
      setSelectedRoleId(roles[0].roleId);
    }
  }, [roles, selectedRoleId]);

  // Handle successful role selection
  useEffect(() => {
    if (isSuccess) {
      // Close modal and redirect to dashboard
      onClose();
      router.push('/dashboard');
    }
  }, [isSuccess, onClose, router]);

  const handleRoleSelect = async () => {
    if (!selectedRoleId || !token) {
      console.error('Missing roleId or token for role selection');
      return;
    }

    try {
      await setRole(token, selectedRoleId);
    } catch (error) {
      console.error('❌ Failed to set role:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] rounded-lg p-6 w-full max-w-md mx-4 border border-[var(--card-border)]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 font-heading">
            Select Your Role
          </h2>
          <p className="text-[var(--text-secondary)] font-body">
            Choose the role you want to use for this session
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {roles.map((role) => (
            <label
              key={role.roleId}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRoleId === role.roleId
                  ? 'border-[var(--primary)] bg-[var(--primary)] bg-opacity-10'
                  : 'border-[var(--border-light)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:bg-opacity-5'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={role.roleId}
                checked={selectedRoleId === role.roleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="font-medium text-[var(--text-primary)] capitalize">
                  {role.slug.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Role ID: {role.roleId}
                </div>
              </div>
              {selectedRoleId === role.roleId && (
                <div className="w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[var(--button-primary-text)] rounded-full"></div>
                </div>
              )}
            </label>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[var(--error)] bg-opacity-10 border border-[var(--error)] border-opacity-20 rounded-lg">
            <div className="text-[var(--error)] text-sm">
              {typeof error.message === 'string' 
                ? error.message 
                : Array.isArray(error.message)
                ? error.message[0]?.msg || 'An error occurred'
                : error.message?.msg || 'An error occurred'
              }
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-[var(--text-primary)] bg-[var(--button-secondary)] rounded-lg hover:bg-[var(--button-secondary-hover)] disabled:opacity-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRoleId || isLoading}
            className="flex-1 px-4 py-2 bg-[var(--button-primary)] text-[var(--button-primary-text)] rounded-lg hover:bg-[var(--button-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--button-primary-text)] mr-2"></div>
                Setting Role...
              </div>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
