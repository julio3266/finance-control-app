import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpensesScreen } from '../screens';

export type ExpensesStackParamList = {
    Expenses: undefined;
};

const Stack = createNativeStackNavigator<ExpensesStackParamList>();

export const ExpensesRoutes: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Expenses" component={ExpensesScreen} />
        </Stack.Navigator>
    );
};

