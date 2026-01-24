import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FilterScreen } from '../screens';

export type FilterStackParamList = {
    Filter: undefined;
};

const Stack = createNativeStackNavigator<FilterStackParamList>();

export const FilterRoutes: React.FC = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Filter" component={FilterScreen} />
    </Stack.Navigator>
);

