import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface FabMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onIncomePress: () => void;
    onExpensePress: () => void;
    onInvestmentPress: () => void;
    onCreditCardPress: () => void;
}

export const FabMenu: React.FC<FabMenuProps> = ({
    isOpen,
    onClose,
    onIncomePress,
    onExpensePress,
    onInvestmentPress,
    onCreditCardPress,
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const incomeTranslateY = useRef(new Animated.Value(0)).current;
    const expenseTranslateY = useRef(new Animated.Value(0)).current;
    const investmentTranslateY = useRef(new Animated.Value(0)).current;
    const creditCardTranslateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(expenseTranslateY, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                    delay: 50,
                }),
                Animated.spring(incomeTranslateY, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                    delay: 100,
                }),
                Animated.spring(investmentTranslateY, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                    delay: 150,
                }),
                Animated.spring(creditCardTranslateY, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 7,
                    delay: 200,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(incomeTranslateY, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(expenseTranslateY, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(investmentTranslateY, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(creditCardTranslateY, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [
        isOpen,
        scaleAnim,
        opacityAnim,
        incomeTranslateY,
        expenseTranslateY,
        investmentTranslateY,
        creditCardTranslateY,
    ]);

    const horizontalDistance = 70;
    const verticalOffset = -20;

    const incomeX = incomeTranslateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -horizontalDistance],
    });

    const incomeY = incomeTranslateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, verticalOffset],
    });

    const expenseX = expenseTranslateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, horizontalDistance],
    });

    const expenseY = expenseTranslateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, verticalOffset],
    });

    const incomeOpacity = incomeTranslateY.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const expenseOpacity = expenseTranslateY.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const investmentY = investmentTranslateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, verticalOffset - 60],
    });

    const investmentOpacity = investmentTranslateY.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const creditCardY = creditCardTranslateY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, verticalOffset + 30],
    });

    const creditCardOpacity = creditCardTranslateY.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            return undefined;
        } else {
            const timer = setTimeout(() => {
                if (!isOpen) {
                    setShouldRender(false);
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) {
        return null;
    }

    return (
        <>
            <Animated.View
                style={[
                    styled.overlay,
                    {
                        opacity: opacityAnim,
                    },
                ]}
                pointerEvents={isOpen ? 'auto' : 'none'}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            <View style={styled.menuContainer} pointerEvents="box-none">
                <Animated.View
                    style={[
                        styled.menuItem,
                        styled.menuItemLeft,
                        {
                            transform: [
                                { translateX: incomeX },
                                { translateY: incomeY },
                                { scale: scaleAnim },
                            ],
                            opacity: incomeOpacity,
                        },
                    ]}
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={styled.menuButton}
                        onPress={() => {
                            onClose();
                            onIncomePress();
                        }}
                        activeOpacity={0.8}
                    >
                        <View style={styled.iconWrapper}>
                            <FontAwesome6
                                name="arrow-trend-up"
                                size={24}
                                color={colors.success[500]}
                            />
                        </View>
                        <Text style={styled.menuText}>Receitas</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    style={[
                        styled.menuItem,
                        styled.menuItemRight,
                        {
                            transform: [
                                { translateX: expenseX },
                                { translateY: expenseY },
                                { scale: scaleAnim },
                            ],
                            opacity: expenseOpacity,
                        },
                    ]}
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={styled.menuButton}
                        onPress={() => {
                            onClose();
                            onExpensePress();
                        }}
                        activeOpacity={0.8}
                    >
                        <View style={styled.iconWrapper}>
                            <FontAwesome6
                                name="arrow-trend-down"
                                size={24}
                                color={colors.error[600]}
                            />
                        </View>
                        <Text style={styled.menuText}>Despesas</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    style={[
                        styled.menuItem,
                        styled.menuItemCenter,
                        {
                            transform: [{ translateY: investmentY }, { scale: scaleAnim }],
                            opacity: investmentOpacity,
                        },
                    ]}
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={styled.menuButton}
                        onPress={() => {
                            onClose();
                            onInvestmentPress();
                        }}
                        activeOpacity={0.8}
                    >
                        <View style={styled.iconWrapper}>
                            <FontAwesome6 name="chart-line" size={24} color={colors.primary[600]} />
                        </View>
                        <Text style={styled.menuText}>Investimento</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View
                    style={[
                        styled.menuItem,
                        styled.menuItemCenter,
                        {
                            transform: [{ translateY: creditCardY }, { scale: scaleAnim }],
                            opacity: creditCardOpacity,
                        },
                    ]}
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={styled.menuButton}
                        onPress={() => {
                            onClose();
                            onCreditCardPress();
                        }}
                        activeOpacity={0.8}
                    >
                        <View style={styled.iconWrapper}>
                            <FontAwesome6 name="credit-card" size={24} color="#9333EA" />
                        </View>
                        <Text style={styled.menuText}>Cartão</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </>
    );
};
