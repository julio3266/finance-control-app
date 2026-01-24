import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';

interface BalanceCardProps {
    totalBalance: string;
    income: string;
    expenses: string;
    onMorePress?: () => void;
    hideValues?: boolean;
    onToggleHideValues?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
    totalBalance,
    income,
    expenses,
    onMorePress,
    hideValues = false,
    onToggleHideValues,
}) => {
    const styled = styles();

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
                    </View>
                    <View style={styled.headerActions}>
                        {onToggleHideValues && (
                            <TouchableOpacity
                                onPress={onToggleHideValues}
                                activeOpacity={0.7}
                                style={styled.actionButton}
                            >
                                <Feather
                                    name={hideValues ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#ffffff"
                                />
                            </TouchableOpacity>
                        )}
                        {onMorePress && (
                            <TouchableOpacity
                                onPress={onMorePress}
                                activeOpacity={0.7}
                                style={styled.actionButton}
                            >
                                <Feather name="more-horizontal" size={24} color="#ffffff" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <Text style={styled.balanceValue}>{totalBalance}</Text>

                <View style={styled.footer}>
                    <View style={[styled.footerItem, styled.footerItemFirst]}>
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

                    <View style={[styled.footerItem, styled.footerItemLast]}>
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

const styles = () =>
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
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        actionButton: {
            padding: 4,
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
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        footerItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            flex: 1,
        },
        footerItemFirst: {
            marginRight: 16,
        },
        footerItemLast: {
            marginRight: 0,
        },
        iconCircle: {
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
        footerTextContainer: {
            flex: 1,
            minWidth: 0,
        },
        footerLabel: {
            fontSize: 11,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 2,
        },
        footerValue: {
            fontSize: 13,
            fontWeight: '600',
            color: '#ffffff',
        },
    });
