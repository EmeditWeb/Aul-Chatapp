import { ChatEngine} from 'react-chat-engine';

import ChatFeed from './component/ChatFeed';
import LoginForm from './component/LoginForm'
import './App.css';

const App = () => {
    if (!localStorage.getItem('username')) return <LoginForm />;
    return (
        <ChatEngine 
        height="100vh" 
        projectID="0f1a093e-1f56-4042-b06b-cf453e31cb6a"
        userName=12345
        userSecret=12345
        renderChatFeed={(chatAppProps) => <ChatFeed { ... chatAppProps} /> }
        
        />
    )
}

export default App;
