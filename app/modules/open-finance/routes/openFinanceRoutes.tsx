import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConnectAccountsScreen, ConnectInstitutionScreen, MyConnectionsScreen } from '../screens';
import type { Connector } from '../slices';

export type PluggyProduct =
    | 'ACCOUNTS'
    | 'CREDIT_CARDS'
    | 'TRANSACTIONS'
    | 'PAYMENT_DATA'
    | 'INVESTMENTS'
    | 'INVESTMENTS_TRANSACTIONS'
    | 'IDENTITY'
    | 'BROKERAGE_NOTE'
    | 'MOVE_SECURITY'
    | 'LOANS';

export type OpenFinanceStackParamList = {
    MyConnections: undefined;
    ConnectAccounts: { onlyCreditCards?: boolean } | undefined;
    ConnectInstitution: {
        connector: Connector;
        products?: PluggyProduct[];
    };
};

const Stack = createNativeStackNavigator<OpenFinanceStackParamList>();

export const OpenFinanceRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="MyConnections" component={MyConnectionsScreen} />
        <Stack.Screen name="ConnectAccounts" component={ConnectAccountsScreen} />
        <Stack.Screen
            name="ConnectInstitution"
            component={ConnectInstitutionScreen}
            options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
            }}
        />
    </Stack.Navigator>
);
