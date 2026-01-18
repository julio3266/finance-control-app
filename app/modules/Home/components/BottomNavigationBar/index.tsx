import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { styles } from './styles';
import { FabMenu } from '../FabMenu';

type TabType = 'Dashboard' | 'Extract' | 'Investiments' | 'More';

interface BottomNavigationBarProps extends BottomTabBarProps {}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
    state,
    descriptors,
    navigation,
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
    const fabRotation = useRef(new Animated.Value(0)).current;

    const currentActiveTab = (state.routes[state.index]?.name as TabType) || 'Dashboard';

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
        navigation.navigate('Incomes');
    };

    const handleExpensePress = () => {
        navigation.navigate('Expenses');
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
            label: 'Dashboard',
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
            label: 'Mais',
            iconComponent: Feather,
            iconName: 'more-horizontal',
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
        const { options } = descriptors[route.key];
        const isActive = state.index === index;
        const config = tabConfig[route.name];

        if (!config) return null;

        const handlePress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isActive && !event.defaultPrevented) {
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
            />
        </>
    );
};
