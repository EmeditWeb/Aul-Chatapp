import { ChatEngine } from 'react-chat-engine';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ChatFeed from './component/ChatFeed';
import LoginForm from './component/LoginForm';
import Onboarding from './component/Onboarding';
import PrivateRoute from './component/PrivateRoute';
import ThemeToggle from './component/ThemeToggle';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import './App.css';

const renderChatFeed = (chatAppProps) => <ChatFeed {...chatAppProps} />;

const ChatScreen = () => {
  const projectID = process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID;
  const username = localStorage.getItem('username');
  const secret = localStorage.getItem('password');

  if (!username || !secret) return <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Loading Chat Credentials...</div>;

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
