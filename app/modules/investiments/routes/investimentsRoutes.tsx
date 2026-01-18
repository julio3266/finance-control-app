import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InvestimentsScreen } from '../screens';

export type InvestimentsStackParamList = {
    Investiments: undefined;
};

const Stack = createNativeStackNavigator<InvestimentsStackParamList>();

export const InvestimentsRoutes: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Investiments" component={InvestimentsScreen} />
        </Stack.Navigator>
    );
};

