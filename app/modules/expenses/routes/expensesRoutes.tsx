import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpensesScreen } from '../screens';
import { NewTransactionScreen } from '@app/modules/shared';

export type ExpensesStackParamList = {
    Expenses: undefined;
    NewTransaction: undefined;
};

const Stack = createNativeStackNavigator<ExpensesStackParamList>();

const NewExpenseScreen = () => <NewTransactionScreen type="expense" />;

export const ExpensesRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Expenses" component={ExpensesScreen} />
        <Stack.Screen
            name="NewTransaction"
            component={NewExpenseScreen}
            options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
            }}
        />
    </Stack.Navigator>
);
