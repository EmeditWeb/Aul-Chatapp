import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
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
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingUser) {
        throw new Error("Username already taken. Please choose another.");
      }

      // 1. Upload Profile Pic
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);

      // 2. Create User in ChatEngine
      const chatEngineUser = {
        username: username,
        secret: currentUser.id,
        email: currentUser.email,
        first_name: username,
        custom_json: { photoURL: publicUrl }
      };

      const privateKey = process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY;

      if (!privateKey) {
          throw new Error("Missing REACT_APP_CHAT_ENGINE_PRIVATE_KEY");
      }

      await axios.post(
        'https://api.chatengine.io/users/',
        chatEngineUser,
        { headers: { 'Private-Key': privateKey } }
      );

      // 3. Create User Document in Supabase
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: currentUser.id,
            username: username,
            email: currentUser.email,
            photo_url: publicUrl,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) throw insertError;

      // 4. Save to LocalStorage
      localStorage.setItem('username', username);
      localStorage.setItem('password', currentUser.id);

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
