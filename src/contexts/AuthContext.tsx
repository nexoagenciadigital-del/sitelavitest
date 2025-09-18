import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, UserProfile, SiteSettings } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  updateUserProfile: (userData: Partial<UserProfile>) => Promise<boolean>;
  siteSettings: SiteSettings | null;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (settingsError) {
        console.error('Error fetching site settings:', settingsError);
      } else {
        setSiteSettings(settingsData);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setUser({ ...session.user, user_profile: null });
          } else {
            setUser({ ...session.user, user_profile: profileData as UserProfile });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      // Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error getting session:', sessionError);
      }
      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setUser({ ...session.user, user_profile: null });
        } else {
          setUser({ ...session.user, user_profile: profileData as UserProfile });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    fetchInitialData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    if (data.user) {
      // User profile will be fetched by onAuthStateChange
      return true;
    }
    return false;
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    // This function is essentially the same as 'login' now, but kept for clarity if different logic is needed later
    return login(email, password);
  };

  const registerUser = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name, // This will be available in NEW.raw_user_meta_data->>'name' for the trigger
        }
      }
    });
    setIsLoading(false);
    if (error) {
      console.error('Registration error:', error.message);
      return false;
    }
    if (data.user) {
      // The trigger `handle_new_user` will create the user_profile entry.
      // The onAuthStateChange listener will then fetch the complete user object.
      return true;
    }
    return false;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) {
      console.error('Logout error:', error.message);
    }
    setUser(null);
  };

  const updateUserProfile = async (userData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    const { error } = await supabase
      .from('user_profiles')
      .update(userData)
      .eq('id', user.id);
    setIsLoading(false);
    if (error) {
      console.error('Error updating user profile:', error.message);
      return false;
    }
    // Update local user state
    setUser(prevUser => prevUser ? { ...prevUser, user_profile: { ...prevUser.user_profile, ...userData } as UserProfile } : null);
    return true;
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<boolean> => {
    if (!user || user.user_profile?.role !== 'admin' || !siteSettings) return false;
    setIsLoading(true);
    const { error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', siteSettings.id); // Assuming there's only one settings row
    setIsLoading(false);
    if (error) {
      console.error('Error updating site settings:', error.message);
      return false;
    }
    setSiteSettings(prevSettings => prevSettings ? { ...prevSettings, ...settings } as SiteSettings : null);
    return true;
  };

  const isAdmin = user?.user_profile?.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginUser,
      registerUser,
      logout,
      isAdmin,
      isLoggedIn,
      isLoading,
      updateUserProfile,
      siteSettings,
      updateSiteSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};
