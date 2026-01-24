import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { DashboardRoutes } from '@app/modules/dashboard';
import { ExtractRoutes } from '@app/modules/extract';
import { BudgetRoutes, BudgetStackParamList } from '@app/modules/budget';
import { ReportsRoutes } from '@app/modules/reports';
import { BottomNavigationBar } from '../components';

export type HomeTabParamList = {
    Dashboard: undefined;
    Extract: undefined;
    Budget: NavigatorScreenParams<BudgetStackParamList>;
    Reports: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

export const HomeRoutes: React.FC = () => (
    <Tab.Navigator
        tabBar={(props) => <BottomNavigationBar {...props} />}
        screenOptions={{
            headerShown: false,
        }}
    >
        <Tab.Screen
            name="Dashboard"
            component={DashboardRoutes}
            options={{
                tabBarLabel: 'Home',
            }}
        />
        <Tab.Screen
            name="Extract"
            component={ExtractRoutes}
            options={{
                tabBarLabel: 'Extrato',
            }}
        />
        <Tab.Screen
            name="Budget"
            component={BudgetRoutes}
            options={{
                tabBarLabel: 'Orçamento',
            }}
        />
        <Tab.Screen
            name="Reports"
            component={ReportsRoutes}
            options={{
                tabBarLabel: 'Relatórios',
            }}
        />
    </Tab.Navigator>
);
