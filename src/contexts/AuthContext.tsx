import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, UserProfile, SiteSettings } from '../types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error getting session:', sessionError);
        }

        setSession(session);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          setSession(session);
          
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setUser(null);
          }
        });

        // Fetch site settings
        await fetchSiteSettings();

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // If profile doesn't exist, create one
        if (profileError.code === 'PGRST116') {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const { error: insertError } = await supabase
              .from('user_profiles')
              .insert({
                id: userId,
                name: userData.user.email || 'Usuário',
                role: 'user'
              });
            
            if (!insertError) {
              await fetchUserProfile(userId);
              return;
            }
          }
        }
        setUser(session?.user as User || null);
      } else {
        setUser({ ...session?.user, user_profile: profileData } as User);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(session?.user as User || null);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
      } else {
        setSiteSettings(data);
      }
    } catch (error) {
      console.error('Error in fetchSiteSettings:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Erro inesperado durante o login' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Error in logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Erro inesperado durante o registro' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(userData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user profile:', error);
        return false;
      }

      // Update local user state
      setUser(prevUser => prevUser ? { 
        ...prevUser, 
        user_profile: { ...prevUser.user_profile, ...userData } as UserProfile 
      } : null);
      
      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<boolean> => {
    if (!user || user.user_profile?.role !== 'admin' || !siteSettings) return false;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update(settings)
        .eq('id', siteSettings.id);

      if (error) {
        console.error('Error updating site settings:', error);
        return false;
      }

      setSiteSettings(prevSettings => prevSettings ? { 
        ...prevSettings, 
        ...settings 
      } as SiteSettings : null);
      
      return true;
    } catch (error) {
      console.error('Error in updateSiteSettings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.user_profile?.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      logout,
      register,
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