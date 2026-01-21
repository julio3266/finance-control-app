import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput as RNTextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme, useThemeMode } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchAccounts, AccountResponse } from '@app/modules/accounts/slices/accountsApi';
import {
    fetchCreditCards,
    CreditCardResponse,
} from '@app/modules/credit-card/slices/creditCardApi';
import { styles } from './styles';

export interface Account {
    id: string;
    name: string;
    bank: string;
    bankColor: string;
    bankIcon?: string;
    type: 'account';
}

export interface CreditCard {
    id: string;
    name: string;
    bank: string;
    bankColor: string;
    brandIconUrl?: string | null;
    type: 'creditCard';
}

export type AccountOrCard = Account | CreditCard;

interface AccountPickerProps {
    selectedAccount?: AccountOrCard | null;
    onSelect: (account: AccountOrCard) => void;
    showCreditCards?: boolean;
}

interface AccountPickerModalProps extends AccountPickerProps {
    modalizeRef: React.RefObject<IHandles>;
}

export const AccountPickerModal: React.FC<AccountPickerModalProps> = ({
    selectedAccount,
    onSelect,
    modalizeRef,
    showCreditCards = false,
}) => {
    const theme = useTheme();
    const themeMode = useThemeMode();
    const insets = useSafeAreaInsets();
    const isDark = themeMode === 'dark';
    const styled = styles(theme, isDark);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');

    const accountsResponse = useAppSelector((state) => state.accounts.accounts);
    const accountsLoading = useAppSelector((state) => state.accounts.loading);
    const creditCardsResponse = useAppSelector((state) => state.creditCard.cards);
    const creditCardsLoading = useAppSelector((state) => state.creditCard.cardsLoading);

    useEffect(() => {
        dispatch(fetchAccounts({ excludeInvestment: true }) as any);
        if (showCreditCards) {
            dispatch(fetchCreditCards() as any);
        }
    }, [dispatch, showCreditCards]);

    const accounts: Account[] = accountsResponse.map((acc: AccountResponse) => ({
        id: acc.id,
        name: acc.name,
        bank: acc.institution,
        bankColor: acc.color,
        bankIcon: acc.institutionLogo,
        type: 'account' as const,
    }));

    const allItems: AccountOrCard[] = useMemo(() => {
        const creditCards: CreditCard[] = showCreditCards
            ? creditCardsResponse
                  .filter((card: CreditCardResponse) => card.isActive)
                  .map((card: CreditCardResponse) => ({
                      id: card.id,
                      name: card.name,
                      bank: card.name, // Usar o nome do cartão como "banco"
                      bankColor: colors.primary[600],
                      type: 'creditCard' as const,
                  }))
            : [];

        return [...accounts, ...creditCards];
    }, [accounts, creditCardsResponse, showCreditCards]);

    const filteredItems = allItems.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.bank.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const isLoading = accountsLoading || (showCreditCards && creditCardsLoading);

    const handleSelect = (item: AccountOrCard) => {
        onSelect(item);
        modalizeRef.current?.close();
    };

    const getBankInitials = (bank: string) =>
        bank
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

    return (
        <Modalize
            ref={modalizeRef}
            modalStyle={styled.modal}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            adjustToContentHeight
        >
            <View style={[styled.content, { paddingBottom: insets.bottom }]}>
                <View style={styled.searchContainer}>
                    <Feather name="search" size={20} color={theme.foregroundMuted} />
                    <RNTextInput
                        style={styled.searchInput}
                        placeholder={
                            showCreditCards ? 'Pesquisar conta ou cartão' : 'Pesquisar conta'
                        }
                        placeholderTextColor={theme.foregroundMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView style={styled.listContainer} showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <View style={styled.loadingContainer}>
                            <ActivityIndicator size="large" color={colors.primary[600]} />
                        </View>
                    ) : (
                        filteredItems.map((item) => {
                            const isSelected = selectedAccount?.id === item.id;
                            const isCreditCard = item.type === 'creditCard';
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styled.accountItem}
                                    onPress={() => handleSelect(item)}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styled.accountIcon,
                                            { backgroundColor: item.bankColor + '20' },
                                        ]}
                                    >
                                        {isCreditCard ? (
                                            <Feather
                                                name="credit-card"
                                                size={18}
                                                color={item.bankColor}
                                            />
                                        ) : (
                                            <Text
                                                style={[
                                                    styled.accountIconText,
                                                    { color: item.bankColor },
                                                ]}
                                            >
                                                {getBankInitials(item.bank)}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styled.accountInfo}>
                                        <Text style={styled.accountName}>{item.name}</Text>
                                        <View style={styled.accountTypeRow}>
                                            <Text style={styled.accountBank}>{item.bank}</Text>
                                            {isCreditCard && (
                                                <View style={styled.typeBadge}>
                                                    <Text style={styled.typeBadgeText}>Cartão</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                    {isSelected ? (
                                        <Feather
                                            name="check"
                                            size={20}
                                            color={colors.success[500]}
                                        />
                                    ) : (
                                        <View style={styled.radioButton} />
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>

                <View style={styled.actionsContainer}>
                    <TouchableOpacity
                        style={styled.actionItem}
                        onPress={() => modalizeRef.current?.close()}
                    >
                        <Feather name="settings" size={20} color={theme.foregroundMuted} />
                        <Text style={styled.actionText}>Gerenciar contas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styled.actionItem}
                        onPress={() => modalizeRef.current?.close()}
                    >
                        <View style={styled.addIconContainer}>
                            <Feather name="plus" size={20} color={theme.foreground} />
                        </View>
                        <Text style={styled.actionText}>Adicionar nova conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modalize>
    );
};
