import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatEngine } from 'react-chat-engine';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import ChatFeed from './component/ChatFeed';
import LoginForm from './component/LoginForm';
import Onboarding from './component/Onboarding';
import PrivateRoute from './component/PrivateRoute';
import ThemeToggle from './component/ThemeToggle';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { supabase } from './supabaseClient';

import './App.css';

const renderChatFeed = (chatAppProps) => <ChatFeed {...chatAppProps} />;

const ChatScreen = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [secret, setSecret] = useState(localStorage.getItem('password'));
  const projectID = process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID;

  useEffect(() => {
    const fetchUser = async () => {
      // If we have credentials in state and they match current user, we are good.
      if (username && secret === currentUser?.id) {
        setLoading(false);
        return;
      }

      if (!currentUser) {
          // Should be handled by PrivateRoute, but just in case
          setLoading(false);
          return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('username, email, photo_url')
          .eq('id', currentUser.id)
          .single();

        if (error || !data) {
          // User not found in DB -> Onboarding
          navigate('/onboarding');
        } else {
          // User found -> Sync with ChatEngine
          const chatEngineUser = {
            username: data.username,
            secret: currentUser.id,
            email: data.email,
            first_name: data.username,
            custom_json: { photoURL: data.photo_url }
          };

          try {
            await axios.put(
              'https://api.chatengine.io/users/',
              chatEngineUser,
              { headers: { 'Private-Key': process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY } }
            );

            // Only update local state if sync succeeds
            localStorage.setItem('username', data.username);
            localStorage.setItem('password', currentUser.id);
            setUsername(data.username);
            setSecret(currentUser.id);
          } catch (e) {
            console.error("Failed to sync user with ChatEngine:", e);
            setError("Failed to sync user with Chat Engine. Please try reloading.");
          }
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Error fetching user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser, navigate, username, secret]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Loading Chat Credentials...</div>;
  if (error) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>{error} <br/> <button onClick={() => window.location.reload()}>Retry</button></div>;

  // If still no username/secret after loading, it means fetch failed or redirected.
  if (!username || !secret) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Redirecting...</div>;

  return (
    <ChatEngine
      height="100vh"
      projectID={projectID}
      userName={username}
      userSecret={secret}
      renderChatFeed={renderChatFeed}
    />
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="app-container">
            <ThemeToggle />
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/onboarding"
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                     <ChatScreen />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
