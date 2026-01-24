import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { useAppSelector, useAppDispatch } from '@app/store';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import { fetchMonthlyOverview } from '../../slices/reportsApi';

type PeriodType = 'month' | 'quarter' | 'semester' | 'year' | 'custom';

interface OverviewTabProps {
    selectedMonth: Date;
    periodType?: PeriodType;
    customStartDate?: Date | null;
    customEndDate?: Date | null;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
    selectedMonth,
    periodType = 'month',
    customStartDate,
    customEndDate,
}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    // Get data from store
    const { overview, overviewLoading, overviewError } = useAppSelector((state) => state.reports);

    // Fetch data when period changes
    useEffect(() => {
        const params: Record<string, string | number | undefined> = {};

        if (periodType === 'custom' && customStartDate && customEndDate) {
            params.startDate = customStartDate.toISOString().split('T')[0];
            params.endDate = customEndDate.toISOString().split('T')[0];
        } else {
            params.month = selectedMonth.getMonth() + 1;
            params.year = selectedMonth.getFullYear();
        }

        dispatch(fetchMonthlyOverview(params));
    }, [dispatch, selectedMonth, periodType, customStartDate, customEndDate]);

    const income = overview?.summary?.income ?? 0;
    const expenses = overview?.summary?.expenses ?? 0;
    const netBalance = overview?.summary?.balance ?? (income - expenses);
    const savingsRate = overview?.summary?.savingsRate ?? 0;
    const totalBalance = overview?.summary?.totalBalance ?? 0;
    const financialTip = overview?.financialTip;
    const chartData = overview?.chart ?? [];

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        summaryCard: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
        },
        summaryTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        summaryRowLast: {
            borderBottomWidth: 0,
        },
        summaryLabel: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        summaryIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        summaryLabelText: {
            fontSize: 15,
            fontWeight: '500',
            color: theme.foreground,
        },
        summaryValue: {
            fontSize: 16,
            fontWeight: '700',
        },
        incomeValue: {
            color: colors.success[500],
        },
        expenseValue: {
            color: colors.error[500],
        },
        balanceValue: {
            color: theme.foreground,
        },
        metricsGrid: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 16,
        },
        metricCard: {
            flex: 1,
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
            alignItems: 'center',
        },
        metricIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
        },
        metricValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 4,
            textAlign: 'center',
        },
        metricLabel: {
            fontSize: 12,
            color: theme.foregroundMuted,
            textAlign: 'center',
        },
        chartTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
            marginBottom: 16,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        tipsCard: {
            backgroundColor: colors.primary[600] + '15',
            borderRadius: 16,
            padding: 20,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary[600],
        },
        tipsTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.primary[600],
            marginBottom: 8,
        },
        tipsText: {
            fontSize: 14,
            color: theme.foreground,
            lineHeight: 22,
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
        chartContent: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            height: 150,
            paddingHorizontal: 10,
        },
        chartBarGroup: {
            alignItems: 'center',
            flex: 1,
        },
        chartBarsWrapper: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 4,
        },
        chartBar: {
            width: 14,
            borderRadius: 4,
            marginBottom: 8,
        },
        chartLabel: {
            fontSize: 10,
            color: theme.foregroundMuted,
        },
        chartLegend: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 20,
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        legendDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
        },
        legendText: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        chartContainer: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
        },
    });

    const getDefaultTip = () => {
        if (savingsRate >= 30) {
            return '🎉 Excelente! Você está economizando mais de 30% da sua renda. Continue assim!';
        } else if (savingsRate >= 20) {
            return '👍 Bom trabalho! Você está economizando uma boa parte da sua renda.';
        } else if (savingsRate >= 10) {
            return '💡 Tente aumentar sua taxa de economia para pelo menos 20% para atingir suas metas mais rápido.';
        } else if (savingsRate > 0) {
            return '⚠️ Sua taxa de economia está baixa. Considere revisar seus gastos para economizar mais.';
        } else {
            return '🚨 Você está gastando mais do que ganha. É importante equilibrar seu orçamento.';
        }
    };

    const maxChartValue = useMemo(() => {
        if (chartData.length === 0) return 1;
        return Math.max(...chartData.flatMap(d => [d.income, d.expenses]), 1);
    }, [chartData]);

    if (overviewLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    if (overviewError) {
        return (
            <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={48} color={colors.error[500]} />
                <Text style={styles.errorText}>{overviewError}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumo do Período</Text>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryLabel}>
                        <View style={[styles.summaryIcon, { backgroundColor: colors.success[500] + '20' }]}>
                            <Feather name="arrow-up" size={20} color={colors.success[500]} />
                        </View>
                        <Text style={styles.summaryLabelText}>Receitas</Text>
                    </View>
                    <Text style={[styles.summaryValue, styles.incomeValue]}>
                        {formatCurrency(income)}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryLabel}>
                        <View style={[styles.summaryIcon, { backgroundColor: colors.error[500] + '20' }]}>
                            <Feather name="arrow-down" size={20} color={colors.error[500]} />
                        </View>
                        <Text style={styles.summaryLabelText}>Despesas</Text>
                    </View>
                    <Text style={[styles.summaryValue, styles.expenseValue]}>
                        {formatCurrency(expenses)}
                    </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                    <View style={styles.summaryLabel}>
                        <View style={[styles.summaryIcon, { backgroundColor: colors.primary[600] + '20' }]}>
                            <Feather name="trending-up" size={20} color={colors.primary[600]} />
                        </View>
                        <Text style={styles.summaryLabelText}>Saldo</Text>
                    </View>
                    <Text style={[styles.summaryValue, netBalance >= 0 ? styles.incomeValue : styles.expenseValue]}>
                        {formatCurrency(netBalance)}
                    </Text>
                </View>
            </View>

            <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                    <View style={[styles.metricIcon, { backgroundColor: colors.primary[600] + '20' }]}>
                        <Feather name="percent" size={24} color={colors.primary[600]} />
                    </View>
                    <Text style={styles.metricValue}>{savingsRate.toFixed(1)}%</Text>
                    <Text style={styles.metricLabel}>Taxa de Economia</Text>
                </View>
                <View style={styles.metricCard}>
                    <View style={[styles.metricIcon, { backgroundColor: colors.warning[500] + '20' }]}>
                        <Feather name="credit-card" size={24} color={colors.warning[500]} />
                    </View>
                    <Text style={styles.metricValue}>{formatCurrency(totalBalance)}</Text>
                    <Text style={styles.metricLabel}>Saldo Total</Text>
                </View>
            </View>
            {chartData.length > 0 && (
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Receitas vs Despesas</Text>
                    <View style={styles.chartContent}>
                        {chartData.map((item, index) => (
                            <View key={index} style={styles.chartBarGroup}>
                                <View style={styles.chartBarsWrapper}>
                                    <View
                                        style={[
                                            styles.chartBar,
                                            {
                                                height: Math.max((item.income / maxChartValue) * 120, 4),
                                                backgroundColor: colors.success[500],
                                            }
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.chartBar,
                                            {
                                                height: Math.max((item.expenses / maxChartValue) * 120, 4),
                                                backgroundColor: colors.error[500],
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.chartLabel}>{item.month}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.chartLegend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: colors.success[500] }]} />
                            <Text style={styles.legendText}>Receitas</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: colors.error[500] }]} />
                            <Text style={styles.legendText}>Despesas</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Tips */}
            <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>💡 Dica Financeira</Text>
                <Text style={styles.tipsText}>{financialTip || getDefaultTip()}</Text>
            </View>
        </View>
    );
};
