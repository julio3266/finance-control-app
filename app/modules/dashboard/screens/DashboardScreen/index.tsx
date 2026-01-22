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
import { fetchFinanceOverview } from '../../slices/financeApi';
import {
    CreditCardResponse,
    fetchCreditCards,
    fetchCardBrands,
} from '@app/modules/credit-card/slices/creditCardApi';
import { BalanceCard, SectionHeader, ConnectionItem, HomeHeader } from '../../components';
import { CardsList, type CreditCard } from '@app/modules/credit-card';
import {
    fetchConnections,
    type BankConnection,
} from '@app/modules/open-finance/slices/openFinanceApi';
import type { OverviewConnection } from '../../slices/financeApi';
import { styles } from './styles';

export default function DashboardScreen() {
    const theme = useTheme();
    const parentNavigation = useNavigation<NavigationProp<MainStackParamList>>();
    const dispatch = useAppDispatch();
    const styled = styles(theme);

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
    const connectionsFromOverviewRaw = useAppSelector(
        (state) => (state.finance as any).connections,
    );
    const connectionsFromOverview = useMemo(
        () => connectionsFromOverviewRaw || [],
        [connectionsFromOverviewRaw],
    );
    const openFinanceState = useAppSelector((state) => (state as any).openFinance);

    let connectionsFromOpenFinance: any[] = [];
    if (openFinanceState) {
        if (Array.isArray(openFinanceState.connections)) {
            connectionsFromOpenFinance = openFinanceState.connections;
        } else if (
            openFinanceState.connections &&
            typeof openFinanceState.connections === 'object' &&
            'connections' in openFinanceState.connections &&
            Array.isArray((openFinanceState.connections as any).connections)
        ) {
            connectionsFromOpenFinance = (openFinanceState.connections as any).connections;
        }
    }

    let finalConnectionsFromOpenFinance = connectionsFromOpenFinance;
    if (
        !Array.isArray(connectionsFromOpenFinance) &&
        connectionsFromOpenFinance &&
        typeof connectionsFromOpenFinance === 'object' &&
        'connections' in connectionsFromOpenFinance &&
        Array.isArray((connectionsFromOpenFinance as any).connections)
    ) {
        finalConnectionsFromOpenFinance = (connectionsFromOpenFinance as any).connections;
    }

    const connectionsRaw =
        connectionsFromOverview.length > 0
            ? connectionsFromOverview
            : finalConnectionsFromOpenFinance;
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setInitialLoading(true);
            try {
                const overviewResult = await dispatch(fetchFinanceOverview() as any).unwrap();
                await Promise.all([
                    dispatch(fetchCreditCards() as any).unwrap(),
                    dispatch(fetchCardBrands() as any).unwrap(),

                    ...((overviewResult?.connections?.length || 0) === 0
                        ? [dispatch(fetchConnections() as any).unwrap()]
                        : []),
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
            const overviewResult = await dispatch(fetchFinanceOverview() as any).unwrap();
            await Promise.all([
                dispatch(fetchCreditCards() as any).unwrap(),
                dispatch(fetchCardBrands() as any).unwrap(),

                ...((overviewResult?.connections?.length || 0) === 0
                    ? [dispatch(fetchConnections() as any).unwrap()]
                    : []),
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

    const connections = useMemo(() => {
        let connectionsArray: any[] = [];
        if (Array.isArray(connectionsRaw)) {
            connectionsArray = connectionsRaw;
        } else if (
            connectionsRaw &&
            typeof connectionsRaw === 'object' &&
            'connections' in connectionsRaw
        ) {
            connectionsArray = Array.isArray((connectionsRaw as any).connections)
                ? (connectionsRaw as any).connections
                : [];
        }
        return connectionsArray.map((conn) => {
            if ('institution' in conn && 'logo' in conn) {
                const overviewConn = conn as OverviewConnection;
                return {
                    id: overviewConn.id,
                    pluggyItemId: '',
                    connectorName: overviewConn.institution,
                    connectorLogo: overviewConn.logo,
                    status: overviewConn.status,
                    lastSyncAt: overviewConn.lastSyncAt,
                    bankAccounts: [],
                } as BankConnection;
            }

            return conn as BankConnection;
        });
    }, [connectionsRaw]);

    const renderConnection = ({ item }: { item: BankConnection }) => (
        <ConnectionItem connection={item} />
    );

    const activeConnections = useMemo(() => {
        const filtered = connections.filter((conn) => {
            const status = conn?.status?.toUpperCase()?.trim();
            const isActive = status === 'UPDATED' || status === 'PENDING';
            return isActive;
        });
        return filtered;
    }, [connections]);

    const ListHeaderComponent = () => (
        <View style={styled.listHeaderContainer}>
            <BalanceCard
                totalBalance={formatCurrency(balance)}
                income={formatCurrency(income)}
                expenses={formatCurrency(expenses)}
            />
            {activeConnections.length > 0 && (
                <SectionHeader title="Conexões ativas" showSeeAll={false} />
            )}
        </View>
    );

    const ListFooterComponent = () => (
        <View style={styled.listHeaderContainer}>
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
                data={activeConnections}
                renderItem={renderConnection}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                contentContainerStyle={styled.content}
                style={styled.container}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styled.emptyContainer}>
                        <Text style={styled.emptyText}>Nenhuma conexão ativa</Text>
                    </View>
                }
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
