import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding = () => {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !file) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 0. Check for username uniqueness
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Username already taken. Please choose another.");
      }

      // 1. Upload Profile Pic
      const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Create User in ChatEngine
      // Assuming we have the Private Key in env
      const chatEngineUser = {
        username: username,
        secret: currentUser.uid, // Using UID as secret
        email: currentUser.email,
        first_name: currentUser.displayName ? currentUser.displayName.split(' ')[0] : username,
        last_name: currentUser.displayName ? currentUser.displayName.split(' ')[1] || '' : '',
        custom_json: { photoURL: downloadURL } // Store extra info if needed
      };

      const privateKey = process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY;

      if (!privateKey) {
        // Fallback or warning if private key is missing - for now assuming user provides it.
        // If no private key, we might try to just authenticate if the user exists, but this is "Onboarding"
        // creating a NEW user.
        console.warn("ChatEngine Private Key is missing. User creation on ChatEngine might fail.");
      }

      // Only attempt to create if we have the key, otherwise we might be in a dev env without it?
      // Or we can try to proceed assuming the user might already be created manually?
      // Strict requirement: Create user via API.

      if (privateKey) {
         await axios.post(
          'https://api.chatengine.io/users/',
          chatEngineUser,
          { headers: { 'Private-Key': privateKey } }
        );
      } else {
        throw new Error("Missing REACT_APP_CHAT_ENGINE_PRIVATE_KEY in environment variables.");
      }

      // 3. Create User Document in Firestore
      await setDoc(doc(db, "users", currentUser.uid), {
        username: username,
        email: currentUser.email,
        photoURL: downloadURL,
        uid: currentUser.uid,
        createdAt: new Date()
      });

      // 4. Save to LocalStorage (as App.js uses it)
      localStorage.setItem('username', username);
      localStorage.setItem('password', currentUser.uid); // Using UID as secret

      // 5. Redirect
      navigate('/');

    } catch (err) {
      console.error(err);
      setError("Failed to create account. " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">Welcome! Let's get you set up.</h1>
        {error && <h3 className="error">{error}</h3>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="Username"
            required
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="input"
            required
          />
          <div style={{ textAlign: 'center' }}>
            <button type="submit" className="button" disabled={loading}>
              <span>{loading ? 'Setting up...' : 'Start Chatting'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
