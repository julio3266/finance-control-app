import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { useAppSelector, useAppDispatch } from '@app/store';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import { fetchExpenses, type ExpensesViewMode } from '../../slices/reportsApi';

type PeriodType = 'month' | 'quarter' | 'semester' | 'year' | 'custom';

interface ExpensesTabProps {
    selectedMonth: Date;
    periodType?: PeriodType;
    customStartDate?: Date | null;
    customEndDate?: Date | null;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
    selectedMonth,
    periodType = 'month',
    customStartDate,
    customEndDate,
}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [viewMode, setViewMode] = useState<ExpensesViewMode>('category');

    const { expenses, expensesLoading, expensesError } = useAppSelector((state) => state.reports);

    useEffect(() => {
        const params: Record<string, string | number | undefined> = {
            view: viewMode,
        };

        if (periodType === 'custom' && customStartDate && customEndDate) {
            params.startDate = customStartDate.toISOString().split('T')[0];
            params.endDate = customEndDate.toISOString().split('T')[0];
        } else {
            params.month = selectedMonth.getMonth() + 1;
            params.year = selectedMonth.getFullYear();
        }

        dispatch(fetchExpenses(params as any));
    }, [dispatch, selectedMonth, periodType, customStartDate, customEndDate, viewMode]);

    const totalExpenses = expenses?.totalExpenses ?? 0;
    const distribution = expenses?.distribution ?? [];
    const evolution = expenses?.evolution ?? [];

    const sortedDistribution = useMemo(() => {
        return [...distribution]
            .map(item => ({
                ...item,
                total: item.total ?? item.value ?? 0,
            }))
            .sort((a, b) => b.total - a.total);
    }, [distribution]);
    const maxEvolutionValue = useMemo(() => {
        if (evolution.length === 0) return 1;
        return Math.max(...evolution.map(d => d.value), 1);
    }, [evolution]);

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        viewToggle: {
            flexDirection: 'row',
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
        },
        viewToggleButton: {
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 8,
        },
        viewToggleButtonActive: {
            backgroundColor: colors.primary[600],
        },
        viewToggleText: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.foregroundMuted,
        },
        viewToggleTextActive: {
            color: '#ffffff',
        },
        totalCard: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            alignItems: 'center',
        },
        totalLabel: {
            fontSize: 14,
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        totalValue: {
            fontSize: 32,
            fontWeight: '700',
            color: colors.error[500],
        },
        chartContainer: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
        },
        chartTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        pieChartPlaceholder: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
        },
        pieChartText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            marginTop: 12,
        },
        legendContainer: {
            marginTop: 16,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        legendItemLast: {
            borderBottomWidth: 0,
        },
        legendLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        legendColor: {
            width: 12,
            height: 12,
            borderRadius: 6,
        },
        legendIcon: {
            fontSize: 20,
        },
        legendName: {
            fontSize: 15,
            fontWeight: '500',
            color: theme.foreground,
        },
        legendRight: {
            alignItems: 'flex-end',
        },
        legendAmount: {
            fontSize: 15,
            fontWeight: '700',
            color: theme.foreground,
        },
        legendPercentage: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        cardExpensesContainer: {
            gap: 12,
        },
        cardExpenseItem: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        cardExpenseLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        cardExpenseIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.primary[600] + '20',
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardExpenseName: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.foreground,
        },
        cardExpenseSubtitle: {
            fontSize: 13,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        cardExpenseAmount: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.error[500],
        },
        emptyState: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
        },
        emptyStateText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            marginTop: 12,
            textAlign: 'center',
        },
        progressBarContainer: {
            marginTop: 8,
        },
        progressBarBackground: {
            height: 8,
            backgroundColor: theme.border,
            borderRadius: 4,
            overflow: 'hidden',
        },
        progressBarFill: {
            height: '100%',
            borderRadius: 4,
        },
        loadingContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
        },
        errorContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
        },
        errorText: {
            fontSize: 14,
            color: colors.error[500],
            textAlign: 'center',
            marginTop: 12,
        },
        barChartContainer: {
            height: 150,
            marginBottom: 16,
        },
        barChartContent: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            height: 120,
            paddingHorizontal: 10,
        },
        barWrapper: {
            alignItems: 'center',
            flex: 1,
        },
        bar: {
            width: 24,
            backgroundColor: colors.error[500],
            borderRadius: 4,
            marginBottom: 8,
        },
        barLabel: {
            fontSize: 10,
            color: theme.foregroundMuted,
        },
    });

    const renderCategoryView = () => (
        <>
            {evolution.length > 0 && (
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Evolução dos Gastos</Text>
                    <View style={styles.barChartContent}>
                        {evolution.map((item, index) => (
                            <View key={index} style={styles.barWrapper}>
                                <View
                                    style={[
                                        styles.bar,
                                        { height: Math.max((item.value / maxEvolutionValue) * 100, 4) }
                                    ]}
                                />
                                <Text style={styles.barLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Gastos por Categoria</Text>
                <View style={styles.legendContainer}>
                    {sortedDistribution.length > 0 ? (
                        sortedDistribution.map((category, index) => (
                            <View
                                key={category.id}
                                style={[
                                    styles.legendItem,
                                    index === sortedDistribution.length - 1 && styles.legendItemLast,
                                ]}
                            >
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                                    <Text style={styles.legendIcon}>{category.icon}</Text>
                                    <Text style={styles.legendName}>{category.name}</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Text style={styles.legendAmount}>{formatCurrency(category.total)}</Text>
                                    <Text style={styles.legendPercentage}>{category.percentage.toFixed(1)}%</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Feather name="pie-chart" size={48} color={theme.foregroundMuted} />
                            <Text style={styles.emptyStateText}>
                                Nenhum gasto registrado neste período
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </>
    );

    const renderCardView = () => (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Gastos por Cartão</Text>
            <View style={styles.legendContainer}>
                {sortedDistribution.length > 0 ? (
                    sortedDistribution.map((card, index) => (
                        <View
                            key={card.id}
                            style={[
                                styles.legendItem,
                                index === sortedDistribution.length - 1 && styles.legendItemLast,
                            ]}
                        >
                            <View style={styles.legendLeft}>
                                <View style={[styles.legendColor, { backgroundColor: card.color || colors.primary[600] }]} />
                                <Feather name="credit-card" size={20} color={theme.foregroundMuted} />
                                <Text style={styles.legendName}>{card.name}</Text>
                            </View>
                            <View style={styles.legendRight}>
                                <Text style={styles.legendAmount}>{formatCurrency(card.total)}</Text>
                                <Text style={styles.legendPercentage}>{card.percentage.toFixed(1)}%</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Feather name="credit-card" size={48} color={theme.foregroundMuted} />
                        <Text style={styles.emptyStateText}>
                            Nenhum gasto com cartão neste período
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    const renderAccountView = () => (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Gastos por Conta</Text>
            <View style={styles.legendContainer}>
                {sortedDistribution.length > 0 ? (
                    sortedDistribution.map((account, index) => (
                        <View
                            key={account.id}
                            style={[
                                styles.legendItem,
                                index === sortedDistribution.length - 1 && styles.legendItemLast,
                            ]}
                        >
                            <View style={styles.legendLeft}>
                                <View style={[styles.legendColor, { backgroundColor: account.color || colors.primary[600] }]} />
                                <Text style={styles.legendIcon}>{account.icon || '🏦'}</Text>
                                <Text style={styles.legendName}>{account.name}</Text>
                            </View>
                            <View style={styles.legendRight}>
                                <Text style={styles.legendAmount}>{formatCurrency(account.total)}</Text>
                                <Text style={styles.legendPercentage}>{account.percentage.toFixed(1)}%</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Feather name="list" size={48} color={theme.foregroundMuted} />
                        <Text style={styles.emptyStateText}>
                            Nenhum gasto por conta neste período
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    if (expensesLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    if (expensesError) {
        return (
            <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={48} color={colors.error[500]} />
                <Text style={styles.errorText}>{expensesError}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* View Toggle */}
            <View style={styles.viewToggle}>
                <TouchableOpacity
                    style={[styles.viewToggleButton, viewMode === 'category' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('category')}
                >
                    <Text style={[styles.viewToggleText, viewMode === 'category' && styles.viewToggleTextActive]}>
                        Categoria
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewToggleButton, viewMode === 'card' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('card')}
                >
                    <Text style={[styles.viewToggleText, viewMode === 'card' && styles.viewToggleTextActive]}>
                        Cartão
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewToggleButton, viewMode === 'account' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('account')}
                >
                    <Text style={[styles.viewToggleText, viewMode === 'account' && styles.viewToggleTextActive]}>
                        Conta
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Total Expenses */}
            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total de Gastos no Período</Text>
                <Text style={styles.totalValue}>{formatCurrency(totalExpenses)}</Text>
            </View>

            {/* Content based on view mode */}
            {viewMode === 'category' && renderCategoryView()}
            {viewMode === 'card' && renderCardView()}
            {viewMode === 'account' && renderAccountView()}
        </View>
    );
};
