/// <reference types="../redux-persist" />
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor, useAppSelector, RootState } from './store';
import { AppNavigator } from './navigation/AppNavigator';
import { checkAndLogoutIfExpired, isSessionExpired } from './modules/auth/utils/sessionChecker';
import { ToastProvider, useToast } from './utils/toast';
import { setToastHandler } from './store/middleware';
import { apiClient } from './utils/api';
import { StripeProvider } from '@stripe/stripe-react-native';
import { config } from './utils/config';
import { SessionProvider } from './providers';

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
    const { showToast } = useToast();

    useEffect(() => {
        setToastHandler(showToast);

        apiClient.clearInterceptors();

        const errorInterceptor = (error: any, method: string, url: string) => {
            if (url.includes('/auth/')) return;

            showToast(error.message || 'Erro ao processar requisição', 'error');
        };

        const successInterceptor = (method: string, url: string) => {
            if (method === 'GET' || url.includes('/auth/')) return;

            let message = 'Operação realizada com sucesso!';
            if (method === 'POST' && url.includes('/investments')) {
                message = 'Investimento criado com sucesso!';
            } else if (method === 'PUT' && url.includes('/investments')) {
                message = 'Investimento atualizado com sucesso!';
            } else if (method === 'DELETE' && url.includes('/investments')) {
                message = 'Investimento deletado com sucesso!';
            }

            showToast(message, 'success');
        };

        apiClient.onError(errorInterceptor);
        apiClient.onSuccess(successInterceptor);
    }, [showToast]);

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
                <SessionProvider>
                    <SafeAreaProvider>
                        <StripeProvider
                            publishableKey={config.stripePublishableKey}
                            urlScheme="financecontrol"
                        >
                            <ToastProvider>
                                <AppContent />
                            </ToastProvider>
                        </StripeProvider>
                    </SafeAreaProvider>
                </SessionProvider>
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
