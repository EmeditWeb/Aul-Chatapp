import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mocking the components
jest.mock('./component/LoginForm', () => () => <div data-testid="login-form">LoginForm</div>);
jest.mock('react-chat-engine', () => ({
  ChatEngine: () => <div data-testid="chat-engine">ChatEngine</div>
}));

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders LoginForm when username is not in localStorage', () => {
    render(<App />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-engine')).not.toBeInTheDocument();
  });

  test('renders ChatEngine when username is in localStorage', () => {
    localStorage.setItem('username', 'testuser');
    render(<App />);
    expect(screen.getByTestId('chat-engine')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });
});
