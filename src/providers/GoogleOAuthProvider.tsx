import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "1056553965666-aqrm670clv644e46rekuikdoq58osoud.apps.googleusercontent.com"; 

export const GoogleAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};