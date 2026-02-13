import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setCredentials,
  clearCredentials,
  setLoading,
  selectIsAuthenticated,
  selectCurrentUser,
  selectUserProfile,
  selectUserRole,
} from '../store/slices/authSlice';
import { authService } from '../services';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const profile = useSelector(selectUserProfile);
  const role = useSelector(selectUserRole);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && !isAuthenticated) {
        try {
          dispatch(setLoading(true));
          const response = await authService.getCurrentUser();
          if (response.success) {
            dispatch(setCredentials(response.data));
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('accessToken');
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    initAuth();
  }, [dispatch, isAuthenticated]);

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Use the user data from login response
        const userData = { user: response.data.user, profile: null };
        
        // Try to get profile, but don't fail login if it fails
        try {
          const userResponse = await authService.getCurrentUser();
          if (userResponse.success) {
            userData.profile = userResponse.data.profile;
          }
        } catch (profileError) {
          console.warn('Could not fetch profile:', profileError);
        }
        
        dispatch(setCredentials(userData));
        toast.success('Login successful!');
        return userData;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const sendOtp = async (email) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.sendOtp(email);
      if (response.success) {
        toast.success(response.message);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loginWithOtp = async (email, otp) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.loginWithOtp(email, otp);
      
      if (response.success) {
        // Get user profile
        const userResponse = await authService.getCurrentUser();
        dispatch(setCredentials(userResponse.data));
        toast.success('Login successful!');
        return userResponse.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (data) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.register(data);
      
      if (response.success) {
        toast.success('Registration successful! Please verify your email.');
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch(clearCredentials());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear credentials anyway
      dispatch(clearCredentials());
      navigate('/login');
    }
  };

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    return Array.isArray(allowedRoles) 
      ? allowedRoles.includes(role) 
      : role === allowedRoles;
  };

  return {
    isAuthenticated,
    user,
    profile,
    role,
    login,
    sendOtp,
    loginWithOtp,
    register,
    logout,
    hasRole,
  };
};

export default useAuth;
