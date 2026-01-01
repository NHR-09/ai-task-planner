import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => setUser(auth.currentUser)} />;
  }

  return (
    <>
      {!showApp ? (
        <LandingPage onGetStarted={() => setShowApp(true)} />
      ) : (
        <Dashboard user={user} onLogout={() => setUser(null)} />
      )}
    </>
  );
};

export default App;
