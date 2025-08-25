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

  // Debug logging
  useEffect(() => {
    console.log('🔍 RoleSelectionModal - Available roles:', roles);
    console.log('🔍 RoleSelectionModal - Selected role ID:', selectedRoleId);
  }, [roles, selectedRoleId]);

  // Handle successful role selection
  useEffect(() => {
    if (isSuccess) {
      // Close modal and redirect to dashboard
      onClose();
      router.push('/demo');
    }
  }, [isSuccess, onClose, router]);

  const handleRoleSelect = async () => {
    if (!selectedRoleId || !token) {
      console.error('Missing roleId or token for role selection');
      return;
    }

    try {
      console.log('🔄 Setting role:', selectedRoleId);
      await setRole(token, selectedRoleId);
      console.log('✅ Role set successfully');
    } catch (error) {
      console.error('❌ Failed to set role:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select Your Role
          </h2>
          <p className="text-gray-600">
            Choose the role you want to use for this session
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {roles.map((role) => (
            <label
              key={role.roleId}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRoleId === role.roleId
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
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
                <div className="font-medium text-gray-900 capitalize">
                  {role.slug.replace(/_/g, ' ')}
                </div>
                <div className="text-sm text-gray-500">
                  Role ID: {role.roleId}
                </div>
              </div>
              {selectedRoleId === role.roleId && (
                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </label>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800 text-sm">
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
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRoleId || isLoading}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
