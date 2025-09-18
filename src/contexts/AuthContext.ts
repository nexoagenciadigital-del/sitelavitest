import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, SiteSettings } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
  isAdmin: boolean;
  isLoggedIn: boolean;
  siteSettings: SiteSettings | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setUser(session.user as User);
        } else {
          setUser({ ...session.user, user_profile: profileData } as User);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile on auth state change:', profileError);
            setUser(session.user as User);
          } else {
            setUser({ ...session.user, user_profile: profileData } as User);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    const fetchSiteSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      if (error) {
        console.error('Error fetching site settings:', error);
      } else {
        setSiteSettings(data);
      }
    };
    fetchSiteSettings();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  };

  const logout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    setIsLoading(false);
    if (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  };

  const isAdmin = user?.user_profile?.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, session, login, logout, register, isAdmin, isLoggedIn, siteSettings, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
