import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { useAppSelector, useAppDispatch } from '@app/store';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import {
    fetchInvestments,
    type InvestmentsViewMode,
    type InvestmentsAllocationResponse,
    type InvestmentsEvolutionResponse,
    type InvestmentsProfitabilityResponse,
} from '../../slices/reportsApi';

type PeriodType = 'month' | 'quarter' | 'semester' | 'year' | 'custom';

interface InvestmentsTabProps {
    selectedMonth: Date;
    periodType?: PeriodType;
    customStartDate?: Date | null;
    customEndDate?: Date | null;
}

export const InvestmentsTab: React.FC<InvestmentsTabProps> = ({
    selectedMonth,
    periodType = 'month',
    customStartDate,
    customEndDate,
}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [viewMode, setViewMode] = useState<InvestmentsViewMode>('allocation');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const { investments, investmentsLoading, investmentsError } = useAppSelector((state) => state.reports);

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

        dispatch(fetchInvestments(params as any));
    }, [dispatch, selectedMonth, periodType, customStartDate, customEndDate, viewMode]);

    // Type guards for response types
    const isAllocationResponse = (data: any): data is InvestmentsAllocationResponse => {
        return data && 'allocation' in data;
    };

    const isEvolutionResponse = (data: any): data is InvestmentsEvolutionResponse => {
        return data && 'evolution' in data;
    };

    const isProfitabilityResponse = (data: any): data is InvestmentsProfitabilityResponse => {
        return data && 'profitability' in data;
    };

    const totalInvested = investments?.totalInvested ?? 0;
    const totalCurrent = investments?.totalCurrent ?? 0;

    // Get monthlyReturn from API if available (allocation view)
    const apiMonthlyReturn = isAllocationResponse(investments) ? investments.monthlyReturn : null;
    const monthlyReturn = apiMonthlyReturn?.value ?? (totalCurrent - totalInvested);
    const monthlyReturnPercent = apiMonthlyReturn?.percentage ?? (totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0);

    // Default colors for categories
    const defaultColors = [
        '#8B5CF6', // Roxo
        '#3B82F6', // Azul
        '#10B981', // Verde
        '#F59E0B', // Laranja
        '#EF4444', // Vermelho
        '#EC4899', // Rosa
        '#14B8A6', // Teal
        '#6366F1', // Indigo
        '#84CC16', // Lima
        '#F97316', // Laranja escuro
    ];

    // Get allocation data and sort by value (highest first)
    const allocation = useMemo(() => {
        const data = isAllocationResponse(investments) ? investments.allocation : [];
        return [...data]
            .sort((a, b) => b.value - a.value)
            .map((category, index) => ({
                ...category,
                color: category.color || defaultColors[index % defaultColors.length],
                subcategories: category.subcategories
                    ? [...category.subcategories].sort((a, b) => b.value - a.value)
                    : undefined,
            }));
    }, [investments]);

    // Get evolution data
    const evolution = isEvolutionResponse(investments) ? investments.evolution : [];

    // Get profitability data
    const profitability = isProfitabilityResponse(investments) ? investments.profitability : [];

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
            fontSize: 12,
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
            color: theme.foreground,
        },
        returnValue: {
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
        categoryItem: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            marginBottom: 12,
            overflow: 'hidden',
        },
        categoryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
        },
        categoryLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flex: 1,
            marginRight: 12,
        },
        categoryColor: {
            width: 16,
            height: 16,
            borderRadius: 8,
        },
        categoryName: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.foreground,
            flexShrink: 1,
        },
        categoryRight: {
            alignItems: 'flex-end',
            flexDirection: 'row',
            gap: 12,
            flexShrink: 0,
        },
        categoryAmount: {
            fontSize: 15,
            fontWeight: '700',
            color: theme.foreground,
        },
        categoryPercentage: {
            fontSize: 13,
            color: theme.foregroundMuted,
            minWidth: 40,
            textAlign: 'right',
        },
        subcategoriesContainer: {
            backgroundColor: theme.background,
            padding: 16,
            paddingTop: 8,
        },
        subcategoryItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 8,
        },
        subcategoryName: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        subcategoryAmount: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
        },
        evolutionChart: {
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
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
            backgroundColor: colors.primary[600],
            borderRadius: 4,
            marginBottom: 8,
        },
        barLabel: {
            fontSize: 11,
            color: theme.foregroundMuted,
        },
        performanceCard: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
        },
        performanceRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        performanceRowLast: {
            borderBottomWidth: 0,
        },
        performanceLabel: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        performanceValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },
        positiveValue: {
            color: colors.success[500],
        },
        negativeValue: {
            color: colors.error[500],
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

    const renderAllocationView = () => (
        <>
            {/* Categories with expandable subcategories */}
            {allocation.length > 0 ? (
                allocation.map((category, categoryIndex) => {
                    const categoryKey = category.id || category.name || `category-${categoryIndex}`;
                    const isExpanded = expandedCategory === categoryKey;

                    return (
                        <View key={categoryKey} style={styles.categoryItem}>
                            <TouchableOpacity
                                style={styles.categoryHeader}
                                onPress={() => setExpandedCategory(isExpanded ? null : categoryKey)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.categoryLeft}>
                                    <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                                    <Text style={styles.categoryName}>{category.name}</Text>
                                </View>
                                <View style={styles.categoryRight}>
                                    <Text style={styles.categoryAmount}>{formatCurrency(category.value)}</Text>
                                    <Text style={styles.categoryPercentage}>{category.percentage.toFixed(1)}%</Text>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <Feather
                                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            color={theme.foregroundMuted}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                            {isExpanded && category.subcategories && (
                                <View style={styles.subcategoriesContainer}>
                                    {category.subcategories.map((sub, subIndex) => (
                                        <View key={subIndex} style={styles.subcategoryItem}>
                                            <Text style={styles.subcategoryName}>{sub.name}</Text>
                                            <Text style={styles.subcategoryAmount}>
                                                {formatCurrency(sub.value)} ({sub.percentage.toFixed(1)}%)
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })
            ) : (
                <View style={styles.emptyState}>
                    <Feather name="pie-chart" size={48} color={theme.foregroundMuted} />
                    <Text style={styles.emptyStateText}>
                        Nenhum investimento registrado
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
                        <Text style={styles.chartTitle}>Evolução Patrimonial</Text>
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

                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Resumo da Evolução</Text>
                        <View style={styles.performanceRow}>
                            <Text style={styles.performanceLabel}>Valor inicial</Text>
                            <Text style={styles.performanceValue}>
                                {formatCurrency(evolution[0]?.value ?? 0)}
                            </Text>
                        </View>
                        <View style={styles.performanceRow}>
                            <Text style={styles.performanceLabel}>Valor atual</Text>
                            <Text style={styles.performanceValue}>
                                {formatCurrency(evolution[evolution.length - 1]?.value ?? 0)}
                            </Text>
                        </View>
                        <View style={[styles.performanceRow, styles.performanceRowLast]}>
                            <Text style={styles.performanceLabel}>Crescimento</Text>
                            <Text style={[
                                styles.performanceValue,
                                (evolution[evolution.length - 1]?.value ?? 0) >= (evolution[0]?.value ?? 0)
                                    ? styles.positiveValue
                                    : styles.negativeValue
                            ]}>
                                {(evolution[evolution.length - 1]?.value ?? 0) >= (evolution[0]?.value ?? 0) ? '+' : ''}
                                {formatCurrency((evolution[evolution.length - 1]?.value ?? 0) - (evolution[0]?.value ?? 0))}
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

    const renderPerformanceView = () => (
        <>
            {profitability.length > 0 ? (
                <View style={styles.performanceCard}>
                    <Text style={styles.chartTitle}>Rentabilidade por Ativo</Text>
                    {profitability.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.performanceRow,
                                index === profitability.length - 1 && styles.performanceRowLast
                            ]}
                        >
                            <View>
                                <Text style={styles.performanceLabel}>{item.name}</Text>
                                <Text style={[styles.performanceLabel, { fontSize: 12 }]}>
                                    Investido: {formatCurrency(item.investedValue)}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[
                                    styles.performanceValue,
                                    item.returnPercent >= 0 ? styles.positiveValue : styles.negativeValue
                                ]}>
                                    {item.returnPercent >= 0 ? '+' : ''}{item.returnPercent.toFixed(2)}%
                                </Text>
                                <Text style={[
                                    styles.performanceLabel,
                                    item.return >= 0 ? styles.positiveValue : styles.negativeValue
                                ]}>
                                    {item.return >= 0 ? '+' : ''}{formatCurrency(item.return)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.performanceCard}>
                    <Text style={styles.chartTitle}>Rentabilidade</Text>
                    <View style={styles.performanceRow}>
                        <Text style={styles.performanceLabel}>Este período</Text>
                        <Text style={[
                            styles.performanceValue,
                            monthlyReturnPercent >= 0 ? styles.positiveValue : styles.negativeValue
                        ]}>
                            {monthlyReturnPercent >= 0 ? '+' : ''}{monthlyReturnPercent.toFixed(2)}%
                        </Text>
                    </View>
                    <View style={[styles.performanceRow, styles.performanceRowLast]}>
                        <Text style={styles.performanceLabel}>Retorno em R$</Text>
                        <Text style={[
                            styles.performanceValue,
                            monthlyReturn >= 0 ? styles.positiveValue : styles.negativeValue
                        ]}>
                            {monthlyReturn >= 0 ? '+' : ''}{formatCurrency(monthlyReturn)}
                        </Text>
                    </View>
                </View>
            )}
        </>
    );

    if (investmentsLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[600]} />
            </View>
        );
    }

    if (investmentsError) {
        return (
            <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={48} color={colors.error[500]} />
                <Text style={styles.errorText}>{investmentsError}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* View Toggle */}
            <View style={styles.viewToggle}>
                <TouchableOpacity
                    style={[styles.viewToggleButton, viewMode === 'allocation' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('allocation')}
                >
                    <Text style={[styles.viewToggleText, viewMode === 'allocation' && styles.viewToggleTextActive]}>
                        Alocação
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
                <TouchableOpacity
                    style={[styles.viewToggleButton, viewMode === 'profitability' && styles.viewToggleButtonActive]}
                    onPress={() => setViewMode('profitability')}
                >
                    <Text style={[styles.viewToggleText, viewMode === 'profitability' && styles.viewToggleTextActive]}>
                        Rentabilidade
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Investido</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(totalInvested)}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Valor Atual</Text>
                    <Text style={[styles.summaryValue, styles.returnValue]}>
                        {formatCurrency(totalCurrent)}
                    </Text>
                </View>
            </View>

            {/* Content based on view mode */}
            {viewMode === 'allocation' && renderAllocationView()}
            {viewMode === 'evolution' && renderEvolutionView()}
            {viewMode === 'profitability' && renderPerformanceView()}
        </View>
    );
};
