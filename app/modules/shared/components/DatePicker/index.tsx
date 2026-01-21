import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

interface DatePickerProps {
    modalizeRef: React.RefObject<IHandles>;
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    accentColor?: string;
}

const DAYS_OF_WEEK = ['Do', '2ª', '3ª', '4ª', '5ª', '6ª', 'Sá'];
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
const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export const DatePicker: React.FC<DatePickerProps> = ({
    modalizeRef,
    selectedDate,
    onSelect,
    accentColor = colors.primary[600],
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme, accentColor);

    const initialDate = selectedDate || new Date();
    const [currentDate, setCurrentDate] = useState<Date>(initialDate);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [tempSelectedDate, setTempSelectedDate] = useState<Date>(initialDate);

    useEffect(() => {
        if (selectedDate) {
            setCurrentDate(selectedDate);
            setTempSelectedDate(selectedDate);
        }
    }, [selectedDate]);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const yearOptions = useMemo(() => {
        const years = [];
        const startYear = currentYear - 10;
        const endYear = currentYear + 10;
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }
        return years;
    }, [currentYear]);

    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDayOfWeek = firstDayOfMonth.getDay();

        const days: (number | null)[] = [];

        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push(prevMonthLastDay - i);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        const totalDaysAdded = startingDayOfWeek + daysInMonth;
        const remainingDays = 42 - totalDaysAdded; // 42 = 6 semanas × 7 dias
        for (let day = 1; day <= remainingDays; day++) {
            days.push(day);
        }

        return days;
    }, [currentYear, currentMonth]);

    const isCurrentMonth = (day: number | null, index: number) => {
        if (day === null) return false;
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        return index >= startingDayOfWeek;
    };

    const isSelectedDate = (day: number | null) => {
        if (!tempSelectedDate || day === null) return false;
        return (
            day === tempSelectedDate.getDate() &&
            currentMonth === tempSelectedDate.getMonth() &&
            currentYear === tempSelectedDate.getFullYear()
        );
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleDaySelect = (day: number | null) => {
        if (day === null) return;
        const newDate = new Date(currentYear, currentMonth, day);
        setTempSelectedDate(newDate);
    };

    const handleYearSelect = (year: number) => {
        setCurrentDate(new Date(year, currentMonth, 1));
        setShowYearPicker(false);
    };

    const handleConfirm = () => {
        onSelect(tempSelectedDate);
        modalizeRef.current?.close();
    };

    const handleCancel = () => {
        setTempSelectedDate(selectedDate || new Date());
        modalizeRef.current?.close();
    };

    const formatSelectedDate = (date: Date) => {
        const weekday = WEEKDAYS[date.getDay()];
        const month = MONTHS[date.getMonth()];
        const day = date.getDate();
        return `${weekday}, ${month} ${day}`;
    };

    const isPrevMonthDay = (day: number | null, index: number) => {
        if (day === null) return false;
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        return index < startingDayOfWeek;
    };

    const isNextMonthDay = (day: number | null, index: number) => {
        if (day === null) return false;
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const startingDayOfWeek = firstDayOfMonth.getDay();
        const totalDays = startingDayOfWeek + daysInMonth;
        return index >= totalDays;
    };

    return (
        <Modalize
            ref={modalizeRef}
            modalHeight={600}
            handlePosition="inside"
            HeaderComponent={
                <View style={[styled.header, { paddingTop: insets.top + 20 }]}>
                    <TouchableOpacity
                        onPress={() => setShowYearPicker(!showYearPicker)}
                        style={styled.yearSelector}
                    >
                        <Text style={styled.yearText}>{currentYear}</Text>
                        <Feather
                            name={showYearPicker ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={accentColor}
                        />
                    </TouchableOpacity>
                    <Text style={styled.selectedDateText}>
                        {formatSelectedDate(tempSelectedDate)}
                    </Text>
                </View>
            }
        >
            <View style={styled.container}>
                {showYearPicker ? (
                    <ScrollView style={styled.yearList} showsVerticalScrollIndicator>
                        {yearOptions.map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={[
                                    styled.yearOption,
                                    year === currentYear && styled.yearOptionSelected,
                                ]}
                                onPress={() => handleYearSelect(year)}
                            >
                                <Text
                                    style={[
                                        styled.yearOptionText,
                                        year === currentYear && styled.yearOptionTextSelected,
                                    ]}
                                >
                                    {year}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                ) : (
                    <>
                        {/* Month Navigation */}
                        <View style={styled.monthNavigation}>
                            <TouchableOpacity
                                onPress={handlePrevMonth}
                                style={styled.monthNavButton}
                            >
                                <Feather name="chevron-left" size={20} color={theme.foreground} />
                            </TouchableOpacity>
                            <Text style={styled.monthText}>
                                {MONTHS[currentMonth]} {currentYear}
                            </Text>
                            <TouchableOpacity
                                onPress={handleNextMonth}
                                style={styled.monthNavButton}
                            >
                                <Feather name="chevron-right" size={20} color={theme.foreground} />
                            </TouchableOpacity>
                        </View>

                        {/* Days of Week */}
                        <View style={styled.daysOfWeek}>
                            {DAYS_OF_WEEK.map((day) => (
                                <Text key={day} style={styled.dayOfWeekText}>
                                    {day}
                                </Text>
                            ))}
                        </View>

                        {/* Calendar Grid */}
                        <View style={styled.calendarGrid}>
                            {calendarDays.map((day, index) => {
                                const isPrev = isPrevMonthDay(day, index);
                                const isNext = isNextMonthDay(day, index);
                                const isCurrent = isCurrentMonth(day, index);
                                const isSelected = isSelectedDate(day);

                                return (
                                    <TouchableOpacity
                                        key={`${day}-${index}`}
                                        style={[
                                            styled.calendarDay,
                                            isSelected && styled.calendarDaySelected,
                                        ]}
                                        onPress={() => handleDaySelect(day)}
                                        disabled={!isCurrent}
                                    >
                                        <Text
                                            style={[
                                                styled.calendarDayText,
                                                (isPrev || isNext) && styled.calendarDayTextMuted,
                                                isSelected && styled.calendarDayTextSelected,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}

                {/* Action Buttons */}
                <View style={styled.actions}>
                    <TouchableOpacity onPress={handleCancel} style={styled.cancelButton}>
                        <Text style={styled.cancelButtonText}>CANCELAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        style={[styled.confirmButton, { backgroundColor: accentColor }]}
                    >
                        <Text style={styled.confirmButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modalize>
    );
};
