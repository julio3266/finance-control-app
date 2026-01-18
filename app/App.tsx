/// <reference types="../redux-persist" />
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistor, useAppSelector, RootState } from './store';
import { AppNavigator } from './navigation/AppNavigator';
import { checkAndLogoutIfExpired, isSessionExpired } from './modules/auth/utils/sessionChecker';

function AppContent() {
    const isAuthenticated = useAppSelector<boolean>(
        (state: RootState) => (state.auth as { isAuthenticated: boolean }).isAuthenticated,
    );
    const expiresAt = useAppSelector<string | null>(
        (state: RootState) => (state.auth as { expiresAt: string | null }).expiresAt,
    );
    const themeMode = useAppSelector<'dark' | 'light'>(
        (state: RootState) => (state.theme as { mode: 'dark' | 'light' }).mode,
    );

    useEffect(() => {
        if (isAuthenticated && isSessionExpired(expiresAt)) {
            checkAndLogoutIfExpired();
        }
    }, [isAuthenticated, expiresAt]);

    useEffect(() => {
        const interval = setInterval(async () => {
            await checkAndLogoutIfExpired();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <GestureHandlerRootView style={styles.gestureContainer}>
            <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
            <AppNavigator />
        </GestureHandlerRootView>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={<ActivityIndicator size="large" />} persistor={persistor}>
                <AppContent />
            </PersistGate>
        </Provider>
    );
}

const styles = StyleSheet.create({
    gestureContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});
