import React, { useState, useRef } from 'react';
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
import { AccountPickerModal, AccountOrCard } from '@app/modules/shared/components';
import { CardBrandPickerModal, CardBrand, DayPickerModal } from '../../components';
import { creditCardSchema, type CreditCardFormValues } from '../../schemas/creditCardSchema';
import { createCreditCard } from '../../slices/creditCardApi';
import { styles } from './styles';

export const NewCreditCardScreen: React.FC = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const [cardName, setCardName] = useState('');
    const [usedLimit, setUsedLimit] = useState('');
    const [totalLimit, setTotalLimit] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<AccountOrCard | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<CardBrand | null>(null);
    const [closingDay, setClosingDay] = useState<string | null>(null);
    const [dueDay, setDueDay] = useState<string | null>(null);

    const accountModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const brandModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const closingDayModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const dueDayModalRef = useRef<IHandles>(null) as React.RefObject<IHandles>;
    const scrollViewRef = useRef<ScrollView>(null);

    const { validate, getFieldError, validateField } =
        useFormValidation<CreditCardFormValues>(creditCardSchema);

    const createLoading = useAppSelector((state) => state.creditCard.createLoading);
    const createError = useAppSelector((state) => state.creditCard.createError);

    const accentColor = colors.primary[600];

    const handleBack = () => {
        navigation.goBack();
    };

    const parseCurrencyToNumber = (value: string): number => {
        const cleaned = value.replace(/[^\d,.]/g, '');
        const normalized = cleaned.replace('.', ',');
        return parseFloat(normalized.replace(',', '.')) || 0;
    };

    const handleSave = async () => {
        const formData: CreditCardFormValues = {
            accountId: selectedAccount?.id || '',
            brandId: selectedBrand?.id || '',
            cardName,
            usedLimit,
            totalLimit,
            closingDay: closingDay || '',
            dueDay: dueDay || '',
        };

        const isValid = validate(formData);

        if (!isValid) {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            return;
        }

        try {
            const usedLimitNum = parseCurrencyToNumber(usedLimit);
            const totalLimitNum = parseCurrencyToNumber(totalLimit);

            await dispatch(
                createCreditCard({
                    name: cardName,
                    totalLimit: totalLimitNum,
                    usedLimit: usedLimitNum,
                    brand: selectedBrand!.id,
                    closingDay: parseInt(closingDay!, 10),
                    dueDay: parseInt(dueDay!, 10),
                    accountId:
                        selectedAccount?.type === 'account' ? selectedAccount?.id : undefined,
                }) as any,
            ).unwrap();

            navigation.goBack();
        } catch (error) {}
    };

    const formatCurrency = (value: string) => {
        const cleaned = value.replace(/[^\d,.]/g, '');
        const normalized = cleaned.replace('.', ',');
        const parts = normalized.split(',');
        if (parts.length > 1) {
            return parts[0] + ',' + parts[1].slice(0, 2);
        }
        return normalized;
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
                <Text style={styled.headerTitle}>Novo Cartão</Text>
                <View style={styled.headerButton} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styled.scrollView}
                contentContainerStyle={styled.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styled.formSection}>
                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>
                            Nome do cartão <Text style={styled.required}>*</Text>
                        </Text>
                        <RNTextInput
                            style={[
                                styled.input,
                                cardName &&
                                    !getFieldError('cardName') && {
                                        borderBottomColor: accentColor,
                                    },
                                getFieldError('cardName') && styled.inputError,
                            ]}
                            value={cardName}
                            onChangeText={(text) => {
                                setCardName(text);
                                validateField('cardName', text);
                            }}
                            placeholder="Ex: Cartão Nubank"
                            placeholderTextColor={theme.foregroundMuted}
                        />
                        {getFieldError('cardName') && (
                            <Text style={styled.errorText}>{getFieldError('cardName')}</Text>
                        )}
                    </View>

                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>
                            Limite utilizado <Text style={styled.required}>*</Text>
                        </Text>
                        <View
                            style={[
                                styled.inputWithIcon,
                                usedLimit &&
                                    !getFieldError('usedLimit') && {
                                        borderBottomColor: accentColor,
                                    },
                                getFieldError('usedLimit') && styled.inputError,
                            ]}
                        >
                            <Text style={styled.currencyText}>R$</Text>
                            <RNTextInput
                                style={styled.inputText}
                                value={usedLimit}
                                onChangeText={(text) => {
                                    const formatted = formatCurrency(text);
                                    setUsedLimit(formatted);
                                    validateField('usedLimit', formatted);
                                }}
                                placeholder="0,00"
                                placeholderTextColor={theme.foregroundMuted}
                                keyboardType="numeric"
                            />
                        </View>
                        {getFieldError('usedLimit') && (
                            <Text style={styled.errorText}>{getFieldError('usedLimit')}</Text>
                        )}
                    </View>

                    <View style={styled.inputSection}>
                        <Text style={styled.inputLabel}>
                            Limite total <Text style={styled.required}>*</Text>
                        </Text>
                        <View
                            style={[
                                styled.inputWithIcon,
                                totalLimit &&
                                    !getFieldError('totalLimit') && {
                                        borderBottomColor: accentColor,
                                    },
                                getFieldError('totalLimit') && styled.inputError,
                            ]}
                        >
                            <Text style={styled.currencyText}>R$</Text>
                            <RNTextInput
                                style={styled.inputText}
                                value={totalLimit}
                                onChangeText={(text) => {
                                    const formatted = formatCurrency(text);
                                    setTotalLimit(formatted);
                                    validateField('totalLimit', formatted);
                                }}
                                placeholder="0,00"
                                placeholderTextColor={theme.foregroundMuted}
                                keyboardType="numeric"
                            />
                        </View>
                        {getFieldError('totalLimit') && (
                            <Text style={styled.errorText}>{getFieldError('totalLimit')}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styled.formRow}
                        onPress={() => accountModalRef.current?.open()}
                    >
                        <View style={styled.formRowLeft}>
                            <View
                                style={[styled.iconCircle, { backgroundColor: accentColor + '20' }]}
                            >
                                <Feather name="folder" size={20} color={accentColor} />
                            </View>
                            {selectedAccount ? (
                                <View
                                    style={[
                                        styled.accountPill,
                                        { backgroundColor: selectedAccount.bankColor + '20' },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styled.accountPillText,
                                            { color: selectedAccount.bankColor },
                                        ]}
                                    >
                                        {selectedAccount.bank}
                                    </Text>
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
                                <Text style={styled.formLabel}>Selecione uma conta</Text>
                            )}
                        </View>
                        <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                    {getFieldError('accountId') && (
                        <Text style={styled.errorText}>{getFieldError('accountId')}</Text>
                    )}

                    <TouchableOpacity
                        style={styled.formRow}
                        onPress={() => brandModalRef.current?.open()}
                    >
                        <View style={styled.formRowLeft}>
                            <View
                                style={[
                                    styled.iconCircle,
                                    { backgroundColor: colors.primary[100] },
                                ]}
                            >
                                <Feather name="credit-card" size={20} color={colors.primary[600]} />
                            </View>
                            {selectedBrand ? (
                                <Text style={styled.brandText}>{selectedBrand.name}</Text>
                            ) : (
                                <Text style={styled.formLabel}>Bandeira do cartão</Text>
                            )}
                        </View>
                        <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                    {getFieldError('brandId') && (
                        <Text style={styled.errorText}>{getFieldError('brandId')}</Text>
                    )}

                    <TouchableOpacity
                        style={styled.formRow}
                        onPress={() => closingDayModalRef.current?.open()}
                    >
                        <View style={styled.formRowLeft}>
                            <View
                                style={[styled.iconCircle, { backgroundColor: accentColor + '20' }]}
                            >
                                <Feather name="calendar" size={20} color={accentColor} />
                            </View>
                            {closingDay ? (
                                <Text style={styled.formLabel}>Fecha dia {closingDay}</Text>
                            ) : (
                                <Text style={styled.formLabel}>Fecha dia</Text>
                            )}
                        </View>
                        <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                    {getFieldError('closingDay') && (
                        <Text style={styled.errorText}>{getFieldError('closingDay')}</Text>
                    )}

                    <TouchableOpacity
                        style={styled.formRow}
                        onPress={() => dueDayModalRef.current?.open()}
                    >
                        <View style={styled.formRowLeft}>
                            <View
                                style={[styled.iconCircle, { backgroundColor: accentColor + '20' }]}
                            >
                                <Feather name="calendar" size={20} color={accentColor} />
                            </View>
                            {dueDay ? (
                                <Text style={styled.formLabel}>Vence dia {dueDay}</Text>
                            ) : (
                                <Text style={styled.formLabel}>Vence dia</Text>
                            )}
                        </View>
                        <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                    {getFieldError('dueDay') && (
                        <Text style={styled.errorText}>{getFieldError('dueDay')}</Text>
                    )}
                </View>
            </ScrollView>

            <View style={[styled.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[styled.saveButton, createLoading && styled.saveButtonDisabled]}
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={createLoading}
                >
                    {createLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styled.saveButtonText}>Salvar</Text>
                    )}
                </TouchableOpacity>
                {createError && <Text style={styled.errorText}>{createError}</Text>}
            </View>

            {/* Modals */}
            <AccountPickerModal
                modalizeRef={accountModalRef}
                selectedAccount={selectedAccount}
                onSelect={(item) => {
                    if (item.type === 'account') {
                        setSelectedAccount(item);
                    }
                }}
            />
            <CardBrandPickerModal
                modalizeRef={brandModalRef}
                selectedBrand={selectedBrand}
                onSelect={setSelectedBrand}
            />
            <DayPickerModal
                modalizeRef={closingDayModalRef}
                selectedDay={closingDay}
                onSelect={setClosingDay}
                title="Dia de Fechamento"
                accentColor={accentColor}
            />
            <DayPickerModal
                modalizeRef={dueDayModalRef}
                selectedDay={dueDay}
                onSelect={setDueDay}
                title="Dia de Vencimento"
                accentColor={accentColor}
            />
        </View>
    );
};
