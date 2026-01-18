import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';

interface BalanceCardProps {
    totalBalance: string;
    income: string;
    expenses: string;
    onMorePress?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    totalBalance,
    income,
    expenses,
    onMorePress,
}) => {
    const theme = useTheme();
    const styled = styles(theme);

    const gradientColors: [string, string, string] = ['#FF6B6B', '#8B5CF6', '#6C5CE7'];

    return (
        <View style={styled.container}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styled.gradient}
            >
                <View style={styled.header}>
                    <View style={styled.balanceHeader}>
                        <Text style={styled.balanceLabel}>Saldo Total</Text>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Feather name="chevron-down" size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                    {onMorePress && (
                        <TouchableOpacity onPress={onMorePress} activeOpacity={0.7}>
                            <Feather name="more-horizontal" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styled.balanceValue}>{totalBalance}</Text>

                <View style={styled.footer}>
                    <View style={styled.footerItem}>
                        <View
                            style={[
                                styled.iconCircle,
                                { backgroundColor: 'rgba(255,255,255,0.2)' },
                            ]}
                        >
                            <Feather name="arrow-down" size={16} color="#ffffff" />
                        </View>
                        <View style={styled.footerTextContainer}>
                            <Text style={styled.footerLabel}>Receitas totais</Text>
                            <Text style={styled.footerValue}>{income}</Text>
                        </View>
                    </View>

                    <View style={styled.footerItem}>
                        <View
                            style={[
                                styled.iconCircle,
                                { backgroundColor: 'rgba(255,255,255,0.2)' },
                            ]}
                        >
                            <Feather name="arrow-up" size={16} color="#ffffff" />
                        </View>
                        <View style={styled.footerTextContainer}>
                            <Text style={styled.footerLabel}>Despesas totais</Text>
                            <Text style={styled.footerValue}>{expenses}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            marginBottom: 24,
            borderRadius: 24,
            overflow: 'hidden',
        },
        gradient: {
            padding: 24,
            borderRadius: 24,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        balanceHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        balanceLabel: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500',
        },
        balanceValue: {
            fontSize: 36,
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: 24,
        },
        footer: {
            flexDirection: 'row',
            gap: 24,
        },
        footerItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        iconCircle: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        footerTextContainer: {
            gap: 4,
        },
        footerLabel: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
        },
        footerValue: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });
