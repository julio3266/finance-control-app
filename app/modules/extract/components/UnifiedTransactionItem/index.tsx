import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import { formatCurrency } from '@app/utils/formatCurrency';
import type { UnifiedTransaction } from '../../slices/extractApi';

interface UnifiedTransactionItemProps {
    transaction: UnifiedTransaction;
}

export const UnifiedTransactionItem: React.FC<UnifiedTransactionItemProps> = ({ transaction }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const isIncome = transaction.type === 'INCOME';
    const formattedAmount = formatCurrency(Math.abs(transaction.amount));
    const formattedDate = new Date(transaction.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const getAccountName = () => {
        if (transaction.account) {
            return transaction.account.name;
        }
        if (transaction.bankAccount) {
            return transaction.bankAccount.name;
        }
        if (transaction.creditCard) {
            return transaction.creditCard.name;
        }
        return transaction.source === 'open_finance' ? 'Open Finance' : 'Manual';
    };

    const getSourceBadge = () => {
        if (transaction.source === 'open_finance') {
            return (
                <View style={[styled.badge, { backgroundColor: colors.primary[100] }]}>
                    <Text style={[styled.badgeText, { color: colors.primary[700] }]}>OF</Text>
                </View>
            );
        }
        return null;
    };

    const categoryIcon = transaction.category?.icon || (isIncome ? '💰' : '💸');
    const categoryColor =
        transaction.category?.color || (isIncome ? colors.success[500] : colors.error[500]);

    return (
        <View
            style={[
                styled.container,
                { backgroundColor: theme.cardBg, borderColor: theme.cardBorder || theme.border },
            ]}
        >
            <View style={[styled.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
                <Text style={styled.iconEmoji}>{categoryIcon}</Text>
            </View>
            <View style={styled.content}>
                <View style={styled.headerRow}>
                    <Text style={styled.description} numberOfLines={1}>
                        {transaction.description}
                    </Text>
                    {getSourceBadge()}
                </View>
                <View style={styled.metaRow}>
                    <Text style={styled.date}>{formattedDate}</Text>
                    <Text style={styled.accountName}>{getAccountName()}</Text>
                </View>
            </View>
            <View style={styled.amountContainer}>
                <Text
                    style={[
                        styled.amount,
                        { color: isIncome ? colors.success[500] : colors.error[500] },
                    ]}
                >
                    {isIncome ? '+' : '-'}
                    {formattedAmount}
                </Text>
                {transaction.isPaid !== undefined && (
                    <View
                        style={[
                            styled.statusBadge,
                            {
                                backgroundColor: transaction.isPaid
                                    ? colors.success[100]
                                    : colors.warning[100],
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styled.statusText,
                                {
                                    color: transaction.isPaid
                                        ? colors.success[700]
                                        : colors.warning[700],
                                },
                            ]}
                        >
                            {transaction.isPaid ? 'Pago' : 'Pendente'}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            marginBottom: 8,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        iconEmoji: {
            fontSize: 20,
        },
        content: {
            flex: 1,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
            gap: 8,
        },
        description: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            flex: 1,
        },
        badge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        badgeText: {
            fontSize: 10,
            fontWeight: '700',
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        date: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        accountName: {
            fontSize: 12,
            color: theme.foregroundMuted,
            fontStyle: 'italic',
        },
        amountContainer: {
            alignItems: 'flex-end',
        },
        amount: {
            fontSize: 14,
            fontWeight: '700',
            marginBottom: 4,
        },
        statusBadge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        statusText: {
            fontSize: 10,
            fontWeight: '600',
        },
    });
