import { useState, useEffect } from 'react';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setError('Failed to sign in. ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">Chat Application</h1>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => handleLogin('google')}
            className="button"
            disabled={loading}
            style={{ marginBottom: '10px', backgroundColor: '#db4437', display: 'block', width: '100%' }}
          >
            <GoogleOutlined style={{ marginRight: '8px' }} /> Sign in with Google
          </button>
          <button
            onClick={() => handleLogin('github')}
            className="button"
            disabled={loading}
            style={{ backgroundColor: '#333', display: 'block', width: '100%' }}
          >
            <GithubOutlined style={{ marginRight: '8px' }} /> Sign in with GitHub
          </button>
        </div>
        <div style={{ textAlign: 'center' }}><h3 className="error">{error}</h3></div>
      </div>
    </div>
  );
};

export default LoginForm;
