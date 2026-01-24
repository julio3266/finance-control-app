import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { useAppSelector, useAppDispatch } from '@app/store';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import {
    fetchIncome,
    type IncomeViewMode,
    type IncomeCategoryResponse,
    type IncomeSourceResponse,
    type IncomeEvolutionResponse,
} from '../../slices/reportsApi';

type PeriodType = 'month' | 'quarter' | 'semester' | 'year' | 'custom';

interface IncomeTabProps {
    selectedMonth: Date;
    periodType?: PeriodType;
    customStartDate?: Date | null;
    customEndDate?: Date | null;
}

export const IncomeTab: React.FC<IncomeTabProps> = ({
    selectedMonth,
    periodType = 'month',
    customStartDate,
    customEndDate,
}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [viewMode, setViewMode] = useState<IncomeViewMode>('category');

    const { income, incomeLoading, incomeError } = useAppSelector((state) => state.reports);

    // Fetch data when period or view mode changes
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

        dispatch(fetchIncome(params as any));
    }, [dispatch, selectedMonth, periodType, customStartDate, customEndDate, viewMode]);

    // Type guards for response types
    const isCategoryResponse = (data: any): data is IncomeCategoryResponse => {
        return data && 'distribution' in data && viewMode === 'category';
    };

    const isSourceResponse = (data: any): data is IncomeSourceResponse => {
        return data && 'distribution' in data && viewMode === 'source';
    };

    const isEvolutionResponse = (data: any): data is IncomeEvolutionResponse => {
        return data && 'evolution' in data;
    };

    const totalIncome = income?.totalIncome ?? 0;
    const monthlyAverage = income?.monthlyAverage ?? 0;

    // Get distribution data (works for both category and source views)
    const distribution = useMemo(() => {
        const data = (isCategoryResponse(income) || isSourceResponse(income))
            ? income.distribution
            : [];
        return [...data]
            .map(item => ({
                ...item,
                amount: item.amount ?? item.total ?? item.value ?? 0,
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [income, viewMode]);

    // Get evolution data
    const evolution = isEvolutionResponse(income) ? income.evolution : [];

    // Calculate max value for chart scaling
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
        summaryGrid: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 20,
        },
        summaryCard: {
            flex: 1,
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
        },
        summaryLabel: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        summaryValue: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.success[500],
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
        barChartContainer: {
            height: 200,
        },
        barChartPlaceholder: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            height: 150,
            width: '100%',
            paddingHorizontal: 10,
        },
        barWrapper: {
            alignItems: 'center',
            flex: 1,
        },
        bar: {
            width: 30,
            backgroundColor: colors.success[500],
            borderRadius: 4,
            marginBottom: 8,
        },
        barLabel: {
            fontSize: 11,
            color: theme.foregroundMuted,
        },
        statsCard: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        statsRowLast: {
            borderBottomWidth: 0,
        },
        statsLabel: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        statsValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },
        positiveChange: {
            color: colors.success[500],
        },
        negativeChange: {
            color: colors.error[500],
        },
        sourceCard: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        sourceLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        sourceIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        sourceName: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.foreground,
        },
        sourceSubtitle: {
            fontSize: 13,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        sourceRight: {
            alignItems: 'flex-end',
        },
        sourceAmount: {
            fontSize: 16,
            fontWeight: '700',
            color: colors.success[500],
        },
        sourceChange: {
            fontSize: 12,
            marginTop: 2,
        },
        tipsCard: {
            backgroundColor: colors.success[500] + '15',
            borderRadius: 16,
            padding: 20,
            borderLeftWidth: 4,
            borderLeftColor: colors.success[500],
        },
        tipsTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.success[600],
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
    });

    const renderCategoryView = () => (
        <>
            {/* Categories List */}
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Receitas por Categoria</Text>
                <View style={styles.legendContainer}>
                    {distribution.length > 0 ? (
                        distribution.map((category, index) => (
                            <View
                                key={category.id}
                                style={[
                                    styles.legendItem,
                                    index === distribution.length - 1 && styles.legendItemLast,
                                ]}
                            >
                                <View style={styles.legendLeft}>
                                    <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                                    <Text style={styles.legendIcon}>{category.icon}</Text>
                                    <Text style={styles.legendName}>{category.name}</Text>
                                </View>
                                <View style={styles.legendRight}>
                                    <Text style={styles.legendAmount}>{formatCurrency(category.amount)}</Text>
                                    <Text style={styles.legendPercentage}>{category.percentage}%</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Feather name="pie-chart" size={48} color={theme.foregroundMuted} />
                            <Text style={styles.emptyStateText}>
                                Nenhuma receita registrada neste período
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </>
    );

    const renderSourceView = () => (
        <>
            {distribution.length > 0 ? (
                <>
                    {distribution.map((source) => (
                        <View key={source.id} style={styles.sourceCard}>
                            <View style={styles.sourceLeft}>
                                <View style={[styles.sourceIcon, { backgroundColor: source.color + '20' }]}>
                                    <Text style={{ fontSize: 24 }}>{source.icon}</Text>
                                </View>
                                <View>
                                    <Text style={styles.sourceName}>{source.name}</Text>
                                    <Text style={styles.sourceSubtitle}>{source.percentage}% do total</Text>
                                </View>
                            </View>
                            <View style={styles.sourceRight}>
                                <Text style={styles.sourceAmount}>{formatCurrency(source.amount)}</Text>
                            </View>
                        </View>
                    ))}

                    <View style={styles.tipsCard}>
                        <Text style={styles.tipsTitle}>💡 Diversifique suas receitas</Text>
                        <Text style={styles.tipsText}>
                            Ter múltiplas fontes de renda é uma ótima estratégia para segurança financeira.
                            Considere criar uma renda passiva através de investimentos ou freelance.
                        </Text>
                    </View>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Feather name="dollar-sign" size={48} color={theme.foregroundMuted} />
                    <Text style={styles.emptyStateText}>
                        Nenhuma fonte de receita registrada
                    </Text>
                </View>
            )}
        </>
    );

    const renderEvolutionView = () => (
        <>
            {evolution.length > 0 ? (
                <>
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Evolução das Receitas</Text>
                        <View style={styles.barChartPlaceholder}>
                            {evolution.map((item, index) => {
                                const height = (item.value / maxEvolutionValue) * 120;
                                return (
                                    <View key={index} style={styles.barWrapper}>
                                        <View style={[styles.bar, { height: Math.max(height, 4) }]} />
                                        <Text style={styles.barLabel}>{item.month}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.statsCard}>
                        <Text style={styles.chartTitle}>Estatísticas</Text>
                        <View style={styles.statsRow}>
                            <Text style={styles.statsLabel}>Média mensal</Text>
                            <Text style={styles.statsValue}>{formatCurrency(monthlyAverage)}</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statsLabel}>Maior receita</Text>
                            <Text style={styles.statsValue}>
                                {formatCurrency(Math.max(...evolution.map(i => i.value)))}
                            </Text>
                        </View>
                        <View style={[styles.statsRow, styles.statsRowLast]}>
                            <Text style={styles.statsLabel}>Menor receita</Text>
                            <Text style={styles.statsValue}>
                                {formatCurrency(Math.min(...evolution.map(i => i.value)))}
                            </Text>
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Feather name="trending-up" size={48} color={theme.foregroundMuted} />
                    <Text style={styles.emptyStateText}>
                        Dados de evolução não disponíveis
                    </Text>
                </View>
            )}
        </>
    );

    if (incomeLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    if (incomeError) {
        return (
            <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={48} color={colors.error[500]} />
                <Text style={styles.errorText}>{incomeError}</Text>
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
                    style={[styles.viewToggleButton, viewMode === 'source' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('source')}
                >
                    <Text style={[styles.viewToggleText, viewMode === 'source' && styles.viewToggleTextActive]}>
                        Fonte
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewToggleButton, viewMode === 'evolution' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('evolution')}
                >
                    <Text style={[styles.viewToggleText, viewMode === 'evolution' && styles.viewToggleTextActive]}>
                        Evolução
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total de Receitas</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(totalIncome)}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Média Mensal</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(monthlyAverage)}</Text>
                </View>
            </View>

            {/* Content based on view mode */}
            {viewMode === 'category' && renderCategoryView()}
            {viewMode === 'source' && renderSourceView()}
            {viewMode === 'evolution' && renderEvolutionView()}
        </View>
    );
};
