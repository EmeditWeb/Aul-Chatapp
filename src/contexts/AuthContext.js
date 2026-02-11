import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // Timeout fallback to ensure UI loads even if auth checks hang
    setTimeout(() => {
        if (mounted) setLoading(false);
    }, 2000);

    // Listen for changes on auth state
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }

  const value = {
    currentUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
