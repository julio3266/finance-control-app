import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewCreditCardScreen, CreditCardsScreen, CreditCardDetailsScreen } from '../screens';

export type CreditCardStackParamList = {
    CreditCards: undefined;
    NewCreditCard: undefined;
    CreditCardDetails: {
        cardId: string;
        bankName: string;
        brandIconUrl?: string | null;
        brandId?: string;
        currentBill: number;
        availableLimit: number;
        closingDay: number;
        dueDay: number;
        status: 'open' | 'closed';
    };
};

const Stack = createNativeStackNavigator<CreditCardStackParamList>();

export const CreditCardRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="CreditCards" component={CreditCardsScreen} />
        <Stack.Screen
            name="NewCreditCard"
            component={NewCreditCardScreen}
            options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
            }}
        />
        <Stack.Screen name="CreditCardDetails" component={CreditCardDetailsScreen} />
    </Stack.Navigator>
);
