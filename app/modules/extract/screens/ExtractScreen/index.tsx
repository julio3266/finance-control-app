import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SectionList, RefreshControl, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@app/navigation/DrawerNavigation';
import { useAppDispatch, useAppSelector } from '@app/store';

import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';
import { fetchUnifiedTransactions, FetchUnifiedTransactionsParams, setFilters } from '../../slices';
import type { UnifiedTransaction } from '../../slices/extractApi';
import { DateSectionHeader, ExtractHeader, UnifiedTransactionItem } from '@extract/components';

type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function ExtractScreen() {
    const theme = useTheme();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const parentNavigation = useNavigation<MainStackNavigationProp>();
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
    const [hasScrolled, setHasScrolled] = useState(false);

    const profile = useAppSelector((state) => state.profile.profile);
    const isPremium = profile?.isPremium ?? false;

    const extractState = useAppSelector((state) => (state as any).extract);
    const transactions = useMemo(() => {
        const trans = extractState?.transactions || [];
        const currentFilters = extractState?.filters;
        const bankAccountId = (currentFilters as any)?.bankAccountId;
        const accountId = currentFilters?.accountId;

        const filteredTransactions = trans.filter((t: any) => {
            if (bankAccountId) {
                return t.bankAccount?.id === bankAccountId;
            }
            if (accountId) {
                return t.account?.id === accountId;
            }
            return true;
        });


        return filteredTransactions;
    }, [extractState?.transactions, extractState?.filters]);
    const groupedByDate = extractState?.groupedByDate;
    const loading = extractState?.loading || false;
    const error = extractState?.error || null;
    const filters = useMemo(
        () => {
            const stateFilters = extractState?.filters || {
                type: 'all',
                status: 'all',
                page: 1,
                pageSize: 20,
            };
            const computedFilters = {
                ...stateFilters,
                accountId: stateFilters.accountId,
                bankAccountId: (stateFilters as any).bankAccountId,
                creditCardId: stateFilters.creditCardId,
            };
            return computedFilters;
        },
        [extractState?.filters],
    );
    const pagination = extractState?.pagination || null;


    const loadTransactions = useCallback(async () => {
        const params: FetchUnifiedTransactionsParams = {
            type: filters.type || 'all',
            status: filters.status || 'all',
            page: filters.page || 1,
        };

        if (filters.accountId) {
            params.accountId = filters.accountId;
        }

        if ((filters as any).bankAccountId) {
            params.bankAccountId = (filters as any).bankAccountId;
        }

        if (filters.creditCardId) {
            params.creditCardId = filters.creditCardId;
        }

        if (filters.startDate && filters.endDate) {
            params.startDate = filters.startDate;
            params.endDate = filters.endDate;
            params.pageSize = 0;
        } else {
            const month = selectedMonth.getMonth() + 1;
            const year = selectedMonth.getFullYear();
            params.month = month;
            params.year = year;
            params.pageSize = filters.pageSize || 20;
        }

        await dispatch(fetchUnifiedTransactions(params) as any);
    }, [dispatch, selectedMonth, filters]);
    const bankAccountId = (filters as any).bankAccountId;

    useEffect(() => {
        loadTransactions();
    }, [
        filters.accountId,
        bankAccountId,
        filters.creditCardId,
        filters.type,
        filters.status,
        filters.startDate,
        filters.endDate,
        filters.month,
        filters.year,
        loadTransactions,
    ]);
    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, [loadTransactions]),
    );

    useEffect(() => {
        if (filters.startDate && filters.endDate) {
            setHasScrolled(false);
            setVisibleMonth(null);
            initialLoadRef.current = true;
        }
    }, [filters.startDate, filters.endDate]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        dispatch(setFilters({ page: 1 }));
        await loadTransactions();
        setRefreshing(false);
    }, [dispatch, loadTransactions]);

    const handleFilterPress = () => {
        parentNavigation.navigate('Filter', { screen: 'Filter' } as any);
    };

    const handlePremiumPress = () => {
        parentNavigation.navigate('Subscription', { screen: 'Subscription' } as any);
    };

    const handleMonthChange = useCallback(
        (date: Date) => {
            setSelectedMonth(date);

            dispatch(
                setFilters({
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                    page: 1,
                }),
            );
        },
        [dispatch],
    );

    const handleLoadMore = useCallback(() => {
        if (filters.startDate && filters.endDate) {
            return;
        }

        if (!loading && pagination?.hasNextPage) {
            dispatch(
                setFilters({
                    ...filters,
                    page: (filters.page || 1) + 1,
                }),
            );
        }
    }, [loading, pagination, filters, dispatch]);

    const groupedTransactions = useMemo(() => {
        const hasDateRange = filters.startDate && filters.endDate;

        if (!hasDateRange) {
            return transactions.map((transaction: UnifiedTransaction) => ({
                title: '',
                data: [transaction],
            }));
        }

        if (groupedByDate && groupedByDate.length > 0) {
            const result = groupedByDate
                .map((item: { date: string; transactions: UnifiedTransaction[] }) => {
                    const [year, month, day] = item.date.split('-');
                    const dateKey = `${day}/${month}/${year}`;

                    const validTransactions = (item.transactions || []).filter(
                        (t: UnifiedTransaction) => t && t.id && t.date && t.description,
                    );

                    if (validTransactions.length === 0) {
                        return null;
                    }

                    const sortedTransactions = [...validTransactions].sort(
                        (a: UnifiedTransaction, b: UnifiedTransaction) => {
                            const timeA = new Date(a.date).getTime();
                            const timeB = new Date(b.date).getTime();
                            return timeB - timeA;
                        },
                    );

                    return {
                        title: dateKey,
                        data: sortedTransactions,
                    };
                })
                .filter(
                    (section: { title: string; data: UnifiedTransaction[] } | null): section is {
                        title: string;
                        data: UnifiedTransaction[];
                    } => section !== null && section.data.length > 0,
                )
                .sort((a: { title: string }, b: { title: string }) => {
                    const [dayA, monthA, yearA] = a.title.split('/').map(Number);
                    const [dayB, monthB, yearB] = b.title.split('/').map(Number);
                    const dateA = new Date(yearA, monthA - 1, dayA).getTime();
                    const dateB = new Date(yearB, monthB - 1, dayB).getTime();
                    return dateB - dateA;
                });

            return result;
        }

        const grouped: { [key: string]: UnifiedTransaction[] } = {};

        transactions.forEach((transaction: UnifiedTransaction) => {
            const date = new Date(transaction.date);
            const dateKey = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(transaction);
        });

        return Object.keys(grouped)
            .sort((a, b) => {
                const dateA = new Date(a.split('/').reverse().join('-'));
                const dateB = new Date(b.split('/').reverse().join('-'));
                return dateB.getTime() - dateA.getTime();
            })
            .map((dateKey) => {
                const sortedTransactions = [...grouped[dateKey]].sort((a, b) => {
                    const timeA = new Date(a.date).getTime();
                    const timeB = new Date(b.date).getTime();
                    return timeB - timeA;
                });
                return {
                    title: dateKey,
                    data: sortedTransactions,
                };
            });
    }, [transactions, filters.startDate, filters.endDate, groupedByDate]);

    const renderTransaction = useCallback(
        ({ item }: { item: UnifiedTransaction }) => <UnifiedTransactionItem transaction={item} />,
        [],
    );

    const renderSectionHeader = useCallback(
        ({ section }: { section: { title: string } }) => {
            if (!section.title) return null;
            return <DateSectionHeader date={section.title} />;
        },
        [],
    );

    const initialLoadRef = useRef(true);
    const handleViewableItemsChanged = useCallback(
        ({ viewableItems, changed }: { viewableItems: any[]; changed: any[] }) => {
            if (initialLoadRef.current) {
                initialLoadRef.current = false;
                setHasScrolled(false);
                setVisibleMonth(null);
                return;
            }

            if (changed.length > 0) {
                setHasScrolled(true);
            }

            if (viewableItems.length > 0 && filters.startDate && filters.endDate) {
                if (hasScrolled) {
                    const firstVisibleItem = viewableItems[0];
                    const section = firstVisibleItem?.section;
                    if (section?.title) {
                        const [day, month, year] = section.title.split('/').map(Number);
                        const date = new Date(year, month - 1, day);
                        setVisibleMonth(date);
                    }
                }
            } else if (!filters.startDate || !filters.endDate) {
                setVisibleMonth(null);
                setHasScrolled(false);
            }
        },
        [filters.startDate, filters.endDate, hasScrolled],
    );

    useEffect(() => {
        setHasScrolled(false);
        setVisibleMonth(null);
        initialLoadRef.current = true;
    }, [filters.startDate, filters.endDate]);

    useEffect(() => {
        if (filters.startDate && filters.endDate) {
            setHasScrolled(false);
            setVisibleMonth(null);
            initialLoadRef.current = true;
        }
    }, [filters.endDate, filters.startDate]);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 100,
    }).current;

    const renderEmpty = () => {
        if (loading && transactions.length === 0) {
            return (
                <View style={styled.emptyContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                </View>
            );
        }

        return (
            <View style={styled.emptyContainer}>
                <Feather name="inbox" size={48} color={theme.foregroundMuted} />
                <Text style={styled.emptyText}>
                    {error || 'Nenhuma transação encontrada para este período'}
                </Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (loading && transactions.length > 0) {
            return (
                <View style={styled.footerLoader}>
                    <ActivityIndicator size="small" color={colors.primary[600]} />
                </View>
            );
        }
        return null;
    };

    const isLoadingInitial = loading && transactions.length === 0 && !refreshing;

    const renderPremiumCard = () => (
        <View style={styled.premiumContainer}>
            <View style={styled.premiumCard}>
                <View style={styled.premiumIconContainer}>
                    <Feather name="zap" size={40} color={colors.primary[600]} />
                </View>
                <Text style={styled.premiumTitle}>
                    Desbloqueie o Extrato Completo
                </Text>
                <Text style={styled.premiumDescription}>
                    Tenha acesso ao histórico completo de todas as suas transações e muito mais.
                </Text>
                <View style={styled.premiumFeatures}>
                    <View style={styled.premiumFeatureItem}>
                        <View style={styled.premiumFeatureIcon}>
                            <Feather name="check" size={14} color={colors.success[500]} />
                        </View>
                        <Text style={styled.premiumFeatureText}>
                            Extrato ilimitado de transações
                        </Text>
                    </View>
                    <View style={styled.premiumFeatureItem}>
                        <View style={styled.premiumFeatureIcon}>
                            <Feather name="check" size={14} color={colors.success[500]} />
                        </View>
                        <Text style={styled.premiumFeatureText}>
                            Filtros avançados por período
                        </Text>
                    </View>
                    <View style={styled.premiumFeatureItem}>
                        <View style={styled.premiumFeatureIcon}>
                            <Feather name="check" size={14} color={colors.success[500]} />
                        </View>
                        <Text style={styled.premiumFeatureText}>
                            Conexão com Open Finance
                        </Text>
                    </View>
                    <View style={styled.premiumFeatureItem}>
                        <View style={styled.premiumFeatureIcon}>
                            <Feather name="check" size={14} color={colors.success[500]} />
                        </View>
                        <Text style={styled.premiumFeatureText}>
                            Exportação de relatórios
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styled.premiumButton}
                    onPress={handlePremiumPress}
                    activeOpacity={0.8}
                >
                    <Text style={styled.premiumButtonText}>Assinar Premium</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (!isPremium) {
        return (
            <ScreenWithHeader
                customHeader={
                    <ExtractHeader
                        onRefresh={handleRefresh}
                        onFilterPress={handleFilterPress}
                        selectedMonth={selectedMonth}
                        onMonthChange={handleMonthChange}
                        dateRange={undefined}
                        visibleMonth={null}
                        hasScrolled={false}
                    />
                }
            >
                {renderPremiumCard()}
            </ScreenWithHeader>
        );
    }

    return (
        <ScreenWithHeader
            customHeader={
                <ExtractHeader
                    onRefresh={handleRefresh}
                    onFilterPress={handleFilterPress}
                    selectedMonth={selectedMonth}
                    onMonthChange={handleMonthChange}
                    dateRange={
                        filters.startDate && filters.endDate
                            ? {
                                start: new Date(filters.startDate),
                                end: new Date(filters.endDate),
                            }
                            : undefined
                    }
                    visibleMonth={visibleMonth}
                    hasScrolled={hasScrolled}
                />
            }
        >
            {isLoadingInitial && (
                <View style={[StyleSheet.absoluteFill, styled.loadingOverlay]}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                    <Text style={styled.loadingText}>Carregando transações...</Text>
                </View>
            )}
            <SectionList
                sections={groupedTransactions}
                renderItem={renderTransaction}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styled.content}
                style={styled.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={theme.foreground}
                        colors={[colors.primary[600]]}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                stickySectionHeadersEnabled={false}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
        </ScreenWithHeader>
    );
}
