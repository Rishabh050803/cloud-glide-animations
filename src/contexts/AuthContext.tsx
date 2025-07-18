import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ENDPOINTS } from '@/config/api';

interface User {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Single useEffect to handle session restoration
  useEffect(() => {
    const restoreUserSession = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
          setLoading(false);
          return;
        }

        // Use the new /auth/me endpoint to validate token and get user data
        const response = await fetch(ENDPOINTS.AUTH.ME, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          // Token is valid, set user data
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          // Token is invalid or expired, try to refresh
          const refreshResponse = await fetch(ENDPOINTS.AUTH.REFRESH, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            // Successfully refreshed token
            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access_token);
            if (data.refresh_token) {
              localStorage.setItem('refresh_token', data.refresh_token);
            }

            // Now try to get user data with new token
            const userResponse = await fetch(ENDPOINTS.AUTH.ME, {
              headers: {
                Authorization: `Bearer ${data.access_token}`
              }
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
            } else {
              // Still failed, clear tokens
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            }
          } else {
            // Refresh failed, clear tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setLoading(false);
      }
    };

    restoreUserSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await fetch(ENDPOINTS.AUTH.GOOGLE_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });

      if (!response.ok) {
        throw new Error('Google login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      
      toast({
        title: "Login successful",
        description: "Welcome to Cloud Glide!",
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google login failed",
        description: "There was an error logging in with Google. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('User with this email already exists');
        }
        throw new Error('Registration failed');
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Please try again with different credentials.';
      toast({
        title: "Registration failed",
        description: errorMsg,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // Add a logout endpoint to your api.ts file if it doesn't exist
        await fetch(`${ENDPOINTS.AUTH.BASE}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};