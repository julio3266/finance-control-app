import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import { AccountItem, type UnifiedAccount } from '../AccountItem';
import { styles } from './styles';

interface AccountsCardProps {
    accounts: UnifiedAccount[];
    onAccountPress?: (account: UnifiedAccount) => void;
    onAddAccount?: () => void;
    maxItems?: number;
}

export const AccountsCard: React.FC<AccountsCardProps> = ({
    accounts,
    onAccountPress,
    onAddAccount,
    maxItems = 5,
}) => {
    const theme = useTheme();
    const styled = styles(theme);

    const displayedAccounts = accounts.slice(0, maxItems);

    if (accounts.length === 0) {
        return (
            <View style={styled.container}>
                <View style={styled.emptyContainer}>
                    <Feather name="credit-card" size={32} color={theme.foregroundMuted} />
                    <Text style={styled.emptyText}>Nenhuma conta cadastrada</Text>
                    <TouchableOpacity
                        style={styled.addButton}
                        onPress={onAddAccount}
                        activeOpacity={0.7}
                    >
                        <Feather name="plus" size={16} color={colors.primary[600]} />
                        <Text style={styled.addButtonText}>Adicionar conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styled.container}>
            {displayedAccounts.map((account, index) => (
                <View key={account.id}>
                    <AccountItem
                        account={account}
                        onPress={() => onAccountPress?.(account)}
                    />
                    {index < displayedAccounts.length - 1 && <View style={styled.divider} />}
                </View>
            ))}
        </View>
    );
};
