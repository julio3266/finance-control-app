import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface TransactionItemProps {
    description: string;
    date: string;
    amount: string;
    type: 'income' | 'expense';
    icon?: React.ReactNode;
    iconColor?: string;
    iconBg?: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
    description,
    date,
    amount,
    type,
    icon,
    iconColor,
    iconBg,
}) => {
    const theme = useTheme();
    const styled = styles(theme);

    const defaultIcon = icon || (
        <Feather
            name={type === 'income' ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={iconColor || (type === 'income' ? colors.success[500] : colors.error[500])}
        />
    );

    const backgroundColor = iconBg || (type === 'income' ? colors.success[50] : colors.error[50]);

    return (
        <View
            style={[
                styled.container,
                { backgroundColor: theme.cardBg, borderColor: theme.cardBorder || theme.border },
            ]}
        >
            <View style={[styled.iconContainer, { backgroundColor }]}>{defaultIcon}</View>
            <View style={styled.content}>
                <Text style={styled.description}>{description}</Text>
                <Text style={styled.date}>{date}</Text>
            </View>
            <Text
                style={[
                    styled.amount,
                    { color: type === 'income' ? colors.success[500] : colors.error[500] },
                ]}
            >
                {type === 'income' ? '+' : '-'}
                {amount}
            </Text>
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
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        content: {
            flex: 1,
        },
        description: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 4,
        },
        date: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        amount: {
            fontSize: 14,
            fontWeight: '700',
        },
    });
