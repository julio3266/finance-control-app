import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    StatusBar,
    TextInput as RNTextInput,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { IHandles } from 'react-native-modalize/lib/options';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useFormValidation } from '@app/utils/useFormValidation';
import { useAppDispatch } from '@app/store';
import { createTransaction } from '@app/modules/dashboard/slices/financeApi';
import {
    CategoryPickerModal,
    AccountPickerModal,
    RepeatPicker,
    DatePicker,
    Category,
    AccountOrCard,
} from '@app/modules/shared/components';
import { transactionSchema, type TransactionFormValues } from '../../schemas/transactionSchema';
import { styles } from './styles';

export type TransactionType = 'income' | 'expense';

interface NewTransactionScreenProps {
    type: TransactionType;
}

export const NewTransactionScreen: React.FC<NewTransactionScreenProps> = ({ type }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const styled = styles(theme, type);
    const dispatch = useAppDispatch();

    const [amount, setAmount] = useState('');
    const [isReceived, setIsReceived] = useState(false);
    const [selectedDate, setSelectedDate] = useState<'today' | 'yesterday' | 'other'>('today');
    const [customDate, setCustomDate] = useState<Date | null>(null);
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [repeatCount, setRepeatCount] = useState('2');
    const [repeatPeriod, setRepeatPeriod] = useState<'dias' | 'semanas' | 'meses' | 'anos'>(
        'meses',
    );
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<AccountOrCard | null>(null);

    const categoryModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const accountModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const repeatModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const dateModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const scrollViewRef = useRef<ScrollView>(null);

    const { validate, getFieldError, validateField } =
        useFormValidation<TransactionFormValues>(transactionSchema);

    const isIncome = type === 'income';
    const accentColor = isIncome ? '#059669' : colors?.error?.[500];

    const handleBack = () => {
        navigation.goBack();
    };

    const getTransactionDate = (): Date => {
        const now = new Date();
        switch (selectedDate) {
            case 'today':
                return now;
            case 'yesterday': {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                return yesterday;
            }
            case 'other':
                return customDate || now;
            default:
                return now;
        }
    };

    const formatCurrency = (value: string): string => {
        // Remove tudo que não é dígito
        const numbers = value.replace(/\D/g, '');

        // Se estiver vazio, retorna vazio
        if (!numbers) return '';

        // Converte para número e divide por 100 para ter os centavos
        const amount = parseInt(numbers, 10) / 100;

        // Formata como moeda brasileira
        return amount.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const parseAmountToNumber = (value: string): number => {
        // Remove tudo que não é dígito
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return 0;

        // Converte para número e divide por 100 para ter os centavos
        return parseInt(numbers, 10) / 100;
    };

    const convertRepeatPeriodToFrequency = (
        period: 'dias' | 'semanas' | 'meses' | 'anos',
    ): 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' => {
        switch (period) {
            case 'dias':
                return 'DAILY';
            case 'semanas':
                return 'WEEKLY';
            case 'meses':
                return 'MONTHLY';
            case 'anos':
                return 'YEARLY';
            default:
                return 'MONTHLY';
        }
    };

    const calculateRepetitionEndDate = (
        startDate: Date,
        interval: number,
        frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
        totalRepetitions: number,
    ): Date => {
        const endDate = new Date(startDate);
        const repetitionsToAdd = totalRepetitions - 1;

        switch (frequency) {
            case 'DAILY':
                endDate.setDate(endDate.getDate() + repetitionsToAdd * interval);
                break;
            case 'WEEKLY':
                endDate.setDate(endDate.getDate() + repetitionsToAdd * interval * 7);
                break;
            case 'MONTHLY':
                endDate.setMonth(endDate.getMonth() + repetitionsToAdd * interval);
                break;
            case 'YEARLY':
                endDate.setFullYear(endDate.getFullYear() + repetitionsToAdd * interval);
                break;
        }

        return endDate;
    };

    const handleSave = async () => {
        const formData = {
            amount,
            description,
            isReceived,
            selectedDate,
            isFixed,
            isRepeat,
            repeatCount: isRepeat ? repeatCount : undefined,
            repeatPeriod: isRepeat ? repeatPeriod : undefined,
            categoryId: selectedCategory?.id || null,
            accountId: selectedAccount?.type === 'account' ? selectedAccount?.id || null : null,
            creditCardId:
                selectedAccount?.type === 'creditCard' ? selectedAccount?.id || null : null,
        };

        if (!validate(formData)) {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            return;
        }

        setIsSaving(true);

        try {
            const transactionDate = getTransactionDate();
            const amountNum = parseAmountToNumber(amount);

            const accountId = selectedAccount?.type === 'account' ? selectedAccount?.id : null;
            const creditCardId =
                selectedAccount?.type === 'creditCard' ? selectedAccount?.id : null;

            if (!accountId && !creditCardId) {
                throw new Error('Selecione uma conta ou cartão de crédito');
            }

            // Preparar dados de recorrência
            let repetitionData: {
                isRecurring?: boolean;
                repetitionFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
                repetitionInterval?: number;
                repetitionEndDate?: string | null;
            } = {};

            if (isRepeat) {
                const totalRepetitions = parseInt(repeatCount, 10) || 1;
                const frequency = convertRepeatPeriodToFrequency(repeatPeriod);
                // repetitionInterval sempre é 1 (a cada período escolhido)
                const repetitionInterval = 1;
                const endDate = calculateRepetitionEndDate(
                    transactionDate,
                    repetitionInterval,
                    frequency,
                    totalRepetitions,
                );

                repetitionData = {
                    isRecurring: true,
                    repetitionFrequency: frequency,
                    repetitionInterval,
                    repetitionEndDate: endDate.toISOString(),
                };
            }

            await dispatch(
                createTransaction({
                    type: isIncome ? 'INCOME' : 'EXPENSE',
                    amount: amountNum,
                    description,
                    date: transactionDate.toISOString(),
                    isPaid: isReceived,
                    categoryId: selectedCategory?.id || null,
                    accountId,
                    creditCardId,
                    ...repetitionData,
                }) as any,
            ).unwrap();

            navigation.goBack();
        } catch (error) {
            // Error será tratado pelo middleware de erro
        } finally {
            setIsSaving(false);
        }
    };

    const getTitle = () => (isIncome ? 'Nova Receita' : 'Nova Despesa');

    const getAmountLabel = () => (isIncome ? 'Valor da receita' : 'Valor da despesa');

    const getStatusLabel = () => (isIncome ? 'Já recebi' : 'Já paguei');

    const getFixedLabel = () => (isIncome ? 'Receita fixa' : 'Despesa fixa');

    const handleAmountChange = (text: string) => {
        const formatted = formatCurrency(text);
        setAmount(formatted);
        validateField('amount', formatted);
    };

    const getDateOptions = () => [
        { key: 'today' as const, label: 'Hoje' },
        { key: 'yesterday' as const, label: 'Ontem' },
        { key: 'other' as const, label: 'Outros...' },
    ];

    return (
        <View style={styled.container}>
            <StatusBar
                barStyle={theme.foreground === '#f8fafc' ? 'light-content' : 'dark-content'}
            />
            <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={handleBack} style={styled.headerButton}>
                    <Feather name="arrow-left" size={24} color={theme.foreground} />
                </TouchableOpacity>
                <Text style={styled.headerTitle}>{getTitle()}</Text>
                <View style={styled.headerButtonRight} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styled.scrollView}
                contentContainerStyle={styled.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styled.amountSection}>
                    <Text style={styled.amountLabel}>{getAmountLabel()}</Text>
                    <View style={styled.amountInputContainer}>
                        <Feather
                            name="grid"
                            size={20}
                            color={theme.foregroundMuted}
                            style={styled.amountIcon}
                        />
                        <RNTextInput
                            style={[
                                styled.amountInput,
                                getFieldError('amount') && styled.inputError,
                            ]}
                            value={amount}
                            onChangeText={handleAmountChange}
                            placeholder="R$ 0,00"
                            placeholderTextColor={theme.foregroundMuted}
                            keyboardType="numeric"
                            autoFocus={false}
                        />
                    </View>
                    {getFieldError('amount') && (
                        <Text style={styled.errorText}>{getFieldError('amount')}</Text>
                    )}
                </View>

                <View style={styled.formSection}>
                    <View style={styled.formRow}>
                        <View style={styled.formRowLeft}>
                            <View
                                style={[styled.iconCircle, { backgroundColor: accentColor + '20' }]}
                            >
                                <Feather name="check" size={20} color={accentColor} />
                            </View>
                            <Text style={styled.formLabel}>{getStatusLabel()}</Text>
                        </View>
                        <Switch
                            value={isReceived}
                            onValueChange={setIsReceived}
                            trackColor={{ false: theme.border, true: accentColor }}
                            thumbColor="#ffffff"
                            ios_backgroundColor={theme.border}
                        />
                    </View>

                    <View style={styled.formRow}>
                        <View style={styled.formRowLeft}>
                            <View
                                style={[styled.iconCircle, { backgroundColor: accentColor + '20' }]}
                            >
                                <Feather name="calendar" size={20} color={accentColor} />
                            </View>
                        </View>
                        <View style={styled.dateButtonsContainer}>
                            {getDateOptions().map((option) => (
                                <TouchableOpacity
                                    key={option.key}
                                    onPress={() => {
                                        setSelectedDate(option.key);
                                        if (option.key === 'other') {
                                            setTimeout(() => {
                                                dateModalRef.current?.open();
                                            }, 100);
                                        }
                                    }}
                                    style={[
                                        styled.dateButton,
                                        selectedDate === option.key && {
                                            backgroundColor: accentColor,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styled.dateButtonText,
                                            selectedDate === option.key &&
                                            styled.dateButtonTextActive,
                                        ]}
                                    >
                                        {option.key === 'other' && customDate
                                            ? customDate.toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                            })
                                            : option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styled.descriptionSection}>
                        <Text style={styled.descriptionLabel}>
                            Descrição <Text style={styled.required}>*</Text>
                        </Text>
                        <RNTextInput
                            style={[
                                styled.descriptionInput,
                                getFieldError('description') && styled.inputError,
                            ]}
                            value={description}
                            onChangeText={(text) => {
                                setDescription(text);
                                validateField('description', text);
                            }}
                            placeholder="Adicione uma descrição"
                            placeholderTextColor={theme.foregroundMuted}
                            multiline
                        />
                        {getFieldError('description') && (
                            <Text style={styled.errorText}>{getFieldError('description')}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styled.formRow}
                        onPress={() => categoryModalRef.current?.open()}
                    >
                        <View style={styled.formRowLeft}>
                            <View
                                style={[styled.iconCircle, { backgroundColor: accentColor + '20' }]}
                            >
                                <Feather name="bookmark" size={20} color={accentColor} />
                            </View>
                            {selectedCategory ? (
                                <View
                                    style={[
                                        styled.categoryPill,
                                        { backgroundColor: accentColor + '20' },
                                    ]}
                                >
                                    <Feather
                                        name={selectedCategory.icon as any}
                                        size={16}
                                        color={accentColor}
                                    />
                                    <Text style={[styled.categoryPillText, { color: accentColor }]}>
                                        {selectedCategory.name}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styled.formLabel}>Selecionar categoria</Text>
                            )}
                        </View>
                        <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styled.formRow}
                        onPress={() => accountModalRef.current?.open()}
                    >
                        <View style={styled.formRowLeft}>
                            <View
                                style={[styled.iconCircle, { backgroundColor: accentColor + '20' }]}
                            >
                                <FontAwesome5 name="folder" size={18} color={accentColor} />
                            </View>
                            {selectedAccount ? (
                                <View
                                    style={[
                                        styled.accountPill,
                                        { backgroundColor: selectedAccount.bankColor + '20' },
                                    ]}
                                >
                                    {selectedAccount.type === 'creditCard' && (
                                        <Feather
                                            name="credit-card"
                                            size={14}
                                            color={selectedAccount.bankColor}
                                            style={{ marginRight: 4 }}
                                        />
                                    )}
                                    <Text
                                        style={[
                                            styled.accountPillText,
                                            { color: selectedAccount.bankColor },
                                        ]}
                                    >
                                        {selectedAccount.name}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styled.formLabel}>
                                    {type === 'expense'
                                        ? 'Selecionar conta ou cartão'
                                        : 'Selecionar conta'}
                                </Text>
                            )}
                        </View>
                        <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styled.moreDetailsButton}
                    onPress={() => {
                        setShowMoreDetails(!showMoreDetails);
                        setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    }}
                >
                    <Text style={[styled.moreDetailsText, { color: accentColor }]}>
                        MAIS DETALHES
                    </Text>
                    <Feather
                        name={showMoreDetails ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={accentColor}
                    />
                </TouchableOpacity>

                {showMoreDetails && (
                    <View style={styled.moreDetailsContent}>
                        <TouchableOpacity style={styled.detailRow}>
                            <View style={styled.formRowLeft}>
                                <Feather name="tag" size={20} color={theme.foregroundMuted} />
                                <Text style={styled.detailLabel}>Tags</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                        </TouchableOpacity>
                        <View style={styled.separator} />
                        <View style={styled.detailRow}>
                            <View style={styled.formRowLeft}>
                                <Feather name="star" size={20} color={theme.foregroundMuted} />
                                <Text style={styled.detailLabel}>{getFixedLabel()}</Text>
                            </View>
                            <Switch
                                value={isFixed}
                                onValueChange={setIsFixed}
                                trackColor={{ false: theme.border, true: accentColor }}
                                thumbColor="#ffffff"
                                ios_backgroundColor={theme.border}
                            />
                        </View>
                        <View style={styled.separator} />

                        <View style={styled.detailRow}>
                            <View style={styled.formRowLeft}>
                                <Feather name="repeat" size={20} color={theme.foregroundMuted} />
                                <Text style={styled.detailLabel}>Repetir</Text>
                            </View>
                            <Switch
                                value={isRepeat}
                                onValueChange={(value) => {
                                    setIsRepeat(value);
                                    if (value) {
                                        repeatModalRef.current?.open();
                                    }
                                }}
                                trackColor={{ false: theme.border, true: accentColor }}
                                thumbColor="#ffffff"
                                ios_backgroundColor={theme.border}
                            />
                        </View>
                        {isRepeat && (
                            <View style={styled.repeatDetails}>
                                <View style={styled.repeatInputRow}>
                                    <Text style={styled.repeatText}>{repeatCount} vezes</Text>
                                    <TouchableOpacity
                                        style={styled.repeatPeriodButton}
                                        onPress={() => repeatModalRef.current?.open()}
                                    >
                                        <Text style={styled.repeatPeriodText}>
                                            {repeatPeriod === 'dias'
                                                ? 'Diário'
                                                : repeatPeriod === 'semanas'
                                                    ? 'Semanal'
                                                    : repeatPeriod === 'meses'
                                                        ? 'Mensal'
                                                        : 'Anual'}
                                        </Text>
                                        <Feather
                                            name="chevron-down"
                                            size={16}
                                            color={theme.foregroundMuted}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
            <View style={[styled.saveButtonContainer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styled.saveButton, { backgroundColor: accentColor }]}
                    activeOpacity={0.8}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Feather name="check" size={28} color="#ffffff" />
                    )}
                </TouchableOpacity>
            </View>

            <CategoryPickerModal
                type={type}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                modalizeRef={categoryModalRef}
            />

            <AccountPickerModal
                selectedAccount={selectedAccount}
                onSelect={setSelectedAccount}
                modalizeRef={accountModalRef}
                showCreditCards={type === 'expense'}
            />

            <RepeatPicker
                modalizeRef={repeatModalRef}
                repeatCount={repeatCount}
                repeatPeriod={repeatPeriod}
                onSave={(count, period) => {
                    setRepeatCount(count);
                    setRepeatPeriod(period);
                }}
                accentColor={accentColor}
            />

            {selectedDate === 'other' && (
                <DatePicker
                    modalizeRef={dateModalRef}
                    selectedDate={customDate}
                    onSelect={(date) => {
                        setCustomDate(date);
                    }}
                    accentColor={accentColor}
                />
            )}
        </View>
    );
};
