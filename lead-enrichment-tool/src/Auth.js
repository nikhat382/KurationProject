// src/Auth.js
import React, { useEffect } from 'react';
import { auth, googleProvider, signInWithPopup } from './firebaseConfig';

function Auth({ onUserChange }) {
  const handleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        onUserChange(result.user);
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  const handleLogout = () => {
    auth.signOut().then(() => onUserChange(null));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      onUserChange(user);
    });
    return () => unsubscribe();
  }, [onUserChange]);

  return (
    <div>
      <button onClick={auth.currentUser ? handleLogout : handleLogin}>
        {auth.currentUser ? 'Logout' : 'Login with Google'}
      </button>
    </div>
  );
}

export default Auth;
