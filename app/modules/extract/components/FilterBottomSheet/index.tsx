import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { FilterChips } from '../FilterChips';
import { styles } from './styles';

interface FilterBottomSheetProps {
    modalizeRef: React.RefObject<IHandles>;
    onClear?: () => void;
    onApply?: (filters: FilterState) => void;
}

export interface FilterState {
    status: 'all' | 'paid' | 'unpaid';
    type: 'all' | 'expense' | 'income';
    accounts: string[];
    cards: string[];
    dateRange: {
        start: Date | null;
        end: Date | null;
    };
}

const STATUS_OPTIONS = [
    { label: 'Todos', value: 'all' },
    { label: 'Pago', value: 'paid' },
    { label: 'Não pago', value: 'unpaid' },
];

const TYPE_OPTIONS = [
    { label: 'Todos', value: 'all' },
    { label: 'Despesa', value: 'expense' },
    { label: 'Receita', value: 'income' },
];

const ACCOUNT_OPTIONS = [
    { label: 'Todos', value: 'all' },
    { label: 'Carteira', value: 'wallet' },
];

const CARD_OPTIONS = [
    { label: 'Todos', value: 'all' },
    { label: 'Mastercard', value: 'mastercard' },
    { label: 'C6 Bank', value: 'c6bank' },
    { label: 'Amex', value: 'amex' },
];

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
    modalizeRef,
    onClear,
    onApply: _onApply,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    const styled = styles(theme);

    const [activeTab, setActiveTab] = useState<'details' | 'categories'>('details');
    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        type: 'all',
        accounts: [],
        cards: [],
        dateRange: {
            start: null,
            end: null,
        },
    });

    const handleClear = () => {
        setFilters({
            status: 'all',
            type: 'all',
            accounts: [],
            cards: [],
            dateRange: {
                start: null,
                end: null,
            },
        });
        onClear?.();
    };

    const handleStatusSelect = (value: string) => {
        setFilters((prev) => ({ ...prev, status: value as FilterState['status'] }));
    };

    const handleTypeSelect = (value: string) => {
        setFilters((prev) => ({ ...prev, type: value as FilterState['type'] }));
    };

    const handleAccountSelect = (value: string) => {
        setFilters((prev) => {
            if (value === 'all') {
                return { ...prev, accounts: [] };
            }
            const accounts = prev.accounts.includes(value)
                ? prev.accounts.filter((a) => a !== value)
                : [...prev.accounts, value];
            return { ...prev, accounts };
        });
    };

    const handleCardSelect = (value: string) => {
        setFilters((prev) => {
            if (value === 'all') {
                return { ...prev, cards: [] };
            }
            const cards = prev.cards.includes(value)
                ? prev.cards.filter((c) => c !== value)
                : [...prev.cards, value];
            return { ...prev, cards };
        });
    };

    const formatDateRange = () => {
        if (!filters.dateRange.start || !filters.dateRange.end) {
            return '';
        }
        const start = filters.dateRange.start;
        const end = filters.dateRange.end;
        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleDateString('pt-BR', { month: 'short' });
            return `${day} ${month} ${date.getFullYear()}`;
        };
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 20 }]}>
            <View style={styled.headerTop}>
                <Text style={styled.title}>Filtrar transações</Text>
                <TouchableOpacity onPress={handleClear} style={styled.clearButton}>
                    <Text style={styled.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
            </View>
            <View style={styled.tabsContainer}>
                <TouchableOpacity
                    onPress={() => setActiveTab('details')}
                    style={[styled.tab, activeTab === 'details' && styled.tabActive]}
                >
                    <Text style={[styled.tabText, activeTab === 'details' && styled.tabTextActive]}>
                        Detalhes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('categories')}
                    style={[styled.tab, activeTab === 'categories' && styled.tabActive]}
                >
                    <Text
                        style={[styled.tabText, activeTab === 'categories' && styled.tabTextActive]}
                    >
                        Categorias
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    return (
        <Modalize
            ref={modalizeRef}
            modalHeight={SCREEN_HEIGHT}
            handlePosition="inside"
            handleStyle={styled.handle}
            modalStyle={styled.modal}
            overlayStyle={styled.overlay}
            panGestureEnabled
            closeOnOverlayTap
            withOverlay
            avoidKeyboardLikeIOS
            rootStyle={styled.rootStyle}
        >
            <ScreenWithHeader customHeader={renderHeader()}>
                <ScrollView
                    style={styled.content}
                    contentContainerStyle={[
                        styled.contentContainer,
                        { paddingBottom: insets.bottom + 20 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {activeTab === 'details' && (
                        <View style={styled.filtersContainer}>
                            <View style={styled.filterSection}>
                                <Text style={styled.filterLabel}>Status</Text>
                                <FilterChips
                                    options={STATUS_OPTIONS}
                                    selectedValue={filters.status}
                                    onSelect={handleStatusSelect}
                                />
                            </View>

                            <View style={styled.filterSection}>
                                <Text style={styled.filterLabel}>Tipo</Text>
                                <FilterChips
                                    options={TYPE_OPTIONS}
                                    selectedValue={filters.type}
                                    onSelect={handleTypeSelect}
                                />
                            </View>

                            <View style={styled.filterSection}>
                                <Text style={styled.filterLabel}>Contas</Text>
                                <FilterChips
                                    options={ACCOUNT_OPTIONS}
                                    selectedValue={
                                        filters.accounts.length === 0 ? 'all' : undefined
                                    }
                                    onSelect={handleAccountSelect}
                                />
                            </View>

                            <View style={styled.filterSection}>
                                <Text style={styled.filterLabel}>Cartões</Text>
                                <FilterChips
                                    options={CARD_OPTIONS}
                                    selectedValue={filters.cards.length === 0 ? 'all' : undefined}
                                    onSelect={handleCardSelect}
                                />
                            </View>

                            <View style={styled.filterSection}>
                                <Text style={styled.filterLabel}>Data</Text>
                                <TouchableOpacity style={styled.dateInput}>
                                    <Feather
                                        name="calendar"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                    <Text style={styled.dateInputText}>
                                        {formatDateRange() || '01 jan 2026 - 31 jan 2026'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {activeTab === 'categories' && (
                        <View style={styled.categoriesContainer}>
                            <Text style={styled.emptyText}>Categorias em breve</Text>
                        </View>
                    )}
                </ScrollView>
            </ScreenWithHeader>
        </Modalize>
    );
};
