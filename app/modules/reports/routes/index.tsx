import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportsScreen from '../screens/ReportsScreen';

export type ReportsStackParamList = {
    ReportsMain: undefined;
};

const Stack = createNativeStackNavigator<ReportsStackParamList>();

export const ReportsRoutes = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ReportsMain" component={ReportsScreen} />
    </Stack.Navigator>
);
