import { useState } from 'react';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem('username', userData.username);
        localStorage.setItem('password', user.uid);

        // Navigate to home
        navigate('/');
      } else {
        // New user -> Onboarding
        navigate('/onboarding');
      }

    } catch (err) {
      console.error(err);
      setError('Failed to sign in. ' + err.message);
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">Chat Application</h1>
        <div align="center">
          <button
            onClick={() => handleSocialLogin(new GoogleAuthProvider())}
            className="button"
            style={{ marginBottom: '10px', backgroundColor: '#db4437', display: 'block', width: '100%' }}
          >
            <GoogleOutlined style={{ marginRight: '8px' }} /> Sign in with Google
          </button>
          <button
            onClick={() => handleSocialLogin(new GithubAuthProvider())}
            className="button"
            style={{ backgroundColor: '#333', display: 'block', width: '100%' }}
          >
            <GithubOutlined style={{ marginRight: '8px' }} /> Sign in with GitHub
          </button>
        </div>
        <center><h3 className="error">{error}</h3></center>
      </div>
    </div>
  );
};

export default LoginForm;
