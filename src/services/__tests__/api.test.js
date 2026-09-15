/**
 * Tests de non-régression — session refusée par l'API
 *
 * Après la suppression d'un compte, le navigateur garde sa session : le jeton
 * reste bien formé, getSession() le renvoie, mais l'API répond 401 à toutes les
 * requêtes (« User from sub claim in JWT does not exist »). L'intercepteur se
 * contentait d'un console.warn : l'application restait bloquée sur un tableau
 * de bord vide, sans jamais revenir à l'écran de connexion.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError } from 'axios';

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            signOut: vi.fn(),
        },
    },
}));

import { supabase } from '../../supabaseClient';
import api from '../api';

const SESSION = { access_token: 'jeton-compte-supprime' };

// Adaptateur axios qui répond avec le statut demandé, sans réseau.
const respondWith = (status) => (config) =>
    Promise.reject(
        new AxiosError(`HTTP ${status}`, 'ERR_BAD_REQUEST', config, null, {
            status,
            data: {},
            headers: {},
            config,
        })
    );

beforeEach(() => {
    vi.clearAllMocks();
    supabase.auth.signOut.mockResolvedValue({ error: null });
});

describe('api — session refusée', () => {
    it('ferme la session locale une seule fois quand plusieurs requêtes authentifiées reçoivent 401', async () => {
        supabase.auth.getSession.mockResolvedValue({ data: { session: SESSION } });

        const calls = ['/projects', '/clients', '/tasks'].map((url) =>
            api.get(url, { adapter: respondWith(401) }).catch((e) => e)
        );
        const errors = await Promise.all(calls);

        errors.forEach((e) => expect(e.response.status).toBe(401));
        expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
        expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
    });

    it('ne touche pas à la session sur un 401 sans jeton', async () => {
        supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

        await api.get('/projects', { adapter: respondWith(401) }).catch(() => {});

        expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });

    it('ne touche pas à la session sur une autre erreur (500)', async () => {
        supabase.auth.getSession.mockResolvedValue({ data: { session: SESSION } });

        await api.get('/projects', { adapter: respondWith(500) }).catch(() => {});

        expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });
});
