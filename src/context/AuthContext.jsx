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
            const payload = {
                email: data.email,
                password: data.password,
                ...data.options?.data
            };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) {
                const errorMessage = result.details ? `${result.error} (${result.details})` : (result.error || "Erreur lors de l'inscription");
                throw new Error(errorMessage);
            }
            return result;
        },
        signIn: async (credentials) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || result.details || "Erreur lors de la connexion");
            }
            // Set session in local Supabase SDK so the client works normally
            if (result.session) {
                await supabase.auth.setSession({
                    access_token: result.session.access_token,
                    refresh_token: result.session.refresh_token
                });
            }
            return result;
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
