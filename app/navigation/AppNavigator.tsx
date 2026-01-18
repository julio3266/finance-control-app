import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '@app/store';
import { AuthRoutes } from '@app/modules/auth/routes';
import { HomeRoutes } from '@app/modules/Home/routes';

export type RootStackParamList = {
    Auth: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'none',
                }}
            >
                {isAuthenticated ? (
                    <Stack.Screen name="Home" component={HomeRoutes} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthRoutes} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

