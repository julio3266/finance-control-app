import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { styles } from './styles';

// Tab Components
import { OverviewTab } from '../../components/OverviewTab';
import { ExpensesTab } from '../../components/ExpensesTab';
import { InvestmentsTab } from '../../components/InvestmentsTab';
import { IncomeTab } from '../../components/IncomeTab';

// Configure Portuguese locale
LocaleConfig.locales['pt-BR'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-BR';

type TabType = 'overview' | 'expenses' | 'investments' | 'income';
type PeriodType = 'month' | 'quarter' | 'semester' | 'year' | 'custom';

const TABS: { key: TabType; label: string; icon: string }[] = [
    { key: 'overview', label: 'Visão Geral', icon: 'pie-chart' },
    { key: 'expenses', label: 'Gastos', icon: 'trending-down' },
    { key: 'investments', label: 'Investimentos', icon: 'trending-up' },
    { key: 'income', label: 'Receitas', icon: 'dollar-sign' },
];

const PERIOD_OPTIONS: { key: PeriodType; label: string }[] = [
    { key: 'month', label: 'Mês' },
    { key: 'quarter', label: 'Trimestre' },
    { key: 'semester', label: 'Semestre' },
    { key: 'year', label: 'Ano' },
    { key: 'custom', label: 'Personalizado' },
];

export default function ReportsScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const styled = styles(theme);

    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [periodType, setPeriodType] = useState<PeriodType>('month');
    const [showPeriodModal, setShowPeriodModal] = useState(false);

    const [showCustomPeriodModal, setShowCustomPeriodModal] = useState(false);
    const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
    const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
    const [tempStartDate, setTempStartDate] = useState<string | null>(null);
    const [tempEndDate, setTempEndDate] = useState<string | null>(null);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const handlePrevious = () => {
        setSelectedDate((prev) => {
            const newDate = new Date(prev);
            switch (periodType) {
                case 'month':
                    newDate.setMonth(newDate.getMonth() - 1);
                    break;
                case 'quarter':
                    newDate.setMonth(newDate.getMonth() - 3);
                    break;
                case 'semester':
                    newDate.setMonth(newDate.getMonth() - 6);
                    break;
                case 'year':
                    newDate.setFullYear(newDate.getFullYear() - 1);
                    break;
                default:
                    newDate.setMonth(newDate.getMonth() - 1);
            }
            return newDate;
        });
    };

    const handleNext = () => {
        setSelectedDate((prev) => {
            const newDate = new Date(prev);
            switch (periodType) {
                case 'month':
                    newDate.setMonth(newDate.getMonth() + 1);
                    break;
                case 'quarter':
                    newDate.setMonth(newDate.getMonth() + 3);
                    break;
                case 'semester':
                    newDate.setMonth(newDate.getMonth() + 6);
                    break;
                case 'year':
                    newDate.setFullYear(newDate.getFullYear() + 1);
                    break;
                default:
                    newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    const getQuarter = (date: Date) => {
        return Math.floor(date.getMonth() / 3) + 1;
    };

    const getSemester = (date: Date) => {
        return date.getMonth() < 6 ? 1 : 2;
    };

    const formatPeriod = (date: Date) => {
        switch (periodType) {
            case 'month':
                return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            case 'quarter':
                return `${getQuarter(date)}º Trimestre de ${date.getFullYear()}`;
            case 'semester':
                return `${getSemester(date)}º Semestre de ${date.getFullYear()}`;
            case 'year':
                return `Ano de ${date.getFullYear()}`;
            case 'custom':
                if (customStartDate && customEndDate) {
                    const startStr = customStartDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                    const endStr = customEndDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
                    return `${startStr} - ${endStr}`;
                }
                return 'Selecionar período';
            default:
                return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        }
    };

    const isCurrentPeriod = useMemo(() => {
        const now = new Date();
        switch (periodType) {
            case 'month':
                return (
                    selectedDate.getMonth() === now.getMonth() &&
                    selectedDate.getFullYear() === now.getFullYear()
                );
            case 'quarter':
                return (
                    getQuarter(selectedDate) === getQuarter(now) &&
                    selectedDate.getFullYear() === now.getFullYear()
                );
            case 'semester':
                return (
                    getSemester(selectedDate) === getSemester(now) &&
                    selectedDate.getFullYear() === now.getFullYear()
                );
            case 'year':
                return selectedDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    }, [selectedDate, periodType]);

    const handlePeriodSelect = (period: PeriodType) => {
        if (period === 'custom') {
            // Initialize temp dates
            setTempStartDate(null);
            setTempEndDate(null);
            setShowPeriodModal(false);
            setShowCustomPeriodModal(true);
        } else {
            setPeriodType(period);
            setShowPeriodModal(false);
            setSelectedDate(new Date());
        }
    };

    const handleCustomPeriodConfirm = () => {
        if (tempStartDate && tempEndDate) {
            const start = parseDate(tempStartDate);
            const end = parseDate(tempEndDate);

            if (start > end) {
                setCustomStartDate(end);
                setCustomEndDate(start);
            } else {
                setCustomStartDate(start);
                setCustomEndDate(end);
            }
            setPeriodType('custom');
        }
        setShowCustomPeriodModal(false);
    };

    const parseDate = (dateString: string): Date => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const handleDayPress = (day: { dateString: string }) => {
        if (!tempStartDate || (tempStartDate && tempEndDate)) {
            // First selection or reset
            setTempStartDate(day.dateString);
            setTempEndDate(null);
        } else {
            // Second selection
            const start = parseDate(tempStartDate);
            const end = parseDate(day.dateString);

            if (end < start) {
                setTempEndDate(tempStartDate);
                setTempStartDate(day.dateString);
            } else {
                setTempEndDate(day.dateString);
            }
        }
    };

    const formatDateToString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getMarkedDates = useMemo(() => {
        const marked: { [key: string]: any } = {};

        if (!tempStartDate) return marked;

        if (tempStartDate && !tempEndDate) {
            // Only start date selected
            marked[tempStartDate] = {
                selected: true,
                startingDay: true,
                endingDay: true,
                color: colors.primary[600],
                textColor: '#ffffff',
            };
        } else if (tempStartDate && tempEndDate) {
            // Both dates selected - mark the range
            const start = parseDate(tempStartDate);
            const end = parseDate(tempEndDate);

            let current = new Date(start);
            while (current <= end) {
                const dateStr = formatDateToString(current);
                const isStart = dateStr === tempStartDate;
                const isEnd = dateStr === tempEndDate;

                marked[dateStr] = {
                    selected: true,
                    startingDay: isStart,
                    endingDay: isEnd,
                    color: colors.primary[600],
                    textColor: '#ffffff',
                };

                current.setDate(current.getDate() + 1);
            }
        }

        return marked;
    }, [tempStartDate, tempEndDate]);

    const calendarTheme = useMemo(() => ({
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
        indicatorColor: colors.primary[600],
        textDayFontWeight: '400' as const,
        textMonthFontWeight: '700' as const,
        textDayHeaderFontWeight: '600' as const,
        textDayFontSize: 16,
        textMonthFontSize: 18,
        textDayHeaderFontSize: 14,
    }), [theme]);

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styled.backButton}>
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.headerTitle}>Relatórios</Text>
            <View style={styled.backButton} />
        </View>
    );

    const renderPeriodSelector = () => (
        <View style={styled.periodSelectorContainer}>
            {/* Period Type Selector */}
            <TouchableOpacity
                style={styled.periodTypeButton}
                onPress={() => setShowPeriodModal(true)}
                activeOpacity={0.7}
            >
                <Feather name="calendar" size={18} color={colors.primary[600]} />
                <Text style={styled.periodTypeText}>
                    {PERIOD_OPTIONS.find(p => p.key === periodType)?.label}
                </Text>
                <Feather name="chevron-down" size={18} color={theme.foregroundMuted} />
            </TouchableOpacity>

            {/* Period Navigation - Hide arrows for custom period */}
            <View style={styled.periodNavigation}>
                {periodType !== 'custom' && (
                    <TouchableOpacity onPress={handlePrevious} style={styled.periodArrow}>
                        <Feather name="chevron-left" size={24} color={theme.foreground} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={periodType === 'custom' ? () => setShowCustomPeriodModal(true) : undefined}
                    activeOpacity={periodType === 'custom' ? 0.7 : 1}
                    style={periodType === 'custom' ? styled.customPeriodButton : undefined}
                >
                    <Text style={styled.periodText}>{formatPeriod(selectedDate)}</Text>
                    {periodType === 'custom' && (
                        <Feather name="edit-2" size={14} color={colors.primary[600]} style={{ marginLeft: 8 }} />
                    )}
                </TouchableOpacity>
                {periodType !== 'custom' && (
                    <TouchableOpacity
                        onPress={handleNext}
                        style={styled.periodArrow}
                        disabled={isCurrentPeriod}
                    >
                        <Feather
                            name="chevron-right"
                            size={24}
                            color={isCurrentPeriod ? theme.foregroundMuted : theme.foreground}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderPeriodModal = () => (
        <Modal
            visible={showPeriodModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPeriodModal(false)}
        >
            <TouchableOpacity
                style={styled.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowPeriodModal(false)}
            >
                <View style={styled.modalContent}>
                    <Text style={styled.modalTitle}>Selecionar período</Text>
                    {PERIOD_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styled.modalOption,
                                periodType === option.key && styled.modalOptionActive,
                            ]}
                            onPress={() => handlePeriodSelect(option.key)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styled.modalOptionText,
                                    periodType === option.key && styled.modalOptionTextActive,
                                ]}
                            >
                                {option.label}
                            </Text>
                            {periodType === option.key && (
                                <Feather name="check" size={20} color={colors.primary[600]} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderDateEditorModal = () => null;

    const renderCustomPeriodModal = () => (
        <Modal
            visible={showCustomPeriodModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCustomPeriodModal(false)}
        >
            <View style={styled.modalOverlay}>
                <TouchableOpacity
                    style={styled.modalOverlayTouchable}
                    activeOpacity={1}
                    onPress={() => setShowCustomPeriodModal(false)}
                />
                <View style={styled.calendarModalContent}>
                    <View style={styled.calendarHeader}>
                        <Text style={styled.modalTitle}>Selecionar período</Text>
                        <TouchableOpacity onPress={() => setShowCustomPeriodModal(false)}>
                            <Feather name="x" size={24} color={theme.foreground} />
                        </TouchableOpacity>
                    </View>

                    {/* Selection Info */}
                    <View style={styled.dateRangeInfo}>
                        <View style={styled.dateRangeItem}>
                            <Text style={styled.dateRangeLabel}>Início</Text>
                            <Text style={styled.dateRangeValue}>
                                {tempStartDate
                                    ? parseDate(tempStartDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                                    : 'Selecione'}
                            </Text>
                        </View>
                        <Feather name="arrow-right" size={20} color={theme.foregroundMuted} />
                        <View style={styled.dateRangeItem}>
                            <Text style={styled.dateRangeLabel}>Fim</Text>
                            <Text style={styled.dateRangeValue}>
                                {tempEndDate
                                    ? parseDate(tempEndDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                                    : 'Selecione'}
                            </Text>
                        </View>
                    </View>

                    <Calendar
                        onDayPress={handleDayPress}
                        maxDate={formatDateToString(new Date())}
                        theme={calendarTheme}
                        markingType="period"
                        markedDates={getMarkedDates}
                        enableSwipeMonths
                    />

                    {/* Buttons */}
                    <View style={styled.customPeriodButtons}>
                        <TouchableOpacity
                            style={styled.customPeriodCancelButton}
                            onPress={() => {
                                setTempStartDate(null);
                                setTempEndDate(null);
                                setShowCustomPeriodModal(false);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styled.customPeriodCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styled.customPeriodConfirmButton,
                                (!tempStartDate || !tempEndDate) && styled.customPeriodConfirmButtonDisabled,
                            ]}
                            onPress={handleCustomPeriodConfirm}
                            activeOpacity={0.7}
                            disabled={!tempStartDate || !tempEndDate}
                        >
                            <Text style={styled.customPeriodConfirmText}>Aplicar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderTabs = () => (
        <View style={styled.tabsContainer}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styled.tabsContent}
            >
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styled.tab, activeTab === tab.key && styled.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={tab.icon as any}
                            size={18}
                            color={activeTab === tab.key ? '#ffffff' : theme.foregroundMuted}
                        />
                        <Text
                            style={[
                                styled.tabText,
                                activeTab === tab.key && styled.tabTextActive,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <OverviewTab
                        selectedMonth={selectedDate}
                        periodType={periodType}
                        customStartDate={customStartDate}
                        customEndDate={customEndDate}
                    />
                );
            case 'expenses':
                return (
                    <ExpensesTab
                        selectedMonth={selectedDate}
                        periodType={periodType}
                        customStartDate={customStartDate}
                        customEndDate={customEndDate}
                    />
                );
            case 'investments':
                return (
                    <InvestmentsTab
                        selectedMonth={selectedDate}
                        periodType={periodType}
                        customStartDate={customStartDate}
                        customEndDate={customEndDate}
                    />
                );
            case 'income':
                return (
                    <IncomeTab
                        selectedMonth={selectedDate}
                        periodType={periodType}
                        customStartDate={customStartDate}
                        customEndDate={customEndDate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <ScrollView
                style={styled.container}
                contentContainerStyle={styled.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.foreground}
                        colors={[colors.primary[600]]}
                    />
                }
            >
                {renderPeriodSelector()}
                {renderTabs()}
                {renderTabContent()}
            </ScrollView>
            {renderPeriodModal()}
            {renderCustomPeriodModal()}
            {renderDateEditorModal()}
        </ScreenWithHeader>
    );
}
