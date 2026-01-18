import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface QuickActionButtonProps {
    label: string;
    icon: 'income' | 'expense' | 'goal' | 'reports';
    onPress: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label, icon, onPress }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const getIcon = () => {
        const size = 24;
        switch (icon) {
            case 'income':
                return <Feather name="plus" size={size} color={colors.success[500]} />;
            case 'expense':
                return <Feather name="minus" size={size} color={colors.error[500]} />;
            case 'goal':
                return <FontAwesome5 name="bullseye" size={size} color={colors.warning[500]} />;
            case 'reports':
                return <FontAwesome5 name="chart-bar" size={size} color={colors.primary[500]} />;
            default:
                return null;
        }
    };

    const getIconBackground = () => {
        switch (icon) {
            case 'income':
                return theme.background === '#0a0a12' ? colors.success[900] : colors.success[50];
            case 'expense':
                return theme.background === '#0a0a12' ? colors.error[900] : colors.error[50];
            case 'goal':
                return theme.background === '#0a0a12' ? colors.warning[900] : colors.warning[50];
            case 'reports':
                return theme.background === '#0a0a12' ? colors.primary[900] : colors.primary[50];
            default:
                return theme.cardBg;
        }
    };

    return (
        <TouchableOpacity
            style={[styled.button, { backgroundColor: theme.cardBg }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styled.iconContainer, { backgroundColor: getIconBackground() }]}>
                {getIcon()}
            </View>
            <Text style={styled.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        button: {
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.cardBorder,
            minHeight: 100,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            textAlign: 'center',
        },
    });
