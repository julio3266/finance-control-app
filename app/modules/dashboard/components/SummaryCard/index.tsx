import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: 'balance' | 'income' | 'expense' | 'goals';
    iconColor?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, iconColor }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const getIcon = () => {
        const size = 24;
        const color = iconColor || colors.primary[600];
        switch (icon) {
            case 'balance':
                return <Feather name="credit-card" size={size} color={color} />;
            case 'income':
                return <Feather name="arrow-up" size={size} color={colors.success[500]} />;
            case 'expense':
                return <Feather name="arrow-down" size={size} color={colors.error[500]} />;
            case 'goals':
                return <FontAwesome5 name="bullseye" size={size} color={colors.warning[500]} />;
            default:
                return null;
        }
    };

    const getIconBackground = () => {
        switch (icon) {
            case 'balance':
                return theme.background === '#0a0a12' ? colors.primary[900] : colors.primary[50];
            case 'income':
                return theme.background === '#0a0a12' ? colors.success[900] : colors.success[50];
            case 'expense':
                return theme.background === '#0a0a12' ? colors.error[900] : colors.error[50];
            case 'goals':
                return theme.background === '#0a0a12' ? colors.warning[900] : colors.warning[50];
            default:
                return theme.cardBg;
        }
    };

    return (
        <View style={[styled.card, { backgroundColor: theme.cardBg }]}>
            <View style={[styled.iconContainer, { backgroundColor: getIconBackground() }]}>
                {getIcon()}
            </View>
            <Text style={styled.title}>{title}</Text>
            <Text style={styled.value}>{value}</Text>
        </View>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        card: {
            flex: 1,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            minWidth: 140,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
        },
        title: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginBottom: 4,
        },
        value: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
    });
