import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IHandles } from 'react-native-modalize/lib/options';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useAppSelector, useAppDispatch } from '@app/store';
import { styles } from './styles';
import { FabMenu } from '../FabMenu';
import { useDrawer } from '@app/navigation/DrawerNavigation/DrawerContext';
import type { MainStackParamList } from '@app/navigation/DrawerNavigation';
import { CreditCardCreationModal } from '@app/modules/credit-card/components/CreditCardCreationModal';
import { fetchUserProfile } from '@app/modules/profile/slices';

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

interface BottomNavigationBarProps extends BottomTabBarProps {}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ state, navigation }) => {
    const theme = useTheme();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
    const fabRotation = useRef(new Animated.Value(0)).current;
    const creditCardModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const { isOpen: isDrawerOpen, closeDrawer } = useDrawer();
    const parentNavigation = useNavigation<MainStackNavigationProp>();
    const profile = useAppSelector((state) => state.profile.profile);
    const profileLoading = useAppSelector((state) => state.profile.loading);
    const isPremium = profile?.isPremium ?? false;

    // Carregar profile se não estiver carregado
    useEffect(() => {
        if (!profile && !profileLoading) {
            dispatch(fetchUserProfile() as any);
        }
    }, [dispatch, profile, profileLoading]);

    const shouldHideBottomBar = React.useMemo(() => {
        if (isDrawerOpen) {
            return true;
        }

        try {
            const currentTabRoute = state.routes[state.index];
            if (currentTabRoute?.name === 'Investiments') {
                const investState = (currentTabRoute as any)?.state;
                if (investState) {
                    const investRoute = investState.routes?.[investState.index];
                    if (investRoute?.name === 'NewInvestment') {
                        return true;
                    }
                }
            }

            const parentNavState = parentNavigation.getState();
            if (!parentNavState) return false;

            const parentRoute = parentNavState.routes[parentNavState.index];

            if (parentRoute?.name === 'NewInvestment') {
                return true;
            }

            if (parentRoute?.name !== 'HomeTabs') {
                const nestedState = (parentRoute as any)?.state;
                if (nestedState) {
                    const nestedRoute = nestedState.routes?.[nestedState.index];
                    const routeName = nestedRoute?.name;
                    if (routeName === 'NewTransaction' || routeName === 'NewInvestment') {
                        return true;
                    }
                }
            }

            return false;
        } catch {
            return false;
        }
    }, [state, parentNavigation, isDrawerOpen]);

    if (shouldHideBottomBar) {
        return null;
    }

    const handleFabPress = () => {
        const newState = !isFabMenuOpen;
        setIsFabMenuOpen(newState);

        Animated.spring(fabRotation, {
            toValue: newState ? 1 : 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    };

    const handleIncomePress = () => {
        parentNavigation.navigate('Incomes', { screen: 'NewTransaction' } as any);
    };

    const handleExpensePress = () => {
        parentNavigation.navigate('Expenses', { screen: 'NewTransaction' } as any);
    };

    const handleInvestmentPress = () => {
        parentNavigation.navigate('NewInvestment', { screen: 'NewInvestment' } as any);
    };

    const handleCreditCardPress = () => {
        creditCardModalRef.current?.open();
    };

    const handleManualCreditCard = () => {
        parentNavigation.navigate('CreditCard', { screen: 'NewCreditCard' } as any);
    };

    const handleOpenFinanceCreditCard = () => {
        // Debug: verificar valores
        if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('Open Finance Click:', {
                isPremium,
                profile: profile ? { isPremium: profile.isPremium, plan: profile.plan } : null,
                profileLoading,
            });
        }

        // Se o profile ainda está carregando, aguardar um pouco
        if (profileLoading) {
            // Aguardar o profile carregar antes de decidir
            return;
        }

        // Se não há profile ou não é premium, redirecionar para subscription
        if (!profile || !isPremium) {
            parentNavigation.navigate('Subscription', { screen: 'Subscription' } as any);
            return;
        }

        // Usuário é premium, navegar para Open Finance
        parentNavigation.navigate('OpenFinance', { screen: 'ConnectAccounts' } as any);
    };

    const fabRotate = fabRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    const tabConfig: Record<
        string,
        { label: string; iconComponent: React.ComponentType<any>; iconName: string }
    > = {
        Dashboard: {
            label: 'Home',
            iconComponent: Feather,
            iconName: 'home',
        },
        Extract: {
            label: 'Extrato',
            iconComponent: Entypo,
            iconName: 'list',
        },
        Investiments: {
            label: 'Investimentos',
            iconComponent: FontAwesome5,
            iconName: 'chart-bar',
        },
        More: {
            label: 'Metas',
            iconComponent: Entypo,
            iconName: 'bar-graph',
        },
    };

    const renderIcon = (
        IconComponent: React.ComponentType<any>,
        iconName: string,
        isActive: boolean,
    ) => {
        const iconColor = isActive ? colors.primary[600] : theme.foregroundMuted;
        return <IconComponent name={iconName} size={24} color={iconColor} />;
    };

    const renderTab = (route: (typeof state.routes)[0], index: number) => {
        const isActive = isDrawerOpen ? false : state.index === index;
        const config = tabConfig[route.name];

        if (!config) return null;

        const handlePress = () => {
            if (isDrawerOpen) {
                closeDrawer();
            }

            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        };

        return (
            <TouchableOpacity
                key={route.key}
                style={styled.tab}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <View style={styled.iconContainer}>
                    {renderIcon(config.iconComponent, config.iconName, isActive)}
                </View>
                <Text style={[styled.tabLabel, isActive && styled.tabLabelActive]}>
                    {config.label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styled.wrapper}>
                <View style={styled.container}>
                    {state.routes.slice(0, 2).map((route, index) => renderTab(route, index))}
                    <View style={styled.fabSpacer} />
                    {state.routes.slice(2).map((route, index) => renderTab(route, index + 2))}
                </View>

                <View style={styled.fabContainer} pointerEvents="box-none">
                    <Animated.View
                        style={{
                            transform: [{ rotate: fabRotate }],
                        }}
                    >
                        <TouchableOpacity
                            style={styled.fab}
                            onPress={handleFabPress}
                            activeOpacity={0.8}
                        >
                            <Text style={styled.fabIcon}>+</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>

            <FabMenu
                isOpen={isFabMenuOpen}
                onClose={() => {
                    setIsFabMenuOpen(false);
                    Animated.spring(fabRotation, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 50,
                        friction: 7,
                    }).start();
                }}
                onIncomePress={handleIncomePress}
                onExpensePress={handleExpensePress}
                onInvestmentPress={handleInvestmentPress}
                onCreditCardPress={handleCreditCardPress}
            />

            <CreditCardCreationModal
                modalizeRef={creditCardModalRef}
                isPremium={isPremium}
                onManualPress={handleManualCreditCard}
                onOpenFinancePress={handleOpenFinanceCreditCard}
            />
        </>
    );
};
