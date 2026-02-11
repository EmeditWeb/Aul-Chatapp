import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mocks
jest.mock('../contexts/AuthContext');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  },
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ currentUser: null });
    useNavigate.mockReturnValue(jest.fn());
  });

  test('renders login form by default', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    // The submit button says "Sign In"
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText(/continue with github/i)).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test('toggles to signup form', () => {
    render(<LoginForm />);
    // Initial state: Login
    // Toggle link says "Sign Up"
    const toggleLink = screen.getByText('Sign Up');
    fireEvent.click(toggleLink);

    // Now state: Signup
    // Header says "Create Account"
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
    // Submit button says "Sign Up"
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    // Toggle link says "Sign In"
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
