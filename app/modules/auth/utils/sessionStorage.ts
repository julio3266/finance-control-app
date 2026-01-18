import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@auth:session';

export interface SessionData {
    token: string;
    email: string;
    expiresAt: string;
    isOnboardingQualified: boolean;
}

export const sessionStorage = {
    async save(session: SessionData): Promise<void> {
        try {
            await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch (error) {
            // Error saving session
        }
    },

    async load(): Promise<SessionData | null> {
        try {
            const data = await AsyncStorage.getItem(SESSION_KEY);
            if (data) {
                return JSON.parse(data) as SessionData;
            }
            return null;
        } catch (error) {
            // Error loading session
            return null;
        }
    },

    async clear(): Promise<void> {
        try {
            await AsyncStorage.removeItem(SESSION_KEY);
        } catch (error) {
            // Error clearing session
        }
    },
};
