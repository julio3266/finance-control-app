import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { DashboardRoutes } from '@app/modules/dashboard';
import { ExtractRoutes } from '@app/modules/extract';
import { InvestimentsRoutes, InvestimentsStackParamList } from '@app/modules/investiments';
import { MoreRoutes } from '@app/modules/more';
import { BottomNavigationBar } from '../components';

export type HomeTabParamList = {
    Dashboard: undefined;
    Extract: undefined;
    Investiments: NavigatorScreenParams<InvestimentsStackParamList>;
    More: undefined;
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
    </Tab.Navigator>
);
