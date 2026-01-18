import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface AccountCardProps {
    accountName: string;
    bank: string;
    balance: string;
}

export const AccountCard: React.FC<AccountCardProps> = ({ accountName, bank, balance }) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={[styled.card, { backgroundColor: theme.cardBg }]}>
            <View
                style={[
                    styled.iconContainer,
                    {
                        backgroundColor:
                            theme.background === '#0a0a12'
                                ? colors.primary[900]
                                : colors.primary[50],
                    },
                ]}
            >
                <FontAwesome5 name="university" size={20} color={colors.primary[600]} />
            </View>
            <View style={styled.content}>
                <Text style={styled.accountName}>{accountName}</Text>
                <Text style={styled.bank}>{bank}</Text>
            </View>
            <Text style={styled.balance}>{balance}</Text>
        </View>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        card: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            marginBottom: 12,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        content: {
            flex: 1,
        },
        accountName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 4,
        },
        bank: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        balance: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },
    });
