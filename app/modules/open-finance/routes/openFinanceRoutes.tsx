import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectAccountsScreen, ConnectInstitutionScreen } from '../screens';
import type { Connector } from '../slices';

export type OpenFinanceStackParamList = {
    ConnectAccounts: undefined;
    ConnectInstitution: {
        connector: Connector;
    };
};

const Stack = createNativeStackNavigator<OpenFinanceStackParamList>();

export const OpenFinanceRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="ConnectAccounts" component={ConnectAccountsScreen} />
        <Stack.Screen
            name="ConnectInstitution"
            component={ConnectInstitutionScreen}
            options={{
                presentation: 'card',
                animation: 'slide_from_right',
            }}
        />
    </Stack.Navigator>
);
