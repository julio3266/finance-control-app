import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewInvestmentScreen } from '../screens/NewInvestmentScreen';

export type NewInvestmentStackParamList = {
    NewInvestment: undefined;
};

const Stack = createNativeStackNavigator<NewInvestmentStackParamList>();

export const NewInvestmentRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
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
