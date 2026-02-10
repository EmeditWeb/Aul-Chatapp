import { useState } from 'react';
import axios from 'axios';

const projectID="c3e79e01-d8f0-4735-a0e7-aa97f88c8b26";

const Modal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authObject = { 'Project-ID': projectID, 'User-Name': username, 'User-Secret': password };

    try {
      await axios.get('https://api.chatengine.io/chats', { headers: authObject });

      localStorage.setItem('username', username);
      localStorage.setItem('password', password);

      window.location.reload();
      setError('');
    } catch (err) {
      setError('Oops, incorrect credentials.🙄');
    }
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">AUL ChatApp</h1>
        <h3 className="error" style={{ textAlign: 'center' }}>{error}</h3><br/>
        <form onSubmit={handleSubmit}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Password" required />
          <div style={{ textAlign: 'center' }}>
            <button type="submit" className="button">
              <span>Enter ChatRoom</span>
            </button>
          </div>
        </form><br/>
        <h5 style={{ textAlign: 'center' }}>Meet the <a href="https://github.com/EmeditWeb" target='_blank' rel="noreferrer">Developer</a></h5>
        
        </div>
        
    </div>
    
  );
};

export default Modal;