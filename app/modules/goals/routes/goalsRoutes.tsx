import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NewGoalScreen, GoalsListScreen } from '../screens';

export type GoalsStackParamList = {
    NewGoal: { goalId?: string } | undefined;
    GoalsList: undefined;
};

const Stack = createNativeStackNavigator<GoalsStackParamList>();

export const GoalsRoutes: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="GoalsList" component={GoalsListScreen} />
            <Stack.Screen
                name="NewGoal"
                component={NewGoalScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
        </Stack.Navigator>
    );
};

