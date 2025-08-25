import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useAuthStatus = () => {
  const { token, accessToken, currentRoleId } = useSelector((state: RootState) => state.auth);
  
  const isAuthenticated = !!token;
  const hasRoleSelected = !!accessToken && !!currentRoleId;
  const isFullyAuthenticated = isAuthenticated && hasRoleSelected;
  
  // Check localStorage for role selection flag
  const roleSelectedInStorage = typeof window !== 'undefined' 
    ? localStorage.getItem('role_selected') === 'true'
    : false;
  
  return {
    isAuthenticated,
    hasRoleSelected: hasRoleSelected || roleSelectedInStorage,
    isFullyAuthenticated: isFullyAuthenticated || (isAuthenticated && roleSelectedInStorage),
    token,
    accessToken,
    currentRoleId,
  };
};
