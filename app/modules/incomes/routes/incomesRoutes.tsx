import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IncomesScreen } from '../screens';

export type IncomesStackParamList = {
    Incomes: undefined;
};

const Stack = createNativeStackNavigator<IncomesStackParamList>();

export const IncomesRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Incomes" component={IncomesScreen} />
    </Stack.Navigator>
);
