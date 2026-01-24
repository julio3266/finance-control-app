import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

interface ExtractHeaderProps {
    onRefresh?: () => void;
    onFilterPress?: () => void;
    selectedMonth?: Date;
    onMonthChange?: (date: Date) => void;
    dateRange?: { start: Date | null; end: Date | null };
    visibleMonth?: Date | null;
    hasScrolled?: boolean;
}

const MONTHS = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
];

export const ExtractHeader: React.FC<ExtractHeaderProps> = ({
    onRefresh,
    onFilterPress,
    selectedMonth = new Date(),
    onMonthChange,
    dateRange,
    visibleMonth,
    hasScrolled = false,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const [currentMonth, setCurrentMonth] = useState(selectedMonth);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const monthAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;

    useEffect(() => {
        setCurrentMonth(selectedMonth);
    }, [selectedMonth]);

    const animateMonthChange = (direction: 'left' | 'right', newDate: Date) => {
        const slideValue = direction === 'left' ? -50 : 50;

        Animated.parallel([
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: slideValue,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ]).start();

        setCurrentMonth(newDate);
        onMonthChange?.(newDate);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        animateMonthChange('right', newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        animateMonthChange('left', newDate);
    };

    const getVisibleMonths = () => {
        const months = [];
        const current = currentMonth.getMonth();
        const year = currentMonth.getFullYear();

        const prevMonth = current === 0 ? 11 : current - 1;
        const prevYear = current === 0 ? year - 1 : year;
        months.push({ month: prevMonth, year: prevYear });

        months.push({ month: current, year });

        const nextMonth = current === 11 ? 0 : current + 1;
        const nextYear = current === 11 ? year + 1 : year;
        months.push({ month: nextMonth, year: nextYear });

        return months;
    };

    const formatMonthYear = (month: number, year: number) => `${MONTHS[month]} ${year}`;

    const formatDateRange = () => {
        if (!dateRange?.start || !dateRange?.end) return '';
        const start = dateRange.start;
        const end = dateRange.end;
        const startStr = `${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
        const endStr = `${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
        return `${startStr} - ${endStr}`;
    };

    const getMonthsInRange = useCallback(() => {
        if (!dateRange?.start || !dateRange?.end) return [];
        const months: { month: number; year: number }[] = [];
        const start = new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), 1);
        const end = new Date(dateRange.end.getFullYear(), dateRange.end.getMonth(), 1);

        const current = new Date(start);
        while (current <= end) {
            months.push({
                month: current.getMonth(),
                year: current.getFullYear(),
            });
            current.setMonth(current.getMonth() + 1);
        }

        return months;
    }, [dateRange?.start, dateRange?.end]);

    const hasDateRange = dateRange?.start && dateRange?.end;


    useEffect(() => {
        if (hasScrolled && visibleMonth && hasDateRange) {
            const monthsInRange = getMonthsInRange();
            const index = monthsInRange.findIndex(
                ({ month, year }) =>
                    visibleMonth.getMonth() === month && visibleMonth.getFullYear() === year,
            );

            if (index !== -1) {

                const monthKey = `${visibleMonth.getMonth()}-${visibleMonth.getFullYear()}`;
                if (!monthAnimations.has(monthKey)) {
                    monthAnimations.set(monthKey, new Animated.Value(1));
                }


                monthAnimations.forEach((anim, key) => {
                    if (key !== monthKey) {
                        anim.setValue(1);
                    }
                });


                const animValue = monthAnimations.get(monthKey)!;
                Animated.sequence([
                    Animated.timing(animValue, {
                        toValue: 1.15,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animValue, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();


                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        x: index * 120,
                        animated: true,
                    });
                }, 100);
            }
        } else if (!hasScrolled) {

            monthAnimations.forEach((anim) => anim.setValue(1));
        }

    }, [visibleMonth, hasScrolled, hasDateRange, getMonthsInRange, monthAnimations]);

    return (
        <View style={[styled.container, { paddingTop: insets.top + 16 }]}>
            <View style={styled.topSection}>
                <View style={styled.titleContainer}>
                    <Text style={styled.title}>Extrato</Text>
                </View>
                <View style={styled.actionsContainer}>
                    <TouchableOpacity
                        onPress={onRefresh}
                        style={styled.iconButton}
                        activeOpacity={0.7}
                    >
                        <Feather name="refresh-cw" size={20} color={theme.foreground} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onFilterPress}
                        style={styled.iconButton}
                        activeOpacity={0.7}
                    >
                        <Feather name="filter" size={20} color={theme.foreground} />
                    </TouchableOpacity>
                </View>
            </View>
            {hasDateRange ? (
                <View style={styled.monthSelectorContainer}>
                    {hasScrolled && visibleMonth ? (

                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styled.monthScrollContent}
                            scrollEventThrottle={16}
                        >
                            {getMonthsInRange().map(({ month, year }) => {
                                const isVisible =
                                    visibleMonth &&
                                    visibleMonth.getMonth() === month &&
                                    visibleMonth.getFullYear() === year;
                                const monthKey = `${month}-${year}`;


                                if (!monthAnimations.has(monthKey)) {
                                    monthAnimations.set(monthKey, new Animated.Value(1));
                                }
                                const scaleAnim = monthAnimations.get(monthKey)!;

                                return (
                                    <Animated.View
                                        key={monthKey}
                                        style={[
                                            styled.monthItem,
                                            isVisible && styled.monthItemSelected,
                                            {
                                                transform: [{ scale: scaleAnim }],
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styled.monthText,
                                                isVisible && styled.monthTextSelected,
                                            ]}
                                        >
                                            {formatMonthYear(month, year)}
                                        </Text>
                                    </Animated.View>
                                );
                            })}
                        </ScrollView>
                    ) : (

                        <View style={styled.monthScrollContent}>
                            <View style={[styled.monthItem, styled.monthItemSelected]}>
                                <Text style={[styled.monthText, styled.monthTextSelected]}>
                                    {formatDateRange()}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styled.monthSelectorContainer}>
                    <TouchableOpacity
                        onPress={handlePrevMonth}
                        style={styled.monthNavButton}
                        activeOpacity={0.7}
                    >
                        <Feather name="chevron-left" size={20} color={theme.foreground} />
                    </TouchableOpacity>

                    <Animated.View
                        style={[
                            styled.monthScrollContent,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateX: slideAnim }],
                            },
                        ]}
                    >
                        {getVisibleMonths().map(({ month, year }, index) => {
                            const isSelected = index === 1;
                            return (
                                <View
                                    key={`${month}-${year}-${currentMonth.getTime()}`}
                                    style={[styled.monthItem, isSelected && styled.monthItemSelected]}
                                >
                                    <Text
                                        style={[
                                            styled.monthText,
                                            isSelected && styled.monthTextSelected,
                                        ]}
                                    >
                                        {formatMonthYear(month, year)}
                                    </Text>
                                </View>
                            );
                        })}
                    </Animated.View>

                    <TouchableOpacity
                        onPress={handleNextMonth}
                        style={styled.monthNavButton}
                        activeOpacity={0.7}
                    >
                        <Feather name="chevron-right" size={20} color={theme.foreground} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
