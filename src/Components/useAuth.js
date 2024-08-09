import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  const isAuthenticated = !!userId;

  const requireAuth = (redirectPath = '/') => {
    if (!isAuthenticated) {
      navigate(redirectPath);
    }
  };

  return { isAuthenticated, requireAuth };
};
