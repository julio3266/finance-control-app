import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetScreen, CreateBudgetScreen } from '../screens';

export type BudgetStackParamList = {
    BudgetMain: undefined;
    CreateBudget: undefined;
    EditBudget: { budgetId: string };
};

const Stack = createNativeStackNavigator<BudgetStackParamList>();

export const BudgetRoutes: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="BudgetMain" component={BudgetScreen} />
            <Stack.Screen name="CreateBudget" component={CreateBudgetScreen} />
            <Stack.Screen name="EditBudget" component={CreateBudgetScreen} />
        </Stack.Navigator>
    );
};
