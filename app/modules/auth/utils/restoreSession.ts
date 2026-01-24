import { store } from '@app/store';
import { setToken, setEmail, setExpiresAt } from '../slices/authSlice';
import { sessionStorage, SessionData } from './sessionStorage';
import { isSessionExpired } from './sessionChecker';
import { apiClient } from '@app/utils/api';

/**
 * Restaura a sessão do usuário do AsyncStorage ao iniciar o app
 */
export const restoreSession = async (): Promise<boolean> => {
    try {
        const session = await sessionStorage.load();

        if (!session) {
            return false;
        }

        if (isSessionExpired(session.expiresAt)) {
            await sessionStorage.clear();
            apiClient.setToken(null);
            return false;
        }

        // Set token in API client for authenticated requests
        apiClient.setToken(session.token);

        store.dispatch(setToken(session.token));
        store.dispatch(setEmail(session.email));
        store.dispatch(setExpiresAt(session.expiresAt));

        return true;
    } catch (error) {
        return false;
    }
};
