import { ChatEngine} from 'react-chat-engine';

import ChatFeed from './component/ChatFeed';
import LoginForm from './component/LoginForm'
import './App.css';

const App = () => {
    if (!localStorage.getItem('username')) return <LoginForm />;
    return (
        <ChatEngine 
        height="100vh" 
        projectID="c3e79e01-d8f0-4735-a0e7-aa97f88c8b26"
        userName={localStorage.getItem('username')}
        userSecret={localStorage.getItem('password')}
        renderChatFeed={(chatAppProps) => <ChatFeed { ... chatAppProps} /> }
        
        />
    )
}

export default App;
