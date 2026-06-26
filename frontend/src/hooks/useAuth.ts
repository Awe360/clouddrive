import { useState, useEffect } from 'react';
import client from '../api/client';
import type { AuthResponse, User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if token exists and verify user session on mount
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await client.get<{ user: User }>('/auth/me');
        setUser(response.data.user);
      } catch (err: any) {
        console.error('Failed to verify token on mount:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.post<AuthResponse>('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to login. Please check details.';
      setError(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   */
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.post<AuthResponse>('/auth/register', { name, email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Registration failed. Try again.';
      setError(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear local storage
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    setError
  };
}
export type AuthHook = ReturnType<typeof useAuth>;
