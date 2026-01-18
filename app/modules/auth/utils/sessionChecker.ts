import { store } from '@app/store/index';
import { logout } from '@auth/slices/authSlice';
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
    } catch (error: any) {
        return error;
    }
};

/**
 * Verifica e desloga o usuário se a sessão expirou
 */
export const checkAndLogoutIfExpired = async (): Promise<void> => {
    const state = store.getState();
    const auth = state.auth as { expiresAt: string | null; isAuthenticated: boolean };
    const { expiresAt, isAuthenticated } = auth;

    if (isAuthenticated && isSessionExpired(expiresAt)) {
        store.dispatch(logout());
        await persistor.purge();
    }
};
