/**
 * Tests — UserProfileMenu Component
 * Verifies dropdown rendering, navigation, logout, and User Data usage
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfileMenu } from '../UserProfileMenu';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

vi.mock('../../../context/DataContext', () => ({
    useData: vi.fn()
}));

import { useData } from '../../../context/DataContext';

describe('UserProfileMenu Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useData.mockReturnValue({
            currentUser: {
                id: '1',
                name: 'Flavien',
                email: 'flavien@visuals.co',
                avatar: null
            }
        });
    });

    it('should render the user avatar initial when no image provided', () => {
        render(
            <MemoryRouter>
                <UserProfileMenu />
            </MemoryRouter>
        );
        expect(screen.getByText('F')).toBeInTheDocument();
    });

    it('should not show menu initially', () => {
        render(
            <MemoryRouter>
                <UserProfileMenu />
            </MemoryRouter>
        );
        expect(screen.queryByText('Mon Profil')).not.toBeInTheDocument();
    });

    it('should toggle menu on click', () => {
        render(
            <MemoryRouter>
                <UserProfileMenu />
            </MemoryRouter>
        );
        
        const button = screen.getByRole('button');
        fireEvent.click(button);
        
        expect(screen.getByText('Mon Profil')).toBeInTheDocument();
        expect(screen.getByText('Paramètres')).toBeInTheDocument();
        expect(screen.getByText('Déconnexion')).toBeInTheDocument();
    });

    it('should navigate to profile and close menu', () => {
        render(
            <MemoryRouter>
                <UserProfileMenu />
            </MemoryRouter>
        );
        
        // Open menu
        fireEvent.click(screen.getByRole('button'));
        
        // Click profile
        fireEvent.click(screen.getByText('Mon Profil'));
        
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
        expect(screen.queryByText('Paramètres')).not.toBeInTheDocument();
    });

    it('should display user name and email in menu', () => {
        render(
            <MemoryRouter>
                <UserProfileMenu />
            </MemoryRouter>
        );
        
        fireEvent.click(screen.getByRole('button'));
        
        expect(screen.getByText('Flavien')).toBeInTheDocument();
        expect(screen.getByText('flavien@visuals.co')).toBeInTheDocument();
    });

    it('should call logout function', () => {
        render(
            <MemoryRouter>
                <UserProfileMenu />
            </MemoryRouter>
        );
        
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Déconnexion'));
        
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
