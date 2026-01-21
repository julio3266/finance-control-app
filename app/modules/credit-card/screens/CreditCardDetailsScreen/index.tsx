import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { IHandles } from 'react-native-modalize/lib/options';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchCreditCardDetails, deleteCreditCard } from '../../slices/creditCardApi';
import { fetchCreditCards } from '../../slices/creditCardApi';
import { TransactionItem } from '@app/modules/dashboard/components';
import { CreditCardItem } from '../../components/CreditCardItem';
import { DeleteCardBottomSheet } from '../../components/DeleteCardBottomSheet';
import { styles } from './styles';

type CreditCardDetailsRouteParams = {
    cardId: string;
    bankName: string;
    brandIconUrl?: string | null;
    brandId?: string;
    currentBill: number;
    availableLimit: number;
    closingDay: number;
    dueDay: number;
    status: 'open' | 'closed';
};

export default function CreditCardDetailsScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();
    const route = useRoute<RouteProp<{ params: CreditCardDetailsRouteParams }, 'params'>>();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const {
        cardId,
        bankName,
        brandIconUrl,
        brandId,
        currentBill,
        availableLimit,
        closingDay,
        dueDay,
        status,
    } = route.params || {};

    const dispatch = useAppDispatch();
    const details = useAppSelector((state) => state.creditCard.details);
    const detailsLoading = useAppSelector((state) => state.creditCard.detailsLoading);
    const deleteLoading = useAppSelector((state) => state.creditCard.deleteLoading);

    const deleteModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const prevMonthRef = useRef({ month: currentMonth, year: currentYear });
    const slideDirection = useRef<'left' | 'right'>('right');

    const monthShortNames = [
        'jan.',
        'fev.',
        'mar.',
        'abr.',
        'mai.',
        'jun.',
        'jul.',
        'ago.',
        'set.',
        'out.',
        'nov.',
        'dez.',
    ];

    const closingDate = useMemo(
        () => new Date(currentYear, currentMonth, closingDay),
        [currentYear, currentMonth, closingDay],
    );

    const dueDate = useMemo(
        () => new Date(currentYear, currentMonth, dueDay),
        [currentYear, currentMonth, dueDay],
    );

    useEffect(() => {
        if (
            prevMonthRef.current.month !== currentMonth ||
            prevMonthRef.current.year !== currentYear
        ) {
            const prevDate = new Date(prevMonthRef.current.year, prevMonthRef.current.month, 1);
            const currentDate = new Date(currentYear, currentMonth, 1);
            const isNext = currentDate > prevDate;
            slideDirection.current = isNext ? 'right' : 'left';

            fadeAnim.setValue(0);
            slideAnim.setValue(isNext ? 50 : -50);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();

            prevMonthRef.current = { month: currentMonth, year: currentYear };
        }
    }, [currentMonth, currentYear, fadeAnim, slideAnim]);

    const animateMonthChange = (newDate: Date) => {
        const isNext = newDate > new Date(currentYear, currentMonth, 1);
        slideDirection.current = isNext ? 'right' : 'left';

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: isNext ? -50 : 50,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setSelectedDate(newDate);
        });
    };

    const handlePrevMonth = () => {
        animateMonthChange(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        animateMonthChange(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleMonthSelect = (monthOffset: number) => {
        animateMonthChange(new Date(currentYear, currentMonth + monthOffset, 1));
    };

    useEffect(() => {
        if (cardId) {
            dispatch(
                fetchCreditCardDetails({
                    cardId,
                    year: currentYear,
                }) as any,
            );
        }
    }, [cardId, currentYear, currentMonth, dispatch]);

    const currentPeriod = useMemo(() => {
        if (!details?.monthlyTransactions) return null;
        const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        return details.monthlyTransactions.find(
            (period: { month: string }) => period.month === monthKey,
        );
    }, [details, currentYear, currentMonth]);

    const handleDeletePress = () => {
        deleteModalRef.current?.open();
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteCreditCard(cardId) as any).unwrap();
            // Recarregar lista de cartões
            await dispatch(fetchCreditCards() as any);
            // Fechar modal
            deleteModalRef.current?.close();
            // Navegar de volta
            navigation.goBack();
        } catch (error) {
            // Erro será tratado pelo Redux
            deleteModalRef.current?.close();
        }
    };

    const handleDeleteCancel = () => {
        deleteModalRef.current?.close();
    };

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styled.headerButton}>
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.headerTitle}>Detalhes da Fatura</Text>
            <View style={styled.headerRight}>
                <TouchableOpacity style={styled.headerIconButton}>
                    <Feather name="search" size={20} color={theme.foreground} />
                </TouchableOpacity>
                <TouchableOpacity style={styled.headerIconButton}>
                    <Feather name="filter" size={20} color={theme.foreground} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styled.headerIconButton}
                    onPress={handleDeletePress}
                    disabled={deleteLoading}
                >
                    <Feather name="trash-2" size={20} color={colors.error[500]} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderBillSummary = () => {
        const totalInvoice = currentPeriod?.totalInvoice ?? currentBill;
        const totalExpenses = currentPeriod?.totalExpenses ?? currentBill;
        const totalPaid = currentPeriod?.totalPaid ?? 0;
        const periodClosingDate =
            currentPeriod?.closingDate ??
            closingDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const periodDueDate =
            currentPeriod?.dueDate ??
            dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        return (
            <View style={styled.billSummary}>
                {/* Miniatura do cartão */}
                <View style={styled.cardMiniature}>
                    <CreditCardItem
                        id={cardId}
                        bankName={bankName}
                        brandIconUrl={brandIconUrl}
                        brandId={brandId}
                        currentBill={currentBill}
                        availableLimit={availableLimit}
                        closingDate={periodClosingDate}
                        status={status}
                        fullWidth
                    />
                </View>
                <View style={styled.dateRow}>
                    <Text style={styled.dateLabel}>Fecha em {periodClosingDate}</Text>
                    <Text style={styled.dateLabel}>Vence em {periodDueDate}</Text>
                </View>
                <View style={styled.financialRow}>
                    <View style={styled.financialColumn}>
                        <Text style={styled.financialLabel}>Fatura</Text>
                        <Text style={styled.financialValue}>{formatCurrency(totalInvoice)}</Text>
                    </View>
                    <View style={styled.financialColumn}>
                        <Text style={styled.financialLabel}>Gastos</Text>
                        <Text style={[styled.financialValue, { color: colors.error[500] }]}>
                            {formatCurrency(totalExpenses)}
                        </Text>
                    </View>
                    <View style={styled.financialColumn}>
                        <Text style={styled.financialLabel}>Pago</Text>
                        <Text style={[styled.financialValue, { color: colors.success[500] }]}>
                            {formatCurrency(totalPaid)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderMonthNavigation = () => {
        const prevMonth = new Date(currentYear, currentMonth - 1, 1);
        const nextMonth = new Date(currentYear, currentMonth + 1, 1);

        return (
            <Animated.View
                style={[
                    styled.monthNavigation,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                <TouchableOpacity onPress={handlePrevMonth} style={styled.monthNavButton}>
                    <Feather name="chevron-left" size={20} color={theme.foreground} />
                </TouchableOpacity>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styled.monthScrollContent}
                >
                    <TouchableOpacity
                        onPress={() => handleMonthSelect(-1)}
                        style={[
                            styled.monthButton,
                            currentMonth === prevMonth.getMonth() && styled.monthButtonActive,
                        ]}
                    >
                        <Text
                            style={[
                                styled.monthText,
                                currentMonth === prevMonth.getMonth() && styled.monthTextActive,
                            ]}
                        >
                            {monthShortNames[prevMonth.getMonth()]} {prevMonth.getFullYear()}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styled.monthButton, styled.monthButtonActive]}>
                        <Text style={[styled.monthText, styled.monthTextActive]}>
                            {monthShortNames[currentMonth]} {currentYear}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleMonthSelect(1)}
                        style={[
                            styled.monthButton,
                            currentMonth === nextMonth.getMonth() && styled.monthButtonActive,
                        ]}
                    >
                        <Text
                            style={[
                                styled.monthText,
                                currentMonth === nextMonth.getMonth() && styled.monthTextActive,
                            ]}
                        >
                            {monthShortNames[nextMonth.getMonth()]} {nextMonth.getFullYear()}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity onPress={handleNextMonth} style={styled.monthNavButton}>
                    <Feather name="chevron-right" size={20} color={theme.foreground} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const formatTransactionDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (transactionDate.getTime() === today.getTime()) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (transactionDate.getTime() === yesterday.getTime()) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        }
    };

    const renderTransaction = ({
        item,
    }: {
        item: {
            id: string;
            description: string;
            amount: number;
            date: string;
            isPaid: boolean;
            category: { id: string; name: string; icon: string; color: string };
        };
    }) => {
        const formattedDate = formatTransactionDate(item.date);
        const formattedAmount = formatCurrency(item.amount);
        const categoryIcon = item.category?.icon || '💸';
        const iconElement = <Text style={{ fontSize: 16 }}>{categoryIcon}</Text>;

        return (
            <TransactionItem
                description={item.description}
                date={formattedDate}
                amount={formattedAmount}
                type="expense"
                icon={iconElement}
            />
        );
    };

    const renderTransactionsList = () => {
        if (detailsLoading) {
            return (
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            );
        }

        if (
            !currentPeriod ||
            !currentPeriod.transactions ||
            currentPeriod.transactions.length === 0
        ) {
            return (
                <View style={styled.emptyContainer}>
                    <Feather name="inbox" size={48} color={theme.foregroundMuted} />
                    <Text style={styled.emptyText}>Nenhum resultado encontrado</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={currentPeriod.transactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styled.transactionsList}
            />
        );
    };

    return (
        <>
            <ScreenWithHeader customHeader={renderHeader()}>
                <ScrollView
                    style={styled.container}
                    contentContainerStyle={[styled.content, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {renderBillSummary()}
                    {renderMonthNavigation()}
                    {renderTransactionsList()}
                </ScrollView>
            </ScreenWithHeader>

            <DeleteCardBottomSheet
                modalizeRef={deleteModalRef}
                cardName={bankName}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                isLoading={deleteLoading}
            />
        </>
    );
}
