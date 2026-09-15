/**
 * Tests de non-régression — vérification de la session au démarrage
 *
 * getSession() lit le stockage du navigateur sans interroger Supabase. Une
 * session appartenant à un compte supprimé était donc acceptée telle quelle, et
 * l'application tentait de charger des données que l'API refusait toutes.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            getUser: vi.fn(),
            signOut: vi.fn(),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        },
    },
}));

import { supabase } from '../../supabaseClient';
import { AuthProvider, useAuth } from '../AuthContext';

const SESSION = { access_token: 'jeton', user: { id: 'u1', email: 'studio@exemple.fr' } };

const WhoAmI = () => {
    const { user } = useAuth();
    return <p>{user ? `connecté : ${user.email}` : 'déconnecté'}</p>;
};

const renderProvider = () =>
    render(
        <MemoryRouter>
            <AuthProvider>
                <WhoAmI />
            </AuthProvider>
        </MemoryRouter>
    );

beforeEach(() => {
    vi.clearAllMocks();
    supabase.auth.getSession.mockResolvedValue({ data: { session: SESSION }, error: null });
    supabase.auth.signOut.mockResolvedValue({ error: null });
});

describe('AuthProvider — session au démarrage', () => {
    it('déconnecte une session dont le compte a été supprimé (403 user_not_found)', async () => {
        supabase.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: { status: 403, code: 'user_not_found', message: 'User from sub claim in JWT does not exist' },
        });

        renderProvider();

        expect(await screen.findByText('déconnecté')).toBeInTheDocument();
        expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
    });

    it('garde la session si le compte existe', async () => {
        supabase.auth.getUser.mockResolvedValue({ data: { user: SESSION.user }, error: null });

        renderProvider();

        expect(await screen.findByText('connecté : studio@exemple.fr')).toBeInTheDocument();
        expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });

    it('ne déconnecte pas sur une panne réseau', async () => {
        supabase.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: { status: 0, name: 'AuthRetryableFetchError', message: 'Failed to fetch' },
        });

        renderProvider();

        await waitFor(() => expect(screen.getByText('connecté : studio@exemple.fr')).toBeInTheDocument());
        expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });
});
