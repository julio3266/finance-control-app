import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExtractScreen } from '../screens';

export type ExtractStackParamList = {
    Extract: undefined;
};

const Stack = createNativeStackNavigator<ExtractStackParamList>();

export const ExtractRoutes: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Extract" component={ExtractScreen} />
        </Stack.Navigator>
    );
};

