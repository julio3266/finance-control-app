import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useAppSelector, useAppDispatch } from '@app/store';
import type { RootState } from '@app/store';
import { AuthRoutes } from '@app/modules/auth/routes';
import { DrawerNavigator } from '@app/navigation/DrawerNavigation';
import { OnboardingRoutes } from '@app/modules/onboarding';
import { LoadingScreen } from '@app/components';
import { fetchUserProfile } from '@app/modules/auth/slices/authApi';

// Deep linking configuration
const prefix = Linking.createURL('/');

const linking = {
    prefixes: [prefix, 'financecontrol://', 'https://financecontrolapp.com.br'],
    config: {
        screens: {
            Home: {
                screens: {
                    Drawer: {
                        screens: {
                            MainTabs: {
                                screens: {
                                    Dashboard: 'dashboard',
                                },
                            },
                        },
                    },
                    OpenFinance: {
                        screens: {
                            ConnectAccounts: 'open-finance/connect',
                            ConnectInstitution: {
                                path: 'open-finance/institution',
                            },
                            MyConnections: 'open-finance/connections',
                        },
                    },
                },
            },
        },
    },
};

export type RootStackParamList = {
    Auth: undefined;
    Onboarding: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector<boolean>(
        (state: RootState) => (state.auth as { isAuthenticated: boolean }).isAuthenticated,
    );
    const needsOnboarding = useAppSelector<boolean>(
        (state: RootState) => (state.auth as { needsOnboarding: boolean }).needsOnboarding,
    );

    const profileLoading = useAppSelector<boolean>(
        (state: RootState) => (state.auth as { profileLoading: boolean }).profileLoading,
    );
    const user = useAppSelector((state: RootState) => (state.auth as { user: unknown }).user);

    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(fetchUserProfile());
        }
    }, [isAuthenticated, user, dispatch]);

    const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

    // Handle deep links when app is already open
    useEffect(() => {
        const subscription = Linking.addEventListener('url', ({ url }) => {
            console.log('🔗 [Navigation] Deep link received:', url);

            // Handle OAuth callback from Open Finance
            if (url.includes('oauth-callback') || url.includes('open-finance')) {
                console.log('🔗 [Navigation] Open Finance OAuth callback detected');
                // The PluggyConnect widget inside ConnectInstitutionScreen will handle this
            }
        });

        // Check if app was opened via deep link
        Linking.getInitialURL().then((url) => {
            if (url) {
                console.log('🔗 [Navigation] App opened with deep link:', url);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (isAuthenticated && profileLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer
            ref={navigationRef}
            linking={linking}
            fallback={<LoadingScreen />}
        >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'none',
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth" component={AuthRoutes} />
                ) : needsOnboarding ? (
                    <Stack.Screen name="Onboarding" component={OnboardingRoutes} />
                ) : (
                    <Stack.Screen name="Home" component={DrawerNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
