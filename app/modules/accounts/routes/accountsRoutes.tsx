import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountListScreen } from '../screens';

export type AccountsStackParamList = {
    AccountsList: undefined;
    AccountDetails: { accountId: string; source: 'manual' | 'openFinance' };
    NewAccount: undefined;
};

const Stack = createNativeStackNavigator<AccountsStackParamList>();

export const AccountsRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="AccountsList" component={AccountListScreen} />
    </Stack.Navigator>
);
