import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import SubscriptionSuccessScreen from '../screens/SubscriptionSuccessScreen';

export type SubscriptionStackParamList = {
    Subscription: undefined;
    SubscriptionSuccess: undefined;
};

const Stack = createNativeStackNavigator<SubscriptionStackParamList>();

export const SubscriptionRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="SubscriptionSuccess" component={SubscriptionSuccessScreen} />
    </Stack.Navigator>
);
