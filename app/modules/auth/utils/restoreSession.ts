import { store } from '@app/store';
import { setToken, setEmail, setExpiresAt } from '../slices/authSlice';
import { sessionStorage, SessionData } from './sessionStorage';
import { isSessionExpired } from './sessionChecker';

/**
 * Restaura a sessão do usuário do AsyncStorage ao iniciar o app
 */
export const restoreSession = async (): Promise<boolean> => {
    try {
        const session = await sessionStorage.load();

        if (!session) {
            return false;
        }

        // Verificar se a sessão expirou
        if (isSessionExpired(session.expiresAt)) {
            await sessionStorage.clear();
            return false;
        }

        // Restaurar sessão no Redux
        store.dispatch(setToken(session.token));
        store.dispatch(setEmail(session.email));
        store.dispatch(setExpiresAt(session.expiresAt));

        return true;
    } catch (error) {
        // Error restoring session
        return false;
    }
};
