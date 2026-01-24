import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { useTheme } from '@app/utils/useTheme';
import { HomeRoutes } from '@app/modules/Home/routes';
import { ExpensesRoutes, ExpensesStackParamList } from '@app/modules/expenses';
import { IncomesRoutes, IncomesStackParamList } from '@app/modules/incomes';
import { NewInvestmentRoutes, NewInvestmentStackParamList } from '@app/modules/investiments';
import { CreditCardRoutes, CreditCardStackParamList } from '@app/modules/credit-card';
import { OpenFinanceRoutes, OpenFinanceStackParamList } from '@app/modules/open-finance/routes';
import { SubscriptionRoutes, SubscriptionStackParamList } from '@app/modules/subscription';
import { FilterRoutes, FilterStackParamList } from '@app/modules/extract';
import { GoalsRoutes, GoalsStackParamList } from '@app/modules/goals/routes';
import { AccountsRoutes, AccountsStackParamList } from '@app/modules/accounts';
import { ReportsRoutes } from '@app/modules/reports';
import ProfileScreen from '@app/modules/profile/screens/ProfileScreen';
import { DrawerProvider, useDrawer } from './DrawerContext';

export type MainStackParamList = {
    HomeTabs: undefined;
    Expenses: ExpensesStackParamList;
    Incomes: IncomesStackParamList;
    NewInvestment: NewInvestmentStackParamList;
    CreditCard: CreditCardStackParamList;
    OpenFinance: OpenFinanceStackParamList;
    Subscription: SubscriptionStackParamList;
    Filter: NavigatorScreenParams<FilterStackParamList>;
    Goals: NavigatorScreenParams<GoalsStackParamList>;
    Accounts: NavigatorScreenParams<AccountsStackParamList>;
    Reports: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const DrawerContent: React.FC = () => {
    const { isOpen, closeDrawer } = useDrawer();
    const theme = useTheme();
    const slideAnim = React.useRef(new Animated.Value(-Dimensions.get('window').width)).current;
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            slideAnim.setValue(-Dimensions.get('window').width);
            setShouldRender(true);
            requestAnimationFrame(() => {
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                }).start();
            });
        } else {
            Animated.timing(slideAnim, {
                toValue: -Dimensions.get('window').width,
                duration: 250,
                useNativeDriver: true,
            }).start(() => {
                setShouldRender(false);
            });
        }
    }, [isOpen, slideAnim]);

    if (!shouldRender) return null;

    return (
        <>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDrawer} />
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        backgroundColor: theme.background,
                        transform: [{ translateX: slideAnim }],
                        height: Dimensions.get('window').height,
                    },
                ]}
            >
                <ProfileScreen />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 998,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        zIndex: 998,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
});

export const DrawerNavigator: React.FC = () => (
    <DrawerProvider>
        <View style={{ flex: 1 }}>
            <MainStack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_bottom',
                }}
            >
                <MainStack.Screen name="HomeTabs" component={HomeRoutes} />
                <MainStack.Screen name="Expenses" component={ExpensesRoutes} />
                <MainStack.Screen name="Incomes" component={IncomesRoutes} />
                <MainStack.Screen name="NewInvestment" component={NewInvestmentRoutes} />
                <MainStack.Screen name="CreditCard" component={CreditCardRoutes} />
                <MainStack.Screen name="OpenFinance" component={OpenFinanceRoutes} />
                <MainStack.Screen name="Subscription" component={SubscriptionRoutes} />
                <MainStack.Screen name="Filter" component={FilterRoutes} />
                <MainStack.Screen name="Goals" component={GoalsRoutes} />
                <MainStack.Screen name="Accounts" component={AccountsRoutes} />
                <MainStack.Screen name="Reports" component={ReportsRoutes} />
            </MainStack.Navigator>
            <DrawerContent />
        </View>
    </DrawerProvider>
);
