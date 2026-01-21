import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput as RNTextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { IHandles } from 'react-native-modalize/lib/options';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useFormValidation } from '@app/utils/useFormValidation';
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
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const [investmentType, setInvestmentType] = useState<'fixed' | 'variable'>('fixed');
    const [selectedFixedInvestmentType, setSelectedFixedInvestmentType] =
        useState<InvestmentType | null>(null);
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
    const scrollViewRef = useRef<ScrollView>(null);

    const { validate, getFieldError, validateField } =
        useFormValidation<InvestmentFormValues>(investmentSchema);

    const accentColor = colors?.primary?.[600];

    const handleBack = () => {
        navigation.goBack();
    };

    const handleAccountSelect = (item: AccountOrCard) => {
        if (item.type === 'account') {
            setSelectedAccount(item);
        }
    };

    const handleSave = () => {
        const formData: InvestmentFormValues = {
            investmentType,
            fixedInvestmentType:
                investmentType === 'fixed' ? selectedFixedInvestmentType?.code : undefined,
            investmentName,
            broker,
            investedValue: investmentType === 'fixed' ? investedValue : '',
            purchaseDate: purchaseDate ? formatDate(purchaseDate) : undefined,
            maturityDate:
                investmentType === 'fixed'
                    ? maturityDate
                        ? formatDate(maturityDate)
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
        } else {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
    };

    const handleAmountChange = (text: string, setter: (value: string) => void) => {
        const cleaned = text.replace(/[^\d,.]/g, '');
        const normalized = cleaned.replace('.', ',');
        setter(normalized);
    };

    const formatDate = (date: Date | null): string => {
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                                <View
                                    style={[
                                        styled.inputWithIcon,
                                        broker &&
                                            !getFieldError('broker') && {
                                                borderBottomColor: accentColor,
                                            },
                                        getFieldError('broker') && styled.inputError,
                                    ]}
                                >
                                    <RNTextInput
                                        style={styled.inputWithIconText}
                                        value={broker}
                                        onChangeText={(text) => {
                                            setBroker(text);
                                            validateField('broker', text);
                                        }}
                                        placeholder="Ex: Inter, XP, Nubank..."
                                        placeholderTextColor={theme.foregroundMuted}
                                    />
                                    <Feather
                                        name="search"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </View>
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
                                <Text style={styled.inputLabel}>Buscar Ativo</Text>
                                <RNTextInput
                                    style={styled.input}
                                    value={assetSearch}
                                    onChangeText={setAssetSearch}
                                    placeholder="Digite o ticker ou nome do ativo..."
                                    placeholderTextColor={theme.foregroundMuted}
                                />
                            </View>

                            {/* Ticker */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>Ticker</Text>
                                <RNTextInput
                                    style={styled.input}
                                    value={ticker}
                                    onChangeText={setTicker}
                                    placeholder="Ex: PETR4"
                                    placeholderTextColor={theme.foregroundMuted}
                                />
                            </View>

                            {/* Nome do Ativo */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>Nome do Ativo</Text>
                                <RNTextInput
                                    style={styled.input}
                                    value={assetName}
                                    onChangeText={setAssetName}
                                    placeholder="Ex: Petrobras PN"
                                    placeholderTextColor={theme.foregroundMuted}
                                />
                            </View>

                            {/* Corretora */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>
                                    Corretora <Text style={styled.required}>*</Text>
                                </Text>
                                <View
                                    style={[
                                        styled.inputWithIcon,
                                        broker &&
                                            !getFieldError('broker') && {
                                                borderBottomColor: accentColor,
                                            },
                                        getFieldError('broker') && styled.inputError,
                                    ]}
                                >
                                    <RNTextInput
                                        style={styled.inputWithIconText}
                                        value={broker}
                                        onChangeText={(text) => {
                                            setBroker(text);
                                            validateField('broker', text);
                                        }}
                                        placeholder="Ex: XP, Clear, Rico..."
                                        placeholderTextColor={theme.foregroundMuted}
                                    />
                                    <Feather
                                        name="search"
                                        size={20}
                                        color={theme.foregroundMuted}
                                    />
                                </View>
                                {getFieldError('broker') && (
                                    <Text style={styled.errorText}>{getFieldError('broker')}</Text>
                                )}
                            </View>

                            {/* Quantidade */}
                            <View style={styled.inputSection}>
                                <Text style={styled.inputLabel}>Quantidade</Text>
                                <RNTextInput
                                    style={styled.input}
                                    value={quantity}
                                    onChangeText={setQuantity}
                                    placeholder="100"
                                    placeholderTextColor={theme.foregroundMuted}
                                    keyboardType="numeric"
                                />
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
                                    style={styled.input}
                                    value={currentPrice}
                                    onChangeText={(text) => {
                                        handleAmountChange(text, setCurrentPrice);
                                    }}
                                    placeholder="R$ 0,00"
                                    placeholderTextColor={theme.foregroundMuted}
                                    keyboardType="numeric"
                                />
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
                    style={[styled.saveButton, { backgroundColor: accentColor }]}
                    activeOpacity={0.8}
                >
                    <Feather name="check" size={28} color="#ffffff" />
                </TouchableOpacity>
            </View>

            {/* Account Picker Modal */}
            <AccountPickerModal
                selectedAccount={selectedAccount}
                onSelect={handleAccountSelect}
                modalizeRef={accountModalRef}
            />

            {/* Investment Type Picker Modal */}
            <InvestmentTypePickerModal
                modalizeRef={investmentTypeModalRef}
                selectedType={selectedFixedInvestmentType}
                onSelect={setSelectedFixedInvestmentType}
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
