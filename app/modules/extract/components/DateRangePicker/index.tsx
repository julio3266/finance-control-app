import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
    ],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt';

interface DateRangePickerProps {
    modalizeRef: React.RefObject<IHandles | null>;
    startDate: Date | null;
    endDate: Date | null;
    onDateRangeSelected: (start: Date | null, end: Date | null) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    modalizeRef,
    startDate,
    endDate,
    onDateRangeSelected,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const [selectedStart, setSelectedStart] = useState<string | null>(null);
    const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
    const [selectingStart, setSelectingStart] = useState(true);
    const [currentMonth, setCurrentMonth] = useState<string>(
        new Date().toISOString().split('T')[0],
    );
    const isClearingRef = useRef(false);

    const handleDayPress = useCallback(
        (day: { dateString: string }) => {
            // Navegar para o mês/ano da data selecionada
            setCurrentMonth(day.dateString);

            if (selectingStart) {
                setSelectedStart(day.dateString);
                setSelectedEnd(null);
                setSelectingStart(false);
            } else {
                if (day.dateString < (selectedStart || '')) {
                    // Se a data final for anterior à inicial, trocar
                    setSelectedEnd(selectedStart);
                    setSelectedStart(day.dateString);
                } else {
                    setSelectedEnd(day.dateString);
                }
                setSelectingStart(true);
            }
        },
        [selectingStart, selectedStart],
    );

    const handleClear = useCallback(() => {
        isClearingRef.current = true;
        setSelectedStart(null);
        setSelectedEnd(null);
        setSelectingStart(true);
        // Resetar para o mês atual
        setCurrentMonth(new Date().toISOString().split('T')[0]);
        onDateRangeSelected(null, null);
        modalizeRef.current?.close();
    }, [onDateRangeSelected, modalizeRef]);

    const handleApply = useCallback(() => {
        const start = selectedStart ? new Date(selectedStart) : null;
        const end = selectedEnd ? new Date(selectedEnd) : null;
        onDateRangeSelected(start, end);
        modalizeRef.current?.close();
    }, [selectedStart, selectedEnd, onDateRangeSelected, modalizeRef]);

    // Sincronizar estado interno com props apenas quando props mudarem de null para valor ou vice-versa
    useEffect(() => {
        // Se estamos limpando, não sincronizar
        if (isClearingRef.current) {
            isClearingRef.current = false;
            return;
        }

        if (startDate && endDate) {
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            // Só atualizar se for diferente do estado atual
            if (selectedStart !== startStr || selectedEnd !== endStr) {
                setSelectedStart(startStr);
                setSelectedEnd(endStr);
                setSelectingStart(true);
                setCurrentMonth(startStr);
            }
        } else if (!startDate && !endDate) {
            // Se não há datas nas props, garantir que o estado está limpo
            // Mas só limpar se realmente não houver datas nas props E o estado interno tiver valores
            if (selectedStart !== null || selectedEnd !== null) {
                setSelectedStart(null);
                setSelectedEnd(null);
                setSelectingStart(true);
                setCurrentMonth(new Date().toISOString().split('T')[0]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate]);

    const getMarkedDates = () => {
        const marked: any = {};

        if (selectedStart && selectedEnd) {
            // Marcar todas as datas entre start e end com a mesma cor
            const start = new Date(selectedStart);
            const end = new Date(selectedEnd);
            const current = new Date(start);

            while (current <= end) {
                const dateString = current.toISOString().split('T')[0];
                const isStart = dateString === selectedStart;
                const isEnd = dateString === selectedEnd;

                marked[dateString] = {
                    startingDay: isStart,
                    endingDay: isEnd,
                    color: colors.primary[600],
                    textColor: '#ffffff',
                };

                current.setDate(current.getDate() + 1);
            }
        } else if (selectedStart) {
            // Apenas data inicial selecionada
            marked[selectedStart] = {
                startingDay: true,
                color: colors.primary[600],
                textColor: '#ffffff',
            };
        }

        return marked;
    };

    // Sincronizar estado quando o modal abrir
    const handleModalOpen = useCallback(() => {
        if (startDate && endDate) {
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            setSelectedStart(startStr);
            setSelectedEnd(endStr);
            setSelectingStart(true);
            setCurrentMonth(startStr);
        } else {
            // Se não há datas nas props, garantir que o estado está limpo
            setSelectedStart(null);
            setSelectedEnd(null);
            setSelectingStart(true);
            setCurrentMonth(new Date().toISOString().split('T')[0]);
        }
    }, [startDate, endDate]);

    return (
        <Modalize
            ref={modalizeRef}
            modalHeight={600}
            handlePosition="inside"
            handleStyle={styled.handle}
            modalStyle={styled.modal}
            overlayStyle={styled.overlay}
            panGestureEnabled
            closeOnOverlayTap
            withOverlay
            disableScrollIfPossible
            onOpen={handleModalOpen}
        >
            <View style={[styled.content, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styled.header}>
                    <Text style={styled.title}>Selecionar Período</Text>
                    <TouchableOpacity onPress={handleClear} style={styled.clearButton}>
                        <Text style={styled.clearButtonText}>Limpar</Text>
                    </TouchableOpacity>
                </View>

                <Calendar
                    current={currentMonth}
                    minDate={new Date(2020, 0, 1).toISOString().split('T')[0]}
                    maxDate={new Date(2030, 11, 31).toISOString().split('T')[0]}
                    markingType="period"
                    markedDates={getMarkedDates()}
                    onDayPress={handleDayPress}
                    onMonthChange={(month: { month: number; year: number }) => {
                        // Atualizar o mês atual quando o usuário navegar manualmente
                        const date = new Date(month.year, month.month - 1, 1);
                        setCurrentMonth(date.toISOString().split('T')[0]);
                    }}
                    enableSwipeMonths
                    theme={{
                        backgroundColor: theme.background,
                        calendarBackground: theme.background,
                        textSectionTitleColor: theme.foregroundMuted,
                        selectedDayBackgroundColor: colors.primary[600],
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: colors.primary[600],
                        dayTextColor: theme.foreground,
                        textDisabledColor: theme.foregroundMuted,
                        dotColor: colors.primary[600],
                        selectedDotColor: '#ffffff',
                        arrowColor: colors.primary[600],
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

                <View style={styled.footer}>
                    <TouchableOpacity
                        onPress={() => modalizeRef.current?.close()}
                        style={[styled.button, styled.cancelButton]}
                    >
                        <Text style={styled.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleApply}
                        style={[styled.button, styled.applyButton]}
                    >
                        <Text style={styled.applyButtonText}>Aplicar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modalize>
    );
};

