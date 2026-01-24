import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput as RNTextInput,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { IHandles } from 'react-native-modalize/lib/options';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useFormValidation } from '@app/utils/useFormValidation';
import { useAppDispatch, useAppSelector } from '@app/store';
import {
    createFixedIncome,
    createVariableIncome,
    CreateFixedIncomePayload
} from '@app/modules/investiments/slices/investimentsApi';
import { AssetSearchPicker, type AssetSearchResult } from '@app/modules/investiments/components/AssetSearchPicker';
import { BrokerSearchPicker, type InstitutionSearchResult } from '@app/modules/investiments/components/BrokerSearchPicker';
import {
    AccountPickerModal,
    Account,
    AccountOrCard,
    DatePicker,
    InvestmentTypePickerModal,
    InvestmentType,
} from '@app/modules/shared/components';
import { investmentSchema, type InvestmentFormValues } from '../../schemas/investmentSchema';
import { styles } from './styles';

export const NewInvestmentScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const { createLoading } = useAppSelector(
        (state) => state.investments,
    );

    const [investmentType, setInvestmentType] = useState<'fixed' | 'variable'>('fixed');
    const [selectedFixedInvestmentType, setSelectedFixedInvestmentType] =
        useState<InvestmentType | null>(null);
    const [variableIncomeType, setVariableIncomeType] = useState<
        'STOCK' | 'FII' | 'ETF' | 'BDR' | 'CRYPTO'
    >('STOCK');
    const [investmentName, setInvestmentName] = useState('');
    const [broker, setBroker] = useState('');
    const [investedValue, setInvestedValue] = useState('');
    const [purchaseDate, setPurchaseDate] = useState<Date | null>(null);
    const [maturityDate, setMaturityDate] = useState<Date | null>(null);
    const [indexer, setIndexer] = useState('');
    const [rate, setRate] = useState('');
    const [assetSearch, setAssetSearch] = useState('');
    const [ticker, setTicker] = useState('');
    const [assetName, setAssetName] = useState('');
    const [quantity, setQuantity] = useState('100');
    const [averagePrice, setAveragePrice] = useState('R$ 0,00');
    const [currentPrice, setCurrentPrice] = useState('R$ 0,00');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const accountModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const purchaseDateModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const maturityDateModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const investmentTypeModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const assetSearchModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const brokerSearchModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const scrollViewRef = useRef<ScrollView>(null);

    const { validate, getFieldError, validateField } =
        useFormValidation<InvestmentFormValues>(investmentSchema);

    const accentColor = colors?.primary?.[600];

    const handleAssetSelect = useCallback((asset: AssetSearchResult) => {
        setTicker(asset.ticker);
        setAssetName(asset.name);
        setAssetSearch(asset.ticker);

        if (asset.price) {
            const formattedPrice = `R$ ${asset.price.toFixed(2).replace('.', ',')}`;
            setCurrentPrice(formattedPrice);
            setAveragePrice(formattedPrice);
        }

        if (asset.type) {
            const typeMap: Record<string, 'STOCK' | 'FII' | 'ETF' | 'BDR' | 'CRYPTO'> = {
                'ACAO': 'STOCK',
                'FII': 'FII',
                'ETF': 'ETF',
                'BDR': 'BDR',
                'CRYPTO': 'CRYPTO',
            };
            setVariableIncomeType(typeMap[asset.type] || 'STOCK');
        }
    }, []);

    const handleBrokerSelect = useCallback((institution: InstitutionSearchResult) => {
        setBroker(institution.name);
    }, []);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleAccountSelect = (item: AccountOrCard) => {
        if (item.type === 'account') {
            setSelectedAccount(item);
        }
    };

    const handleSave = async () => {
        const formData: InvestmentFormValues = {
            investmentType,
            fixedInvestmentType:
                investmentType === 'fixed' ? selectedFixedInvestmentType?.code : undefined,
            investmentName,
            broker,
            investedValue: investmentType === 'fixed' ? investedValue : '',
            purchaseDate: purchaseDate ? formatDateToISO(purchaseDate) : undefined,
            maturityDate:
                investmentType === 'fixed'
                    ? maturityDate
                        ? formatDateToISO(maturityDate)
                        : undefined
                    : undefined,
            indexer: investmentType === 'fixed' ? indexer || undefined : undefined,
            rate: investmentType === 'fixed' ? rate || undefined : undefined,
            assetSearch: investmentType === 'variable' ? assetSearch || undefined : undefined,
            ticker: investmentType === 'variable' ? ticker || undefined : undefined,
            assetName: investmentType === 'variable' ? assetName || undefined : undefined,
            quantity: investmentType === 'variable' ? quantity || undefined : undefined,
            averagePrice: investmentType === 'variable' ? averagePrice || undefined : undefined,
            currentPrice: investmentType === 'variable' ? currentPrice || undefined : undefined,
            accountId: selectedAccount?.id || null,
        };


        if (validate(formData)) {
            if (investmentType === 'fixed') {
                const payload = {
                    name: investmentName,
                    broker: broker,
                    investedAmount: parseAmount(investedValue),
                    purchaseDate: formatDateToISO(purchaseDate || new Date()),
                    fixedIncomeType: (selectedFixedInvestmentType?.code ||
                        'CDB') as CreateFixedIncomePayload['fixedIncomeType'],
                    ...(maturityDate && { maturityDate: formatDateToISO(maturityDate) }),
                    ...(indexer && { indexer: indexer as CreateFixedIncomePayload['indexer'] }),
                    ...(rate && { rate: parseFloat(rate) }),
                };

                await dispatch(createFixedIncome(payload)).unwrap();
                navigation.goBack();
            } else {
                const apiTypeMap: Record<string, string> = {
                    'STOCK': 'ACAO',
                    'FII': 'FII',
                    'ETF': 'ETF',
                    'BDR': 'BDR',
                    'CRYPTO': 'CRYPTO',
                };

                const payload = {
                    name: assetName || ticker,
                    ticker: ticker,
                    broker: broker,
                    variableIncomeType: apiTypeMap[variableIncomeType] || variableIncomeType,
                    quantity: parseInt(quantity, 10),
                    averagePrice: parseAmount(averagePrice),
                    ...(currentPrice &&
                        currentPrice !== 'R$ 0,00' && {
                        currentPrice: parseAmount(currentPrice),
                    }),
                };

                await dispatch(createVariableIncome(payload)).unwrap();
                navigation.goBack();
            }
        } else {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
    };

    const handleAmountChange = (text: string, setter: (value: string) => void) => {
        const cleaned = text.replace(/[^\d,.]/g, '');
        const normalized = cleaned.replace('.', ',');
        setter(normalized);
    };

    const parseAmount = (value: string): number => {
        const cleaned = value.replace(/[^\d,.]/g, '');
        const normalized = cleaned.replace(/\./g, '').replace(',', '.');
        return parseFloat(normalized) || 0;
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateToISO = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <View style={[styled.container, { backgroundColor: theme.background }]}>
            <StatusBar
                barStyle={theme.foreground === '#f8fafc' ? 'light-content' : 'dark-content'}
            />
            <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={handleBack} style={styled.headerButton}>
                    <Feather name="arrow-left" size={24} color={theme.foreground} />
                </TouchableOpacity>
                <Text style={styled.headerTitle}>Novo Investimento</Text>
                <View style={styled.headerButton} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styled.scrollView}
                contentContainerStyle={[
                    styled.scrollContent,
                    { paddingBottom: insets.bottom + 100 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Investment Type Selector */}
                <View style={styled.typeSelector}>
                    <TouchableOpacity
                        style={[
                            styled.typeButton,
                            investmentType === 'fixed' && styled.typeButtonActive,
                        ]}
                        onPress={() => setInvestmentType('fixed')}
                    >
                        <Feather
                            name="check"
                            size={16}
                            color={investmentType === 'fixed' ? '#ffffff' : theme.foreground}
                        />
                        <Text
                            style={[
                                styled.typeButtonText,
                                investmentType === 'fixed' && styled.typeButtonTextActive,
                            ]}
                        >
                            Renda Fixa
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styled.typeButton,
                            investmentType === 'variable' && styled.typeButtonActive,
                        ]}
                        onPress={() => setInvestmentType('variable')}
                    >
                        <Feather
                            name="trending-up"
                            size={16}
                            color={investmentType === 'variable' ? '#ffffff' : theme.foreground}
                        />
                        <Text
                            style={[
                                styled.typeButtonText,
                                investmentType === 'variable' && styled.typeButtonTextActive,
                            ]}
                        >
                            Renda Variável
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styled.formSection}>
                    {investmentType === 'fixed' ? (
                        <>
                            <TouchableOpacity
                                style={styled.formRow}
                                onPress={() => investmentTypeModalRef.current?.open()}
                            >
                                <Text style={styled.formLabel}>Tipo de Investimento</Text>
                                <View style={styled.formRowRight}>
                                    <Text style={styled.formValue}>
                                        {selectedFixedInvestmentType?.code || 'CDB'}
                                    </Text>
                                    <Feather
                                        name="chevron-down"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styled.separator} />
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>Nome do Investimento</Text>
                                <RNTextInput
                                    style={[
                                        styled.input,
                                        investmentName &&
                                        !getFieldError('investmentName') && {
                                            borderBottomColor: accentColor,
                                        },
                                        getFieldError('investmentName') && styled.inputError,
                                    ]}
                                    value={investmentName}
                                    onChangeText={(text) => {
                                        setInvestmentName(text);
                                        validateField('investmentName', text);
                                    }}
                                    placeholder="Ex: CDB Banco Inter 110% CDI"
                                    placeholderTextColor={theme.foregroundMuted}
                                />
                                {getFieldError('investmentName') && (
                                    <Text style={styled.errorText}>
                                        {getFieldError('investmentName')}
                                    </Text>
                                )}
                            </View>

                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>
                                    Corretora/Banco <Text style={styled.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styled.inputWithIcon,
                                        broker && {
                                            borderBottomColor: accentColor,
                                        },
                                        getFieldError('broker') && styled.inputError,
                                    ]}
                                    onPress={() => brokerSearchModalRef.current?.open()}
                                >
                                    <Text
                                        style={[
                                            styled.inputWithIconText,
                                            broker
                                                ? { color: theme.foreground }
                                                : { color: theme.foregroundMuted },
                                        ]}
                                    >
                                        {broker || 'Selecione uma corretora ou banco...'}
                                    </Text>
                                    <Feather
                                        name="search"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </TouchableOpacity>
                                {getFieldError('broker') && (
                                    <Text style={styled.errorText}>{getFieldError('broker')}</Text>
                                )}
                            </View>

                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>
                                    Valor Investido <Text style={styled.required}>*</Text>
                                </Text>
                                <RNTextInput
                                    style={[
                                        styled.input,
                                        investedValue &&
                                        !getFieldError('investedValue') && {
                                            borderBottomColor: accentColor,
                                        },
                                        getFieldError('investedValue') && styled.inputError,
                                    ]}
                                    value={investedValue}
                                    onChangeText={(text) => {
                                        handleAmountChange(text, setInvestedValue);
                                        validateField('investedValue', text);
                                    }}
                                    placeholder="R$ 0,00"
                                    placeholderTextColor={theme.foregroundMuted}
                                    keyboardType="numeric"
                                />
                                {getFieldError('investedValue') && (
                                    <Text style={styled.errorText}>
                                        {getFieldError('investedValue')}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styled.formRow}
                                onPress={() => purchaseDateModalRef.current?.open()}
                            >
                                <Text style={styled.formLabel}>Data de Compra</Text>
                                <View style={styled.formRowRight}>
                                    <Text style={styled.formValue}>
                                        {purchaseDate ? formatDate(purchaseDate) : 'dd/mm/aaaa'}
                                    </Text>
                                    <Feather
                                        name="calendar"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styled.separator} />

                            <TouchableOpacity
                                style={styled.formRow}
                                onPress={() => maturityDateModalRef.current?.open()}
                            >
                                <Text style={styled.formLabel}>Vencimento</Text>
                                <View style={styled.formRowRight}>
                                    <Text style={styled.formValue}>
                                        {maturityDate ? formatDate(maturityDate) : 'dd/mm/aaaa'}
                                    </Text>
                                    <Feather
                                        name="calendar"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styled.separator} />

                            <TouchableOpacity style={styled.formRow}>
                                <Text style={styled.formLabel}>Indexador</Text>
                                <View style={styled.formRowRight}>
                                    <Text style={styled.formValue}>{indexer || 'CDI'}</Text>
                                    <Feather
                                        name="chevron-down"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styled.separator} />

                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>Taxa</Text>
                                <RNTextInput
                                    style={styled.input}
                                    value={rate}
                                    onChangeText={setRate}
                                    placeholder="100"
                                    placeholderTextColor={theme.foregroundMuted}
                                    keyboardType="numeric"
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Buscar Ativo */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>
                                    Buscar Ativo <Text style={styled.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styled.inputWithIcon,
                                        ticker && {
                                            borderBottomColor: accentColor,
                                        },
                                        getFieldError('ticker') && styled.inputError,
                                    ]}
                                    onPress={() => assetSearchModalRef.current?.open()}
                                >
                                    <Text
                                        style={[
                                            styled.inputWithIconText,
                                            ticker
                                                ? { color: theme.foreground }
                                                : { color: theme.foregroundMuted },
                                        ]}
                                    >
                                        {ticker ? `${ticker} - ${assetName}` : 'Selecione um ativo...'}
                                    </Text>
                                    <Feather
                                        name="search"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </TouchableOpacity>
                                {getFieldError('ticker') && (
                                    <Text style={styled.errorText}>{getFieldError('ticker')}</Text>
                                )}
                            </View>

                            {/* Corretora */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>
                                    Corretora <Text style={styled.required}>*</Text>
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styled.inputWithIcon,
                                        broker && {
                                            borderBottomColor: accentColor,
                                        },
                                        getFieldError('broker') && styled.inputError,
                                    ]}
                                    onPress={() => brokerSearchModalRef.current?.open()}
                                >
                                    <Text
                                        style={[
                                            styled.inputWithIconText,
                                            broker
                                                ? { color: theme.foreground }
                                                : { color: theme.foregroundMuted },
                                        ]}
                                    >
                                        {broker || 'Selecione uma corretora...'}
                                    </Text>
                                    <Feather
                                        name="search"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </TouchableOpacity>
                                {getFieldError('broker') && (
                                    <Text style={styled.errorText}>{getFieldError('broker')}</Text>
                                )}
                            </View>

                            {/* Quantidade */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>
                                    Quantidade <Text style={styled.required}>*</Text>
                                </Text>
                                <RNTextInput
                                    style={[
                                        styled.input,
                                        quantity &&
                                        !getFieldError('quantity') && {
                                            borderBottomColor: accentColor,
                                        },
                                        getFieldError('quantity') && styled.inputError,
                                    ]}
                                    value={quantity}
                                    onChangeText={(text) => {
                                        setQuantity(text);
                                        validateField('quantity', text);
                                    }}
                                    placeholder="100"
                                    placeholderTextColor={theme.foregroundMuted}
                                    keyboardType="numeric"
                                />
                                {getFieldError('quantity') && (
                                    <Text style={styled.errorText}>
                                        {getFieldError('quantity')}
                                    </Text>
                                )}
                            </View>

                            {/* Preço Médio */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>
                                    Preço Médio <Text style={styled.required}>*</Text>
                                </Text>
                                <RNTextInput
                                    style={[
                                        styled.input,
                                        getFieldError('averagePrice') && styled.inputError,
                                    ]}
                                    value={averagePrice}
                                    onChangeText={(text) => {
                                        handleAmountChange(text, setAveragePrice);
                                        validateField('averagePrice', text);
                                    }}
                                    placeholder="R$ 0,00"
                                    placeholderTextColor={theme.foregroundMuted}
                                    keyboardType="numeric"
                                />
                                {getFieldError('averagePrice') && (
                                    <Text style={styled.errorText}>
                                        {getFieldError('averagePrice')}
                                    </Text>
                                )}
                            </View>

                            {/* Preço Atual (opcional) */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>Preço Atual (opcional)</Text>
                                <RNTextInput
                                    style={[
                                        styled.input,
                                        getFieldError('currentPrice') && styled.inputError,
                                    ]}
                                    value={currentPrice}
                                    onChangeText={(text) => {
                                        handleAmountChange(text, setCurrentPrice);
                                        validateField('currentPrice', text);
                                    }}
                                    placeholder="R$ 0,00"
                                    placeholderTextColor={theme.foregroundMuted}
                                    keyboardType="numeric"
                                />
                                {getFieldError('currentPrice') && (
                                    <Text style={styled.errorText}>
                                        {getFieldError('currentPrice')}
                                    </Text>
                                )}
                            </View>

                            {/* Conta (opcional) */}
                            <TouchableOpacity
                                style={styled.formRow}
                                onPress={() => accountModalRef.current?.open()}
                            >
                                <Text style={styled.formLabel}>Conta (opcional)</Text>
                                <View style={styled.formRowRight}>
                                    <Text style={styled.formValue}>
                                        {selectedAccount ? selectedAccount.name : 'Nenhuma'}
                                    </Text>
                                    <Feather
                                        name="chevron-down"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>

            <View
                style={[
                    styled.saveButtonContainer,
                    {
                        paddingBottom: insets.bottom + 16,
                        backgroundColor: theme.background,
                    },
                ]}
            >
                <TouchableOpacity
                    onPress={handleSave}
                    style={[
                        styled.saveButton,
                        { backgroundColor: accentColor },
                        createLoading && { opacity: 0.7 },
                    ]}
                    activeOpacity={0.8}
                    disabled={createLoading}
                >
                    {createLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Feather name="check" size={28} color="#ffffff" />
                    )}
                </TouchableOpacity>
            </View>
            <AccountPickerModal
                selectedAccount={selectedAccount}
                onSelect={handleAccountSelect}
                modalizeRef={accountModalRef}
            />

            <InvestmentTypePickerModal
                modalizeRef={investmentTypeModalRef}
                selectedType={selectedFixedInvestmentType}
                onSelect={setSelectedFixedInvestmentType}
            />

            {/* Asset Search Picker */}
            <AssetSearchPicker
                modalizeRef={assetSearchModalRef}
                onSelect={handleAssetSelect}
            />

            {/* Broker Search Picker */}
            <BrokerSearchPicker
                modalizeRef={brokerSearchModalRef}
                onSelect={handleBrokerSelect}
            />

            {/* Date Pickers */}
            <DatePicker
                modalizeRef={purchaseDateModalRef}
                selectedDate={purchaseDate}
                onSelect={setPurchaseDate}
                accentColor={accentColor}
            />
            <DatePicker
                modalizeRef={maturityDateModalRef}
                selectedDate={maturityDate}
                onSelect={setMaturityDate}
                accentColor={accentColor}
            />
        </View>
    );
};
