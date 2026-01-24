import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { BudgetStackParamList } from '../../routes/budgetRoutes';
import { DEFAULT_CATEGORIES, type BudgetCategory } from '../../slices';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<BudgetStackParamList, 'BudgetMain'>;

type PeriodType = 'day' | 'week' | 'month';

// Mock data para demonstração
const MOCK_BUDGET = {
    id: '1',
    name: 'Orçamento Mensal',
    period: 'monthly' as const,
    totalLimit: 5000,
    totalSpent: 2850,
    categories: [
        {
            id: '1',
            name: 'Alimentação',
            icon: '🍔',
            color: '#EF4444',
            limit: 1200,
            spent: 850,
            subCategories: [
                { id: '1-1', name: 'Restaurantes', icon: '🍽️', limit: 400, spent: 320 },
                { id: '1-2', name: 'Supermercado', icon: '🛒', limit: 600, spent: 430 },
                { id: '1-3', name: 'Delivery', icon: '🛵', limit: 200, spent: 100 },
            ],
        },
        {
            id: '2',
            name: 'Transporte',
            icon: '🚗',
            color: '#3B82F6',
            limit: 800,
            spent: 520,
            subCategories: [
                { id: '2-1', name: 'Combustível', icon: '⛽', limit: 500, spent: 380 },
                { id: '2-2', name: 'Uber/99', icon: '🚕', limit: 200, spent: 100 },
                { id: '2-3', name: 'Estacionamento', icon: '🅿️', limit: 100, spent: 40 },
            ],
        },
        {
            id: '3',
            name: 'Lazer',
            icon: '🎮',
            color: '#8B5CF6',
            limit: 600,
            spent: 450,
            subCategories: [
                { id: '4-1', name: 'Streaming', icon: '📺', limit: 100, spent: 80 },
                { id: '4-2', name: 'Cinema', icon: '🎬', limit: 150, spent: 120 },
                { id: '4-3', name: 'Jogos', icon: '🎮', limit: 200, spent: 150 },
                { id: '4-4', name: 'Bares/Baladas', icon: '🍻', limit: 150, spent: 100 },
            ],
        },
        {
            id: '4',
            name: 'Saúde',
            icon: '💊',
            color: '#EC4899',
            limit: 500,
            spent: 280,
            subCategories: [
                { id: '5-1', name: 'Academia', icon: '🏋️', limit: 150, spent: 150 },
                { id: '5-2', name: 'Medicamentos', icon: '💊', limit: 200, spent: 80 },
                { id: '5-3', name: 'Consultas', icon: '👨‍⚕️', limit: 150, spent: 50 },
            ],
        },
        {
            id: '5',
            name: 'Compras',
            icon: '🛍️',
            color: '#14B8A6',
            limit: 500,
            spent: 350,
            subCategories: [
                { id: '7-1', name: 'Roupas', icon: '👕', limit: 300, spent: 250 },
                { id: '7-2', name: 'Eletrônicos', icon: '📱', limit: 200, spent: 100 },
            ],
        },
    ] as BudgetCategory[],
};

export const BudgetScreen: React.FC = () => {
    const theme = useTheme();
    const styled = styles(theme);
    const navigation = useNavigation<NavigationProp>();

    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('day');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Simular que não tem orçamento criado ainda
    const [hasBudget, setHasBudget] = useState(true);
    const budget = hasBudget ? MOCK_BUDGET : null;

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const spendingLimits = useMemo(() => {
        if (!budget) return null;

        const remaining = budget.totalLimit - budget.totalSpent;
        const daysInMonth = 30;
        const daysRemaining = 15; // Mock: dias restantes no mês

        // Calcular quanto pode gastar por período
        const dailyLimit = remaining / daysRemaining;
        const weeklyLimit = dailyLimit * 7;
        const monthlyRemaining = remaining;

        return {
            daily: {
                limit: dailyLimit,
                label: 'Por dia',
            },
            weekly: {
                limit: weeklyLimit,
                label: 'Por semana',
            },
            monthly: {
                limit: monthlyRemaining,
                label: 'Restante do mês',
            },
            daysRemaining,
        };
    }, [budget]);

    const getProgressColor = (spent: number, limit: number) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return colors.error[500];
        if (percentage >= 80) return colors.warning[500];
        return colors.success[500];
    };

    const handleCreateBudget = () => {
        navigation.navigate('CreateBudget');
    };

    const handleEditBudget = () => {
        if (budget) {
            navigation.navigate('EditBudget', { budgetId: budget.id });
        }
    };

    const renderHeader = () => (
        <View style={styled.header}>
            <Text style={styled.headerTitle}>Orçamento</Text>
            <TouchableOpacity
                style={styled.headerAddButton}
                onPress={handleCreateBudget}
                activeOpacity={0.7}
            >
                <Feather name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <ScreenWithHeader customHeader={renderHeader()}>
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            </ScreenWithHeader>
        );
    }

    if (!budget) {
        return (
            <ScreenWithHeader customHeader={renderHeader()}>
                <View style={styled.emptyContainer}>
                    <View style={styled.emptyIconContainer}>
                        <Feather name="pie-chart" size={40} color={theme.foregroundMuted} />
                    </View>
                    <Text style={styled.emptyTitle}>Crie seu primeiro orçamento</Text>
                    <Text style={styled.emptyDescription}>
                        Defina limites de gastos para cada categoria e acompanhe seus gastos de forma inteligente
                    </Text>
                    <TouchableOpacity
                        style={styled.createButton}
                        onPress={handleCreateBudget}
                        activeOpacity={0.8}
                    >
                        <Feather name="plus" size={20} color="#FFFFFF" />
                        <Text style={styled.createButtonText}>Criar Orçamento</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWithHeader>
        );
    }

    const progressPercentage = (budget.totalSpent / budget.totalLimit) * 100;
    const progressColor = getProgressColor(budget.totalSpent, budget.totalLimit);

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <ScrollView
                style={styled.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Card principal - Quanto posso gastar */}
                <View style={styled.mainCard}>
                    <View style={styled.mainCardHeader}>
                        <Text style={styled.mainCardTitle}>Você pode gastar</Text>
                        <View style={styled.daysRemainingBadge}>
                            <Text style={styled.daysRemainingText}>
                                {spendingLimits?.daysRemaining} dias restantes
                            </Text>
                        </View>
                    </View>

                    <Text style={styled.mainCardAmount}>
                        {formatCurrency(spendingLimits?.daily.limit || 0)}
                    </Text>
                    <Text style={styled.mainCardSubtitle}>por dia para manter seu orçamento</Text>
                </View>

                {/* Cards de resumo */}
                <View style={styled.summaryCardsRow}>
                    <View style={styled.summaryCard}>
                        <Feather name="calendar" size={20} color={colors.primary[400]} />
                        <Text style={styled.summaryCardLabel}>Por semana</Text>
                        <Text style={styled.summaryCardValue}>
                            {formatCurrency(spendingLimits?.weekly.limit || 0)}
                        </Text>
                    </View>
                    <View style={styled.summaryCard}>
                        <Feather name="wallet" size={20} color={colors.success[500]} />
                        <Text style={styled.summaryCardLabel}>Restante</Text>
                        <Text style={[styled.summaryCardValue, { color: colors.success[500] }]}>
                            {formatCurrency(spendingLimits?.monthly.limit || 0)}
                        </Text>
                    </View>
                    <View style={styled.summaryCard}>
                        <Feather name="percent" size={20} color={progressColor} />
                        <Text style={styled.summaryCardLabel}>Usado</Text>
                        <Text style={[styled.summaryCardValue, { color: progressColor }]}>
                            {progressPercentage.toFixed(0)}%
                        </Text>
                    </View>
                </View>

                {/* Progresso Geral */}
                <View style={styled.progressCard}>
                    <View style={styled.progressHeader}>
                        <Text style={styled.progressTitle}>Progresso Geral</Text>
                        <Text style={[styled.progressPercentage, { color: progressColor }]}>
                            {progressPercentage.toFixed(0)}%
                        </Text>
                    </View>
                    <View style={styled.progressBarContainer}>
                        <View
                            style={[
                                styled.progressBar,
                                {
                                    width: `${Math.min(progressPercentage, 100)}%`,
                                    backgroundColor: progressColor,
                                }
                            ]}
                        />
                    </View>
                    <View style={styled.progressInfo}>
                        <Text style={styled.progressInfoText}>
                            Gasto: {formatCurrency(budget.totalSpent)}
                        </Text>
                        <Text style={styled.progressInfoText}>
                            Limite: {formatCurrency(budget.totalLimit)}
                        </Text>
                    </View>
                </View>

                {/* Categorias */}
                <View style={styled.categoriesSection}>
                    <View style={styled.categoriesHeader}>
                        <Text style={styled.categoriesTitle}>Por Categoria</Text>
                    </View>

                    {budget.categories.map((category) => {
                        const catPercentage = (category.spent / category.limit) * 100;
                        const catColor = getProgressColor(category.spent, category.limit);
                        const isExpanded = expandedCategories.includes(category.id);

                        return (
                            <TouchableOpacity
                                key={category.id}
                                style={styled.categoryCard}
                                onPress={() => toggleCategory(category.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styled.categoryHeader}>
                                    <View style={[styled.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                                        <Text style={styled.categoryIconText}>{category.icon}</Text>
                                    </View>
                                    <View style={styled.categoryInfo}>
                                        <Text style={styled.categoryName}>{category.name}</Text>
                                        <Text style={styled.categorySubtitle}>
                                            {category.subCategories.length} subcategorias
                                        </Text>
                                    </View>
                                    <View style={styled.categoryAmount}>
                                        <Text style={styled.categorySpent}>
                                            {formatCurrency(category.spent)}
                                        </Text>
                                        <Text style={styled.categoryLimit}>
                                            de {formatCurrency(category.limit)}
                                        </Text>
                                    </View>
                                    <Feather
                                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={theme.foregroundMuted}
                                        style={{ marginLeft: 8 }}
                                    />
                                </View>

                                <View style={styled.categoryProgressContainer}>
                                    <View
                                        style={[
                                            styled.categoryProgress,
                                            {
                                                width: `${Math.min(catPercentage, 100)}%`,
                                                backgroundColor: catColor,
                                            }
                                        ]}
                                    />
                                </View>

                                {isExpanded && (
                                    <View style={styled.subCategoriesContainer}>
                                        {category.subCategories.map((sub) => (
                                            <View key={sub.id} style={styled.subCategoryItem}>
                                                <View style={styled.subCategoryLeft}>
                                                    <Text style={styled.subCategoryIcon}>{sub.icon}</Text>
                                                    <Text style={styled.subCategoryName}>{sub.name}</Text>
                                                </View>
                                                <Text style={styled.subCategoryAmount}>
                                                    {formatCurrency(sub.spent)} / {formatCurrency(sub.limit)}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </ScreenWithHeader>
    );
};

export default BudgetScreen;
