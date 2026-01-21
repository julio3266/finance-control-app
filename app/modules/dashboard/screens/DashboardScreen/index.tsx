import React, { useMemo, useEffect, useState } from 'react';
import { Text, FlatList, View, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppSelector, useAppDispatch } from '@app/store';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '@app/navigation/DrawerNavigation';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { formatCurrency } from '@app/utils/formatCurrency';
import { fetchFinanceOverview, fetchRecentTransactions } from '../../slices/financeApi';
import {
    CreditCardResponse,
    fetchCreditCards,
    fetchCardBrands,
} from '@app/modules/credit-card/slices/creditCardApi';
import { BalanceCard, SectionHeader, TransactionItem, HomeHeader } from '../../components';
import { CardsList, type CreditCard } from '@app/modules/credit-card';
import { styles } from './styles';

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

export default function DashboardScreen() {
    const theme = useTheme();
    const parentNavigation = useNavigation<NavigationProp<MainStackParamList>>();
    const dispatch = useAppDispatch();
    const styled = styles(theme);

    const balance = useAppSelector((state) => state.finance.balance);
    const income = useAppSelector((state) => state.finance.income);
    const expenses = useAppSelector((state) => state.finance.expenses);
    const transactions = useAppSelector((state) => state.finance.transactions);
    const creditCardsResponse = useAppSelector((state) => state.creditCard.cards);
    const cardBrands = useAppSelector((state) => state.creditCard.brands);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setInitialLoading(true);
            try {
                await Promise.all([
                    dispatch(fetchFinanceOverview() as any).unwrap(),
                    dispatch(fetchRecentTransactions({ limit: 5 }) as any).unwrap(),
                    dispatch(fetchCreditCards() as any).unwrap(),
                    dispatch(fetchCardBrands() as any).unwrap(),
                ]);
            } catch (err) {
            } finally {
                setInitialLoading(false);
            }
        };

        loadInitialData();
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                dispatch(fetchFinanceOverview() as any).unwrap(),
                dispatch(fetchRecentTransactions({ limit: 5 }) as any).unwrap(),
                dispatch(fetchCreditCards() as any).unwrap(),
                dispatch(fetchCardBrands() as any).unwrap(),
            ]);
        } catch (err) {
        } finally {
            setRefreshing(false);
        }
    };

    const creditCards: CreditCard[] = useMemo(
        () =>
            creditCardsResponse
                .filter((card: CreditCardResponse) => card.isActive)
                .map((card: CreditCardResponse) => {
                    const currentDate = new Date();
                    let closingDate: Date;
                    let isOpen: boolean;
                    let closingDateString: string;

                    if (card.closingDay === null || card.closingDay === undefined) {
                        if (card.dueDay) {
                            const dueDate =
                                typeof card.dueDay === 'string'
                                    ? new Date(card.dueDay)
                                    : new Date(
                                          currentDate.getFullYear(),
                                          currentDate.getMonth(),
                                          card.dueDay,
                                      );
                            closingDate = new Date(dueDate);
                            closingDate.setDate(closingDate.getDate() - 20);
                        } else {
                            closingDate = new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                10,
                            );
                        }
                        isOpen = true;
                        closingDateString = closingDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                        });
                    } else {
                        const currentMonth = currentDate.getMonth();
                        const currentYear = currentDate.getFullYear();
                        closingDate = new Date(currentYear, currentMonth, card.closingDay);
                        isOpen = currentDate.getDate() <= card.closingDay;
                        closingDateString = closingDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                        });
                    }

                    const brand = cardBrands.find((b) => b.id === card.brand);
                    const brandIconUrl = brand?.iconUrl || null;

                    return {
                        id: card.id,
                        bankName: card.name,
                        brandIconUrl,
                        brandId: card.brand,
                        currentBill: card.usedLimit,
                        availableLimit: card.totalLimit - card.usedLimit,
                        closingDate: closingDateString,
                        status: isOpen ? 'open' : 'closed',
                    };
                }),
        [creditCardsResponse, cardBrands],
    );

    const handleAddCard = () => {
        (parentNavigation as any).navigate('CreditCard', { screen: 'NewCreditCard' });
    };

    const handleSeeAllCards = () => {
        (parentNavigation as any).navigate('CreditCard', { screen: 'CreditCards' });
    };

    const handleCardPress = (card: CreditCard) => {
        const cardResponse = creditCardsResponse.find((c: CreditCardResponse) => c.id === card.id);
        if (cardResponse) {
            (parentNavigation as any).navigate('CreditCard', {
                screen: 'CreditCardDetails',
                params: {
                    cardId: card.id,
                    bankName: card.bankName,
                    brandIconUrl: card.brandIconUrl,
                    brandId: card.brandId,
                    currentBill: card.currentBill,
                    availableLimit: card.availableLimit,
                    closingDay: cardResponse.closingDay,
                    dueDay: cardResponse.dueDay,
                    status: card.status,
                },
            });
        }
    };

    const formattedTransactions = useMemo(
        () =>
            transactions.map((transaction) => {
                const type: 'income' | 'expense' =
                    transaction.type === 'INCOME' ? 'income' : 'expense';
                const formattedDate = formatTransactionDate(transaction.date);
                const formattedAmount = formatCurrency(transaction.amount);

                const categoryIcon = transaction.category?.icon || '💸';
                const iconElement = <Text style={{ fontSize: 16 }}>{categoryIcon}</Text>;

                return {
                    id: transaction.id,
                    description: transaction.description,
                    date: formattedDate,
                    amount: formattedAmount,
                    type,
                    icon: iconElement,
                };
            }),
        [transactions],
    );

    const renderTransaction = ({ item }: { item: (typeof formattedTransactions)[0] }) => (
        <TransactionItem
            description={item.description}
            date={item.date}
            amount={item.amount}
            type={item.type}
            icon={item.icon}
        />
    );

    const ListHeaderComponent = () => (
        <View>
            <BalanceCard
                totalBalance={formatCurrency(balance)}
                income={formatCurrency(income)}
                expenses={formatCurrency(expenses)}
            />
            <SectionHeader
                title="Meus cartões"
                showSeeAll={creditCards.length > 1}
                onSeeAllPress={handleSeeAllCards}
            />
            <CardsList
                cards={creditCards}
                onAddCard={handleAddCard}
                onCardPress={handleCardPress}
            />
            {formattedTransactions.length > 0 && (
                <SectionHeader title="Transações" showSeeAll={formattedTransactions.length > 5} />
            )}
        </View>
    );

    if (initialLoading) {
        return (
            <ScreenWithHeader customHeader={<HomeHeader />}>
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            </ScreenWithHeader>
        );
    }

    return (
        <ScreenWithHeader customHeader={<HomeHeader />}>
            <FlatList
                data={formattedTransactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={styled.content}
                style={styled.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.foreground}
                        colors={[colors.primary[600]]}
                    />
                }
            />
        </ScreenWithHeader>
    );
}
