import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IncomesScreen } from '../screens';
import { NewTransactionScreen } from '@app/modules/shared';

export type IncomesStackParamList = {
    Incomes: undefined;
    NewTransaction: undefined;
};

const Stack = createNativeStackNavigator<IncomesStackParamList>();

const NewIncomeScreen = () => <NewTransactionScreen type="income" />;

export const IncomesRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Incomes" component={IncomesScreen} />
        <Stack.Screen
            name="NewTransaction"
            component={NewIncomeScreen}
            options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
            }}
        />
    </Stack.Navigator>
);
