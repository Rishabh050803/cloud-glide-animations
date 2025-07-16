// Remove the hook import
// import { useAuth } from '@/contexts/AuthContext';

export const createApiClient = () => {
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    // Need to handle FormData separately for file uploads
    const isFormData = options.body instanceof FormData;
    
    // Add auth header if token exists
    const token = localStorage.getItem('access_token');
    const headers = {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    
    try {
      const response = await fetch(url, { ...options, headers });
      
      // If response is OK, return it directly
      if (response.ok) {
        return response;
      }
      
      // Handle 401 errors specifically
      if (response.status === 401) {
        try {
          // Try to parse error response to check the error code
          const errorData = await response.json();
          
          // Check if token is expired
          if (errorData?.detail?.code === 'token_expired') {
            console.log("Token expired, attempting refresh...");
            
            // Try to refresh token
            const newToken = await refreshToken();
            
            if (newToken) {
              console.log("Token refreshed successfully, retrying request");
              
              // Retry the original request with new token
              const newHeaders = {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              };
              
              return fetch(url, { ...options, headers: newHeaders });
            }
          }
          
          // If token refresh failed or token was invalid, redirect to login
          console.log("Authentication failed, redirecting to login");
          window.location.href = '/login';
          return response; // Return the original response
        } catch (parseError) {
          // If we can't parse the response, just redirect to login
          console.error("Error parsing authentication response", parseError);
          window.location.href = '/login';
          return response;
        }
      }
      
      // For other errors, just return the response
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };
  
  return { fetchWithAuth };
};

// Separate function to refresh token
async function refreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    return null;
  }
  
  try {
    console.log("Attempting to refresh token");
    const response = await fetch('http://127.0.0.1:8000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });
    
    if (!response.ok) {
      console.error("Token refresh failed with status:", response.status);
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    console.log("Token refresh successful");
    
    localStorage.setItem('access_token', data.access_token);
    
    // If the backend also returns a new refresh token, update it
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // Clear tokens on refresh failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
}