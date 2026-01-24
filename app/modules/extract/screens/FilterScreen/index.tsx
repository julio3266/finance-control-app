import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { styles } from './styles';
import { Button } from '@app/ui/Button';
import { useAppDispatch, useAppSelector } from '@app/store';
import {
    setFilters,
    clearFilters,
    fetchUnifiedTransactions,
    type FetchUnifiedTransactionsParams,
} from '../../slices';
import {
    fetchUnifiedAccounts,
    type UnifiedAccountResponse,
} from '@app/modules/accounts/slices/accountsApi';
import {
    fetchCreditCards,
    type CreditCardResponse,
} from '@app/modules/credit-card/slices/creditCardApi';
import { FilterState } from '@extract/components';
import { FilterChips } from '@extract/components/FilterChips';
import { DateRangePicker } from '@extract/components/DateRangePicker';

const TYPE_OPTIONS = [
    { label: 'Todos', value: 'all' },
    { label: 'Despesa', value: 'EXPENSE', selectedColor: colors.error[500] },
    { label: 'Receita', value: 'INCOME', selectedColor: colors.success[500] },
];

export default function FilterScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const extractState = useAppSelector((state) => (state as any).extract);
    const reduxFilters = useMemo(
        () =>
            extractState?.filters || {
                type: 'all',
                status: 'all',
                page: 1,
                pageSize: 20,
            },
        [extractState?.filters],
    );

    const accountsState = useAppSelector((state) => (state as any).accounts);
    const creditCardsState = useAppSelector((state) => (state as any).creditCard);

    const [activeTab, setActiveTab] = useState<'details' | 'categories'>('details');
    const [isApplyingFilters, setIsApplyingFilters] = useState(false);
    const datePickerRef = useRef<IHandles>(null);

    const getInitialFilters = useCallback(
        (): FilterState & { selectedAccountSource?: 'manual' | 'open_finance' } => {
            const accountId = reduxFilters.accountId;
            const bankAccountId = (reduxFilters as any).bankAccountId;

            let selectedAccountSource: 'manual' | 'open_finance' | undefined = undefined;
            if (accountId) {
                selectedAccountSource = 'manual';
            } else if (bankAccountId) {
                selectedAccountSource = 'open_finance';
            }

            // Determinar o tipo com tipo explícito
            const type: 'all' | 'income' | 'expense' =
                reduxFilters.type === 'INCOME'
                    ? 'income'
                    : reduxFilters.type === 'EXPENSE'
                        ? 'expense'
                        : 'all';

            const initialFilters: FilterState & { selectedAccountSource?: 'manual' | 'open_finance' } = {
                status: (reduxFilters.status as 'all' | 'paid' | 'unpaid') || 'all',
                type,
                accounts: accountId || bankAccountId ? [accountId || bankAccountId || ''] : [],
                cards: reduxFilters.creditCardId ? [reduxFilters.creditCardId] : [],
                dateRange: {
                    start: reduxFilters.startDate ? new Date(reduxFilters.startDate) : null,
                    end: reduxFilters.endDate ? new Date(reduxFilters.endDate) : null,
                },
                selectedAccountSource,
            };


            return initialFilters;
        },
        [reduxFilters],
    );

    const [filters, setLocalFilters] = useState<FilterState & { selectedAccountSource?: 'manual' | 'open_finance' }>(getInitialFilters);


    useEffect(() => {
        const updatedFilters = getInitialFilters();

        setLocalFilters(updatedFilters);
    }, [getInitialFilters]);


    useFocusEffect(
        useCallback(() => {

            const updatedFilters = getInitialFilters();

            setLocalFilters(updatedFilters);
        }, [getInitialFilters]),
    );

    useEffect(() => {
        dispatch(fetchUnifiedAccounts());
        dispatch(fetchCreditCards());
    }, [dispatch]);

    const accountOptions = useMemo(() => {
        const unifiedAccounts: UnifiedAccountResponse[] = accountsState?.unifiedAccounts || [];
        const options: { label: string; value: string; accountSource?: 'manual' | 'open_finance' }[] = [{ label: 'Todos', value: 'all' }];


        const accountsByInstitution = new Map<string, UnifiedAccountResponse[]>();
        const validAccounts: UnifiedAccountResponse[] = [];

        unifiedAccounts.forEach((account: UnifiedAccountResponse) => {
            if (!account.type || account.isActive === false) {
                return;
            }

            const accountType = String(account.type).toUpperCase().trim();
            const isCreditCard =
                accountType === 'CREDIT_CARD' ||
                accountType === 'CREDITCARD' ||
                accountType === 'CREDIT';

            if (!isCreditCard) {
                validAccounts.push(account);
                const institution = account.institution || 'Sem banco';
                if (!accountsByInstitution.has(institution)) {
                    accountsByInstitution.set(institution, []);
                }
                accountsByInstitution.get(institution)!.push(account);
            }
        });


        validAccounts.forEach((account: UnifiedAccountResponse) => {
            const institution = account.institution || 'Sem banco';
            const accountsFromSameBank = accountsByInstitution.get(institution) || [];

            let label = account.name;


            if (accountsFromSameBank.length > 1) {

                if (account.number) {

                    const numberStr = account.number;

                    if (numberStr.length > 4) {
                        const lastPart = numberStr.slice(-6);
                        label = `${account.name} •••• ${lastPart}`;
                    } else {
                        label = `${account.name} •••• ${numberStr}`;
                    }
                } else {

                    const digitMatch = account.name.match(/(\d{4,})/);
                    if (digitMatch) {
                        const lastDigits = digitMatch[1].slice(-4);
                        label = `${account.name} •••• ${lastDigits}`;
                    } else {

                        const lastDigits = account.id.slice(-4);
                        label = `${account.name} •••• ${lastDigits}`;
                    }
                }
            }

            options.push({
                label,
                value: account.id,
                accountSource: account.source,
            });
        });

        return options;
    }, [accountsState?.unifiedAccounts]);

    const cardOptions = useMemo(() => {
        const creditCards: CreditCardResponse[] = creditCardsState?.cards || [];
        const options = [{ label: 'Todos', value: 'all' }];
        creditCards.forEach((card: CreditCardResponse) => {
            if (card.isActive !== false) {
                options.push({
                    label: card.name,
                    value: card.id,
                });
            }
        });
        return options;
    }, [creditCardsState?.cards]);

    const handleClear = () => {
        setLocalFilters({
            status: 'all',
            type: 'all',
            accounts: [],
            cards: [],
            dateRange: {
                start: null,
                end: null,
            },
            selectedAccountSource: undefined,
        });
        dispatch(clearFilters());
    };

    const handleTypeSelect = useCallback((value: string) => {
        setLocalFilters((prev) => {
            const localType =
                value === 'EXPENSE' ? 'expense' : value === 'INCOME' ? 'income' : 'all';
            return { ...prev, type: localType as FilterState['type'] };
        });
    }, []);

    const handleAccountSelect = useCallback((value: string) => {
        setLocalFilters((prev) => {
            if (value === 'all') {
                return { ...prev, accounts: [], selectedAccountSource: undefined };
            }

            const selectedAccount = accountOptions.find((opt) => opt.value === value);
            const accountSource = selectedAccount?.accountSource as 'manual' | 'open_finance' | undefined;

            const accounts = prev.accounts.includes(value) ? [] : [value];
            return { ...prev, accounts, selectedAccountSource: accounts.length > 0 ? accountSource : undefined };
        });
    }, [accountOptions]);

    const handleCardSelect = useCallback((value: string) => {
        setLocalFilters((prev) => {
            if (value === 'all') {
                return { ...prev, cards: [] };
            }

            const cards = prev.cards.includes(value) ? [] : [value];
            return { ...prev, cards };
        });
    }, []);


    const formatDateRange = useMemo(() => {
        if (!filters.dateRange.start || !filters.dateRange.end) {
            return '01 jan 2026 - 31 jan 2026';
        }
        const start = filters.dateRange.start;
        const end = filters.dateRange.end;
        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleDateString('pt-BR', { month: 'short' });
            return `${day} ${month} ${date.getFullYear()}`;
        };
        return `${formatDate(start)} - ${formatDate(end)}`;
    }, [filters.dateRange.start, filters.dateRange.end]);

    const filterSections = useMemo(() => {
        if (activeTab === 'categories') {
            return [];
        }

        return [
            {
                id: 'type',
                label: 'Tipo',
                type: 'chips' as const,
                options: TYPE_OPTIONS,
                selectedValue:
                    filters.type === 'expense'
                        ? 'EXPENSE'
                        : filters.type === 'income'
                            ? 'INCOME'
                            : 'all',
                onSelect: handleTypeSelect,
            },
            {
                id: 'accounts',
                label: 'Contas',
                type: 'chips' as const,
                options: accountOptions,
                selectedValue: (() => {
                    const selected = filters.accounts.length === 0 ? 'all' : filters.accounts[0];

                    return selected;
                })(),
                onSelect: handleAccountSelect,
            },
            {
                id: 'cards',
                label: 'Cartões',
                type: 'chips' as const,
                options: cardOptions,
                selectedValue: filters.cards.length === 0 ? 'all' : filters.cards[0],
                onSelect: handleCardSelect,
            },
            {
                id: 'date',
                label: 'Data',
                type: 'date' as const,
                dateRange: formatDateRange,
            },
        ];
    }, [
        activeTab,
        filters.type,
        filters.accounts,
        filters.cards,
        formatDateRange,
        accountOptions,
        cardOptions,
        handleTypeSelect,
        handleAccountSelect,
        handleCardSelect,
    ]);

    const renderFilterItem = ({ item }: { item: (typeof filterSections)[0] }) => {
        if (item.type === 'chips') {
            return (
                <View style={styled.filterSection}>
                    <Text style={styled.filterLabel}>{item.label}</Text>
                    <FilterChips
                        options={item.options}
                        selectedValue={item.selectedValue}
                        onSelect={item.onSelect}
                    />
                </View>
            );
        }

        if (item.type === 'date') {
            return (
                <View style={styled.filterSection}>
                    <Text style={styled.filterLabel}>{item.label}</Text>
                    <TouchableOpacity
                        style={styled.dateInput}
                        onPress={() => datePickerRef.current?.open()}
                    >
                        <Feather name="calendar" size={20} color={theme.foregroundMuted} />
                        <Text style={styled.dateInputText}>{item.dateRange}</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    const renderListEmpty = () => {
        if (activeTab === 'categories') {
            return (
                <View style={styled.categoriesContainer}>
                    <Text style={styled.emptyText}>Categorias em breve</Text>
                </View>
            );
        }
        return null;
    };

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 20 }]}>
            <View style={styled.headerTop}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styled.closeButton}>
                    <Feather name="x" size={24} color={theme.foreground} />
                </TouchableOpacity>
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
            </View>
        </View>
    );

    const handleApplyFilters = async () => {
        if (isApplyingFilters) return;
        setIsApplyingFilters(true);

        try {
            const apiFilters: {
                type?: 'all' | 'INCOME' | 'EXPENSE';
                status?: 'all' | 'paid' | 'unpaid';
                accountId?: string;
                bankAccountId?: string;
                creditCardId?: string;
                startDate?: string;
                endDate?: string;
                month?: number;
                year?: number;
                page: number;
            } = {

                type:
                    filters.type === 'all'
                        ? 'all'
                        : filters.type === 'expense'
                            ? 'EXPENSE'
                            : 'INCOME',
                status: filters.status === 'all' ? 'all' : filters.status,
                page: 1,
            };


            if (filters.accounts.length === 1 && filters.accounts[0] !== 'all') {
                const accountId = filters.accounts[0];


                const selectedAccount = accountOptions.find((opt) => opt.value === accountId);
                const accountSource = selectedAccount?.accountSource || filters.selectedAccountSource;

                if (accountSource === 'open_finance') {

                    apiFilters.bankAccountId = accountId;
                    apiFilters.accountId = undefined;
                } else {

                    apiFilters.accountId = accountId;
                    apiFilters.bankAccountId = undefined;
                }
            } else {

                apiFilters.accountId = undefined;
                apiFilters.bankAccountId = undefined;
            }


            if (filters.cards.length === 1) {
                apiFilters.creditCardId = filters.cards[0];
            } else {

                apiFilters.creditCardId = undefined;
            }

            if (filters.dateRange.start && filters.dateRange.end) {
                apiFilters.startDate = filters.dateRange.start.toISOString();
                apiFilters.endDate = filters.dateRange.end.toISOString();

                delete apiFilters.month;
                delete apiFilters.year;
            } else {

                apiFilters.startDate = undefined;
                apiFilters.endDate = undefined;

                if (reduxFilters.month && reduxFilters.year) {
                    apiFilters.month = reduxFilters.month;
                    apiFilters.year = reduxFilters.year;
                } else {

                    const now = new Date();
                    apiFilters.month = now.getMonth() + 1;
                    apiFilters.year = now.getFullYear();
                }
            }


            const fetchParams: FetchUnifiedTransactionsParams = {
                ...apiFilters,
                page: 1,
                pageSize: apiFilters.startDate && apiFilters.endDate ? 0 : 20,
            };





            const filtersToSet: Partial<FetchUnifiedTransactionsParams> & {
                accountId?: string | undefined;
                bankAccountId?: string | undefined;
                creditCardId?: string | undefined;
            } = {
                type: fetchParams.type || 'all',
                status: fetchParams.status || 'all',
                page: fetchParams.page || 1,
                pageSize: fetchParams.pageSize,


                accountId: fetchParams.accountId,
                bankAccountId: fetchParams.bankAccountId,
                creditCardId: fetchParams.creditCardId,
            };


            if (fetchParams.startDate !== undefined) {
                filtersToSet.startDate = fetchParams.startDate;
            }
            if (fetchParams.endDate !== undefined) {
                filtersToSet.endDate = fetchParams.endDate;
            }
            if (fetchParams.month !== undefined) {
                filtersToSet.month = fetchParams.month;
            }
            if (fetchParams.year !== undefined) {
                filtersToSet.year = fetchParams.year;
            }
            if (fetchParams.sourceType !== undefined) {
                filtersToSet.sourceType = fetchParams.sourceType;
            }

            dispatch(setFilters(filtersToSet));
            await dispatch(fetchUnifiedTransactions(fetchParams)).unwrap();

            navigation.goBack();
        } catch (error) {
        } finally {
            setIsApplyingFilters(false);
        }
    };

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <View style={styled.container}>
                <FlatList
                    data={filterSections}
                    renderItem={renderFilterItem}
                    keyExtractor={(item) => item.id}
                    style={styled.content}
                    contentContainerStyle={[
                        styled.contentContainer,
                        { paddingBottom: insets.bottom + 100 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderListEmpty}
                />
                <View style={[styled.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
                    <Button
                        title="Aplicar"
                        loading={isApplyingFilters}
                        onPress={handleApplyFilters}
                        variant="primary"
                        size="medium"
                        disabled={isApplyingFilters}
                    />
                </View>
            </View>
            <DateRangePicker
                modalizeRef={datePickerRef}
                startDate={filters.dateRange.start}
                endDate={filters.dateRange.end}
                onDateRangeSelected={(start, end) => {
                    setLocalFilters((prev) => ({
                        ...prev,
                        dateRange: { start, end },
                    }));
                }}
            />
        </ScreenWithHeader>
    );
}
