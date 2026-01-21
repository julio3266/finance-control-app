import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreScreen } from '../screens';

export type MoreStackParamList = {
    MoreMain: undefined;
};

const Stack = createNativeStackNavigator<MoreStackParamList>();

export const MoreRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="MoreMain" component={MoreScreen} />
    </Stack.Navigator>
);
