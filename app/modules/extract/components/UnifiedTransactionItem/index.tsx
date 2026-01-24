import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { formatCurrency } from '@app/utils/formatCurrency';
import type { UnifiedTransaction } from '../../slices/extractApi';
import { styles } from './styles';

interface UnifiedTransactionItemProps {
    transaction: UnifiedTransaction;
}

export const UnifiedTransactionItem: React.FC<UnifiedTransactionItemProps> = ({ transaction }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const isIncome = transaction.type === 'INCOME';
    const amount = typeof transaction.amount === 'number' && !isNaN(transaction.amount) ? transaction.amount : 0;
    const formattedAmount = formatCurrency(Math.abs(amount));
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
            <View style={styled.content}>
                <View style={styled.headerRow}>
                    <Text style={styled.description} numberOfLines={1}>
                        {transaction.description}
                    </Text>

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
            </View>
        </View>
    );
};

