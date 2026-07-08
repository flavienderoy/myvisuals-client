import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const value = {
        signUp: async (data) => {
            const { error } = await supabase.auth.signUp(data);
            if (error) throw error;
        },
        signIn: async (credentials) => {
            const { data, error } = await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            return data;
        },
        signOut: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate('/');
        },
        user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
