import { store } from '@app/store';
import { logout } from '../slices/authSlice';
import { persistor } from '@app/store';

/**
 * Verifica se a sessão expirou baseado no expiresAt
 * @param expiresAt - Data de expiração em formato ISO string
 * @returns true se a sessão expirou, false caso contrário
 */
export const isSessionExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) {
        return true;
    }

    try {
        const expirationDate = new Date(expiresAt);
        const now = new Date();
        return now >= expirationDate;
    } catch (error) {
        console.error('Error checking session expiration:', error);
        return true;
    }
};

/**
 * Verifica e desloga o usuário se a sessão expirou
 */
export const checkAndLogoutIfExpired = async (): Promise<void> => {
    const state = store.getState();
    const { expiresAt, isAuthenticated } = state.auth;

    if (isAuthenticated && isSessionExpired(expiresAt)) {
        console.log('Session expired, logging out...');
        store.dispatch(logout());
        // Limpar persist storage
        await persistor.purge();
    }
};

