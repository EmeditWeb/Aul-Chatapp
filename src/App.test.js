import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock contexts
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ currentUser: null }) // Default not logged in
}));
jest.mock('./contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }) => <div>{children}</div>,
  useTheme: () => ({ darkTheme: false, toggleTheme: jest.fn() })
}));

// Mock components
jest.mock('./component/LoginForm', () => () => <div data-testid="login-form">LoginForm</div>);
jest.mock('./component/ChatFeed', () => () => <div data-testid="chat-feed">ChatFeed</div>);
jest.mock('react-chat-engine', () => ({
  ChatEngine: () => <div data-testid="chat-engine">ChatEngine</div>
}));
jest.mock('./component/Onboarding', () => () => <div data-testid="onboarding">Onboarding</div>);
jest.mock('./component/ThemeToggle', () => () => <div>ThemeToggle</div>);

// Mock Supabase
jest.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
    },
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

// Mock window.matchMedia for Ant Design or other libs if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('App component', () => {
  test('renders LoginForm by default (redirects to login)', () => {
    render(<App />);
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
