import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardRoutes } from '@app/modules/dashboard';
import { ExtractRoutes } from '@app/modules/extract';
import { InvestimentsRoutes } from '@app/modules/investiments';
import { MoreRoutes } from '@app/modules/more';
import { ExpensesRoutes } from '@app/modules/expenses';
import { IncomesRoutes } from '@app/modules/incomes';
import { BottomNavigationBar } from '../components';

export type HomeTabParamList = {
    Dashboard: undefined;
    Extract: undefined;
    Investiments: undefined;
    More: undefined;
    Expenses: undefined;
    Incomes: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

export const HomeRoutes: React.FC = () => {
    return (
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
                    tabBarLabel: 'Dashboard',
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
                name="Investiments"
                component={InvestimentsRoutes}
                options={{
                    tabBarLabel: 'Investimentos',
                }}
            />
            <Tab.Screen
                name="More"
                component={MoreRoutes}
                options={{
                    tabBarLabel: 'Mais',
                }}
            />
            <Tab.Screen
                name="Expenses"
                component={ExpensesRoutes}
                options={{
                    tabBarButton: () => null,
                }}
            />
            <Tab.Screen
                name="Incomes"
                component={IncomesRoutes}
                options={{
                    tabBarButton: () => null,
                }}
            />
        </Tab.Navigator>
    );
};

