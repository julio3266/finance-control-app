import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubscriptionScreen from '../screens/SubscriptionScreen';

export type SubscriptionStackParamList = {
    Subscription: undefined;
};

const Stack = createNativeStackNavigator<SubscriptionStackParamList>();

export const SubscriptionRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
    </Stack.Navigator>
);
