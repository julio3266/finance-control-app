import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { BudgetStackParamList } from '../../routes/budgetRoutes';
import { DEFAULT_CATEGORIES } from '../../slices';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<BudgetStackParamList, 'CreateBudget'>;

type PeriodType = 'weekly' | 'monthly' | 'yearly';

interface CategoryLimit {
    categoryId: string;
    limit: number;
    enabled: boolean;
    subCategories: {
        subCategoryId: string;
        limit: number;
        enabled: boolean;
    }[];
}

// Função para formatar valor como moeda brasileira
const formatCurrencyInput = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const cents = parseInt(numbers, 10);
    const reais = cents / 100;
    return reais.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

// Função para extrair valor numérico
const parseCurrencyValue = (formattedValue: string): number => {
    const numbers = formattedValue.replace(/\D/g, '');
    return numbers ? parseInt(numbers, 10) / 100 : 0;
};

export const CreateBudgetScreen: React.FC = () => {
    const theme = useTheme();
    const styled = styles(theme);
    const navigation = useNavigation<NavigationProp>();

    const [budgetName, setBudgetName] = useState('Orçamento Mensal');
    const [period, setPeriod] = useState<PeriodType>('monthly');
    const [totalLimit, setTotalLimit] = useState('R$ 5.000,00');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [categoryLimits, setCategoryLimits] = useState<CategoryLimit[]>(
        DEFAULT_CATEGORIES.map((cat) => ({
            categoryId: cat.id,
            limit: 0,
            enabled: false,
            subCategories: cat.subCategories.map((sub) => ({
                subCategoryId: sub.id,
                limit: 0,
                enabled: false,
            })),
        }))
    );

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const toggleCategoryEnabled = (categoryId: string) => {
        setCategoryLimits((prev) =>
            prev.map((cat) =>
                cat.categoryId === categoryId
                    ? {
                        ...cat,
                        enabled: !cat.enabled,
                        subCategories: cat.subCategories.map((sub) => ({
                            ...sub,
                            enabled: !cat.enabled,
                        })),
                    }
                    : cat
            )
        );
    };

    const toggleSubCategoryEnabled = (categoryId: string, subCategoryId: string) => {
        setCategoryLimits((prev) =>
            prev.map((cat) =>
                cat.categoryId === categoryId
                    ? {
                        ...cat,
                        subCategories: cat.subCategories.map((sub) =>
                            sub.subCategoryId === subCategoryId
                                ? { ...sub, enabled: !sub.enabled }
                                : sub
                        ),
                    }
                    : cat
            )
        );
    };

    const updateCategoryLimit = (categoryId: string, value: string) => {
        const numValue = parseCurrencyValue(value);
        setCategoryLimits((prev) =>
            prev.map((cat) =>
                cat.categoryId === categoryId ? { ...cat, limit: numValue } : cat
            )
        );
    };

    const updateSubCategoryLimit = (
        categoryId: string,
        subCategoryId: string,
        value: string
    ) => {
        const numValue = parseCurrencyValue(value);
        setCategoryLimits((prev) =>
            prev.map((cat) =>
                cat.categoryId === categoryId
                    ? {
                        ...cat,
                        subCategories: cat.subCategories.map((sub) =>
                            sub.subCategoryId === subCategoryId
                                ? { ...sub, limit: numValue }
                                : sub
                        ),
                    }
                    : cat
            )
        );
    };

    const totalCategoriesLimit = useMemo(() => {
        return categoryLimits
            .filter((cat) => cat.enabled)
            .reduce((sum, cat) => sum + cat.limit, 0);
    }, [categoryLimits]);

    const enabledCategoriesCount = useMemo(() => {
        return categoryLimits.filter((cat) => cat.enabled).length;
    }, [categoryLimits]);

    const distributeEvenly = () => {
        const totalValue = parseCurrencyValue(totalLimit);
        const enabledCats = categoryLimits.filter((cat) => cat.enabled);

        if (enabledCats.length === 0) {
            Alert.alert('Atenção', 'Selecione pelo menos uma categoria primeiro.');
            return;
        }

        const perCategory = totalValue / enabledCats.length;

        setCategoryLimits((prev) =>
            prev.map((cat) =>
                cat.enabled
                    ? {
                        ...cat,
                        limit: perCategory,
                        subCategories: cat.subCategories.map((sub, idx, arr) => ({
                            ...sub,
                            limit: sub.enabled ? perCategory / arr.filter(s => s.enabled).length : 0,
                        })),
                    }
                    : cat
            )
        );
    };

    const handleSave = () => {
        const enabledCategories = categoryLimits.filter((cat) => cat.enabled);

        if (enabledCategories.length === 0) {
            Alert.alert('Atenção', 'Selecione pelo menos uma categoria para o orçamento.');
            return;
        }



        Alert.alert('Sucesso', 'Orçamento criado com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    const isValid = budgetName.trim() && parseCurrencyValue(totalLimit) > 0 && enabledCategoriesCount > 0;

    const renderHeader = () => (
        <View style={styled.header}>
            <TouchableOpacity
                style={styled.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.headerTitleText}>Criar Orçamento</Text>
            <View style={styled.headerRight} />
        </View>
    );

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <KeyboardAvoidingView
                style={styled.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styled.scrollView}
                    contentContainerStyle={styled.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styled.headerInfo}>
                        <Text style={styled.headerTitle}>Novo Orçamento</Text>
                        <Text style={styled.headerSubtitle}>
                            Defina limites de gastos para cada categoria e controle suas finanças
                        </Text>
                    </View>

                    {/* Period Selector */}
                    <View style={styled.periodSection}>
                        <Text style={styled.sectionLabel}>Período</Text>
                        <View style={styled.periodOptions}>
                            <TouchableOpacity
                                style={[
                                    styled.periodOption,
                                    period === 'weekly' && styled.periodOptionActive,
                                ]}
                                onPress={() => setPeriod('weekly')}
                            >
                                <Feather
                                    name="calendar"
                                    size={20}
                                    color={period === 'weekly' ? theme.primary : theme.foregroundMuted}
                                    style={styled.periodOptionIcon}
                                />
                                <Text
                                    style={[
                                        styled.periodOptionText,
                                        period === 'weekly' && styled.periodOptionTextActive,
                                    ]}
                                >
                                    Semanal
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styled.periodOption,
                                    period === 'monthly' && styled.periodOptionActive,
                                ]}
                                onPress={() => setPeriod('monthly')}
                            >
                                <Feather
                                    name="calendar"
                                    size={20}
                                    color={period === 'monthly' ? theme.primary : theme.foregroundMuted}
                                    style={styled.periodOptionIcon}
                                />
                                <Text
                                    style={[
                                        styled.periodOptionText,
                                        period === 'monthly' && styled.periodOptionTextActive,
                                    ]}
                                >
                                    Mensal
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styled.periodOption,
                                    period === 'yearly' && styled.periodOptionActive,
                                ]}
                                onPress={() => setPeriod('yearly')}
                            >
                                <Feather
                                    name="calendar"
                                    size={20}
                                    color={period === 'yearly' ? theme.primary : theme.foregroundMuted}
                                    style={styled.periodOptionIcon}
                                />
                                <Text
                                    style={[
                                        styled.periodOptionText,
                                        period === 'yearly' && styled.periodOptionTextActive,
                                    ]}
                                >
                                    Anual
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Budget Name */}
                    <View style={styled.nameSection}>
                        <Text style={styled.sectionLabel}>Nome do orçamento</Text>
                        <TextInput
                            style={styled.input}
                            value={budgetName}
                            onChangeText={setBudgetName}
                            placeholder="Ex: Orçamento Mensal"
                            placeholderTextColor={theme.foregroundMuted}
                        />
                    </View>

                    {/* Total Limit */}
                    <View style={styled.totalSection}>
                        <Text style={styled.sectionLabel}>Limite total</Text>
                        <View style={styled.totalCard}>
                            <Text style={styled.totalLabel}>Quanto você quer gastar no máximo?</Text>
                            <TextInput
                                style={styled.totalInput}
                                value={totalLimit}
                                onChangeText={(text) => setTotalLimit(formatCurrencyInput(text))}
                                keyboardType="numeric"
                                placeholder="R$ 0,00"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                            />
                            <Text style={styled.totalHint}>
                                Este será o limite máximo para o período selecionado
                            </Text>
                        </View>
                    </View>

                    {/* Distribute Evenly */}
                    <View style={styled.distributeSection}>
                        <View style={styled.distributeCard}>
                            <View style={styled.distributeLeft}>
                                <Feather name="sliders" size={20} color={theme.foregroundMuted} />
                                <Text style={styled.distributeText}>
                                    Distribuir igualmente entre categorias
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styled.distributeButton}
                                onPress={distributeEvenly}
                            >
                                <Text style={styled.distributeButtonText}>Distribuir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Categories */}
                    <View style={styled.categoriesSection}>
                        <View style={styled.categoriesHeader}>
                            <Text style={styled.categoriesTitle}>
                                Categorias ({enabledCategoriesCount} selecionadas)
                            </Text>
                        </View>

                        {DEFAULT_CATEGORIES.map((category) => {
                            const catLimit = categoryLimits.find(
                                (c) => c.categoryId === category.id
                            );
                            const isEnabled = catLimit?.enabled || false;
                            const isExpanded = expandedCategories.includes(category.id);

                            return (
                                <View
                                    key={category.id}
                                    style={[
                                        styled.categoryItem,
                                        isEnabled && styled.categoryItemSelected,
                                    ]}
                                >
                                    <View style={styled.categoryHeader}>
                                        <TouchableOpacity
                                            style={[
                                                styled.categoryCheckbox,
                                                isEnabled && styled.categoryCheckboxSelected,
                                            ]}
                                            onPress={() => toggleCategoryEnabled(category.id)}
                                        >
                                            {isEnabled && (
                                                <Feather name="check" size={16} color="#FFFFFF" />
                                            )}
                                        </TouchableOpacity>
                                        <View
                                            style={[
                                                styled.categoryIcon,
                                                { backgroundColor: `${category.color}20` },
                                            ]}
                                        >
                                            <Text style={styled.categoryIconText}>
                                                {category.icon}
                                            </Text>
                                        </View>
                                        <View style={styled.categoryInfo}>
                                            <Text style={styled.categoryName}>{category.name}</Text>
                                            <Text style={styled.categorySubCount}>
                                                {category.subCategories.length} subcategorias
                                            </Text>
                                        </View>
                                        {isEnabled && (
                                            <TextInput
                                                style={styled.categoryLimitInput}
                                                value={
                                                    catLimit?.limit
                                                        ? formatCurrency(catLimit.limit)
                                                        : ''
                                                }
                                                onChangeText={(text) =>
                                                    updateCategoryLimit(category.id, text)
                                                }
                                                keyboardType="numeric"
                                                placeholder="R$ 0,00"
                                                placeholderTextColor={theme.foregroundMuted}
                                            />
                                        )}
                                        <TouchableOpacity
                                            onPress={() => toggleCategory(category.id)}
                                            style={styled.expandIcon}
                                        >
                                            <Feather
                                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                size={20}
                                                color={theme.foregroundMuted}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {isExpanded && (
                                        <View style={styled.subCategoriesContainer}>
                                            {category.subCategories.map((sub, idx) => {
                                                const subLimit = catLimit?.subCategories.find(
                                                    (s) => s.subCategoryId === sub.id
                                                );
                                                const isSubEnabled = subLimit?.enabled || false;
                                                const isLast =
                                                    idx === category.subCategories.length - 1;

                                                return (
                                                    <View
                                                        key={sub.id}
                                                        style={[
                                                            styled.subCategoryItem,
                                                            isLast && styled.subCategoryItemLast,
                                                        ]}
                                                    >
                                                        <View style={styled.subCategoryLeft}>
                                                            <TouchableOpacity
                                                                style={[
                                                                    styled.subCategoryCheckbox,
                                                                    isSubEnabled &&
                                                                    styled.subCategoryCheckboxSelected,
                                                                ]}
                                                                onPress={() =>
                                                                    toggleSubCategoryEnabled(
                                                                        category.id,
                                                                        sub.id
                                                                    )
                                                                }
                                                            >
                                                                {isSubEnabled && (
                                                                    <Feather
                                                                        name="check"
                                                                        size={12}
                                                                        color="#FFFFFF"
                                                                    />
                                                                )}
                                                            </TouchableOpacity>
                                                            <Text style={styled.subCategoryIcon}>
                                                                {sub.icon}
                                                            </Text>
                                                            <Text style={styled.subCategoryName}>
                                                                {sub.name}
                                                            </Text>
                                                        </View>
                                                        {isSubEnabled && isEnabled && (
                                                            <TextInput
                                                                style={styled.subCategoryLimitInput}
                                                                value={
                                                                    subLimit?.limit
                                                                        ? formatCurrency(
                                                                            subLimit.limit
                                                                        )
                                                                        : ''
                                                                }
                                                                onChangeText={(text) =>
                                                                    updateSubCategoryLimit(
                                                                        category.id,
                                                                        sub.id,
                                                                        text
                                                                    )
                                                                }
                                                                keyboardType="numeric"
                                                                placeholder="R$ 0,00"
                                                                placeholderTextColor={
                                                                    theme.foregroundMuted
                                                                }
                                                            />
                                                        )}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    {/* Summary */}
                    <View style={styled.summarySection}>
                        <View style={styled.summaryRow}>
                            <Text style={styled.summaryLabel}>Limite total definido</Text>
                            <Text style={styled.summaryValue}>{totalLimit}</Text>
                        </View>
                        <View style={styled.summaryRow}>
                            <Text style={styled.summaryLabel}>Total em categorias</Text>
                            <Text style={styled.summaryValue}>
                                {formatCurrency(totalCategoriesLimit)}
                            </Text>
                        </View>
                        <View style={[styled.summaryRow, styled.summaryRowLast]}>
                            <Text style={styled.summaryLabel}>Diferença</Text>
                            <Text
                                style={[
                                    styled.summaryTotal,
                                    {
                                        color:
                                            parseCurrencyValue(totalLimit) - totalCategoriesLimit >= 0
                                                ? colors.success[500]
                                                : colors.error[500],
                                    },
                                ]}
                            >
                                {formatCurrency(
                                    parseCurrencyValue(totalLimit) - totalCategoriesLimit
                                )}
                            </Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styled.buttonsContainer}>
                        <TouchableOpacity
                            style={styled.cancelButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styled.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styled.saveButton, !isValid && styled.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={!isValid}
                        >
                            <Feather name="check" size={20} color="#FFFFFF" />
                            <Text style={styled.saveButtonText}>Criar Orçamento</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWithHeader>
    );
};

export default CreateBudgetScreen;
