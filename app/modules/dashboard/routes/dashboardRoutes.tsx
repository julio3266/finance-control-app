import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens';

export type DashboardStackParamList = {
    Dashboard: undefined;
};

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
);
