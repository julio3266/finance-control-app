import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InvestimentsScreen } from '../screens';
import { NewInvestmentScreen } from '../screens/NewInvestmentScreen';

export type InvestimentsStackParamList = {
    Investiments: undefined;
    NewInvestment: undefined;
};

const Stack = createNativeStackNavigator<InvestimentsStackParamList>();

export const InvestimentsRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Investiments" component={InvestimentsScreen} />
        <Stack.Screen
            name="NewInvestment"
            component={NewInvestmentScreen}
            options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
            }}
        />
    </Stack.Navigator>
);
