import { ChatEngine} from 'react-chat-engine';

import ChatFeed from './component/ChatFeed';
import LoginForm from './component/LoginForm'
import './App.css';

const App = () => {
    if (!localStorage.getItem('username')) return <LoginForm />;
    return (
        <ChatEngine
        height="100vh"
        projectID={process.env.REACT_APP_PROJECT_ID}
        userName={localStorage.getItem('username')}
        userSecret={localStorage.getItem('password')}
        renderChatFeed={(chatAppProps) => <ChatFeed { ... chatAppProps} /> }

        />
    )
}

export default App;
