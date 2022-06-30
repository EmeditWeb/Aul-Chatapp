import { ChatEngine} from 'react-chat-engine';

import ChatFeed from './component/ChatFeed';
import LoginForm from './component/LoginForm'
import './App.css';

export default App;
import React from 'react';
import { ChatEngine } from 'react-chat-engine';

export function App() {
	return (
		<ChatEngine
			height='100vh'
			userName='Emedit'
			userSecret='iamme'
			projectID='0f1a093e-1f56-4042-b06b-cf453e31cb6a'
		/>
	);
}
