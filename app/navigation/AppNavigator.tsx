import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '@app/store';
import type { RootState } from '@app/store';
import { AuthRoutes } from '@app/modules/auth/routes';
import { DrawerNavigator } from '@app/navigation/DrawerNavigation';
import { OnboardingRoutes } from '@app/modules/onboarding';
import { LoadingScreen } from '@app/components';
import { fetchUserProfile } from '@app/modules/auth/slices/authApi';

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

    if (isAuthenticated && profileLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
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
