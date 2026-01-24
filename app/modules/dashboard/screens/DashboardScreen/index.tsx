import React, { useMemo, useEffect, useState } from 'react';
import { Text, View, RefreshControl, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppSelector, useAppDispatch } from '@app/store';
import { toggleHideValues } from '@app/store/themeSlice';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '@app/navigation/DrawerNavigation';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { formatCurrencyWithHide } from '@app/utils/formatCurrency';
import { fetchFinanceOverview } from '../../slices/financeApi';
import {
    CreditCardResponse,
    fetchCreditCards,
    fetchCardBrands,
} from '@app/modules/credit-card/slices/creditCardApi';
import { BalanceCard, SectionHeader, AccountsCard, HomeHeader } from '../../components';
import type { UnifiedAccount } from '../../components';
import { CardsList, type CreditCard } from '@app/modules/credit-card';
import { GoalsList } from '@app/modules/goals';
import { fetchGoals } from '@app/modules/goals/slices';
import { fetchUnifiedAccounts, type UnifiedAccountResponse } from '@app/modules/accounts';
import { fetchUserProfile } from '@app/modules/profile/slices/profileApi';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';

export default function DashboardScreen() {
    const theme = useTheme();
    const parentNavigation = useNavigation<NavigationProp<MainStackParamList>>();
    const dispatch = useAppDispatch();
    const styled = styles(theme);
    const profile = useAppSelector((state) => state.profile.profile);
    const profileLoading = useAppSelector((state) => state.profile.loading);
    const isPremium = profile?.isPremium;
    const balance = useAppSelector((state) => state.finance.balance);
    const income = useAppSelector((state) => state.finance.income);
    const expenses = useAppSelector((state) => state.finance.expenses);
    const creditCardsFromOverviewRaw = useAppSelector(
        (state) => (state.finance as any).creditCards?.cards,
    );
    const creditCardsFromOverview = useMemo(
        () => creditCardsFromOverviewRaw || [],
        [creditCardsFromOverviewRaw],
    );
    const creditCardsFromApi = useAppSelector((state) => state.creditCard.cards);
    const creditCardsResponse =
        creditCardsFromOverview.length > 0 ? creditCardsFromOverview : creditCardsFromApi;
    const cardBrands = useAppSelector((state) => state.creditCard.brands);
    const goals = useAppSelector((state) => (state as any).goals.goals || []);
    const unifiedAccountsRaw = useAppSelector((state) => (state as any).accounts?.unifiedAccounts || []);
    const hideValues = useAppSelector((state) => state.theme.hideValues);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const handleToggleHideValues = () => {
        dispatch(toggleHideValues());
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setInitialLoading(true);
            try {
                await dispatch(fetchFinanceOverview() as any).unwrap();
                await Promise.all([
                    dispatch(fetchCreditCards() as any).unwrap(),
                    dispatch(fetchCardBrands() as any).unwrap(),
                    dispatch(fetchGoals() as any).unwrap(),
                    dispatch(fetchUnifiedAccounts() as any).unwrap(),
                    ...(!profile && !profileLoading ? [dispatch(fetchUserProfile() as any).unwrap()] : []),
                ]);
            } catch (err) {
            } finally {
                setInitialLoading(false);
            }
        };

        loadInitialData();
    }, [dispatch, profile, profileLoading]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchFinanceOverview() as any).unwrap();
            await Promise.all([
                dispatch(fetchCreditCards() as any).unwrap(),
                dispatch(fetchCardBrands() as any).unwrap(),
                dispatch(fetchGoals() as any).unwrap(),
                dispatch(fetchUnifiedAccounts() as any).unwrap(),
                dispatch(fetchUserProfile() as any).unwrap(),
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

    const handleAddGoal = () => {
        (parentNavigation as any).navigate('Goals', { screen: 'NewGoal' });
    };

    const handleSeeAllGoals = () => {
        (parentNavigation as any).navigate('Goals', { screen: 'GoalsList' });
    };

    const handleGoalPress = (goal: any) => {
        (parentNavigation as any).navigate('Goals', {
            screen: 'NewGoal',
            params: { goalId: goal.id },
        });
    };

    const unifiedAccounts: UnifiedAccount[] = useMemo(() => {
        return unifiedAccountsRaw
            .filter((acc: UnifiedAccountResponse) => acc.type !== 'CREDIT')
            .map((acc: UnifiedAccountResponse) => ({
                id: acc.id,
                name: acc.name,
                institution: acc.institution || acc.name,
                institutionLogo: acc.institutionLogo,
                balance: String(acc.currentBalance ?? acc.balance ?? 0),
                type: acc.type,
                source: acc.source === 'open_finance' ? 'openFinance' : 'manual',
                color: acc.color,
            }));
    }, [unifiedAccountsRaw]);

    const handleAccountPress = (account: UnifiedAccount) => {
        (parentNavigation as any).navigate('Accounts', {
            screen: 'AccountDetails',
            params: { accountId: account.id, source: account.source },
        });
    };

    const handleAddAccount = () => {
        (parentNavigation as any).navigate('Accounts', { screen: 'NewAccount' });
    };

    const handleSeeAllAccounts = () => {
        (parentNavigation as any).navigate('Accounts', { screen: 'AccountsList' });
    };

    const handlePremiumPress = () => {
        (parentNavigation as any).navigate('Subscription', { screen: 'Subscription' });
    };

    const handleOpenFinancePress = () => {
        (parentNavigation as any).navigate('OpenFinance', { screen: 'ConnectAccounts' });
    };

    const renderPremiumCard = () => {
        if (profileLoading) return null;

        if (isPremium) {
            return (
                <TouchableOpacity
                    style={styled.premiumCard}
                    onPress={handleOpenFinancePress}
                    activeOpacity={0.8}
                >
                    <View style={styled.premiumCardContent}>
                        <View style={styled.premiumIconContainer}>
                            <Feather name="zap" size={24} color={colors.primary[600]} />
                        </View>
                        <View style={styled.premiumTextContainer}>
                            <Text style={styled.premiumTitle}>
                                Conecte suas contas bancárias
                            </Text>
                            <Text style={styled.premiumSubtitle}>
                                Sincronize suas transações automaticamente via Open Finance
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={styled.premiumCard}
                onPress={handlePremiumPress}
                activeOpacity={0.8}
            >
                <View style={styled.premiumCardContent}>
                    <View style={styled.premiumIconContainer}>
                        <Feather name="zap" size={24} color={colors.primary[600]} />
                    </View>
                    <View style={styled.premiumTextContainer}>
                        <Text style={styled.premiumTitle}>
                            Realize sua primeira conexão com Open Finance
                        </Text>
                        <Text style={styled.premiumSubtitle}>
                            Assine o Premium e conecte suas contas bancárias automaticamente
                        </Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                </View>
            </TouchableOpacity>
        );
    };

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
            <ScrollView
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
            >
                <BalanceCard
                    totalBalance={formatCurrencyWithHide(balance, hideValues)}
                    income={formatCurrencyWithHide(income, hideValues)}
                    expenses={formatCurrencyWithHide(expenses, hideValues)}
                    hideValues={hideValues}
                    onToggleHideValues={handleToggleHideValues}
                />
                {renderPremiumCard()}
                <SectionHeader
                    title="Minhas contas"
                    showSeeAll={unifiedAccounts.length > 1}
                    onSeeAllPress={handleSeeAllAccounts}
                />
                <AccountsCard
                    accounts={unifiedAccounts}
                    onAccountPress={handleAccountPress}
                    onAddAccount={handleAddAccount}
                    maxItems={5}
                    hideValues={hideValues}
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
                <SectionHeader
                    title="Minhas metas"
                    showSeeAll={goals.length > 1}
                    onSeeAllPress={handleSeeAllGoals}
                />
                <GoalsList
                    goals={goals}
                    onAddGoal={handleAddGoal}
                    onGoalPress={handleGoalPress}
                />
            </ScrollView>
        </ScreenWithHeader>
    );
}
