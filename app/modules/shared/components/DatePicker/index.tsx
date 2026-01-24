import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

LocaleConfig.locales['pt'] = {
    monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';

interface DatePickerProps {
    modalizeRef: React.RefObject<IHandles>;
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    accentColor?: string;
}

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
    const [tempSelectedDate, setTempSelectedDate] = useState<string>(
        initialDate.toISOString().split('T')[0],
    );
    const [currentMonth, setCurrentMonth] = useState<string>(
        initialDate.toISOString().split('T')[0],
    );

    useEffect(() => {
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0];
            setTempSelectedDate(dateString);
            setCurrentMonth(dateString);
        }
    }, [selectedDate]);

    const markedDates = useMemo(() => {
        return {
            [tempSelectedDate]: {
                selected: true,
                selectedColor: accentColor,
            },
        };
    }, [tempSelectedDate, accentColor]);

    const handleDayPress = (day: { dateString: string }) => {
        setTempSelectedDate(day.dateString);
    };

    const handleConfirm = () => {
        const [year, month, day] = tempSelectedDate.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        onSelect(date);
        modalizeRef.current?.close();
    };

    const handleCancel = () => {
        if (selectedDate) {
            setTempSelectedDate(selectedDate.toISOString().split('T')[0]);
        }
        modalizeRef.current?.close();
    };

    const formatSelectedDate = (dateString: string) => {
        const [yearNum, monthNum, dayNum] = dateString.split('-').map(Number);
        const date = new Date(yearNum, monthNum - 1, dayNum);
        const weekdays = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        const months = [
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
        const weekday = weekdays[date.getDay()];
        const monthName = months[date.getMonth()];
        return `${weekday}, ${monthName} ${dayNum}`;
    };

    return (
        <Modalize
            ref={modalizeRef}
            adjustToContentHeight
            handlePosition="inside"
            HeaderComponent={
                <View style={[styled.header, { paddingTop: insets.top + 20 }]}>
                    <Text style={styled.selectedDateText}>
                        {formatSelectedDate(tempSelectedDate)}
                    </Text>
                </View>
            }
        >
            <View style={styled.container}>
                <Calendar
                    current={currentMonth}
                    minDate={new Date(2020, 0, 1).toISOString().split('T')[0]}
                    maxDate={new Date(2030, 11, 31).toISOString().split('T')[0]}
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    onMonthChange={(month: { month: number; year: number }) => {
                        const date = new Date(month.year, month.month - 1, 1);
                        setCurrentMonth(date.toISOString().split('T')[0]);
                    }}
                    enableSwipeMonths
                    theme={{
                        backgroundColor: theme.background,
                        calendarBackground: theme.background,
                        textSectionTitleColor: theme.foregroundMuted,
                        selectedDayBackgroundColor: accentColor,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: accentColor,
                        dayTextColor: theme.foreground,
                        textDisabledColor: theme.foregroundMuted,
                        dotColor: accentColor,
                        selectedDotColor: '#ffffff',
                        arrowColor: accentColor,
                        monthTextColor: theme.foreground,
                        textDayFontWeight: '500',
                        textMonthFontWeight: '600',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: 14,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 12,
                    }}
                    style={styled.calendar}
                />

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
