import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        content: {
            padding: 20,
            flexGrow: 1,
        },
        monthSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            gap: 16,
        },
        monthArrow: {
            padding: 8,
        },
        monthText: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
            minWidth: 100,
            textAlign: 'center',
        },
        balanceContainer: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 24,
        },
        balanceCard: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 12,
            alignItems: 'center',
            gap: 10,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        balanceIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.background === '#0a0a12'
                ? colors.primary[900]
                : colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
        },
        balanceContent: {
            flex: 1,
        },
        balanceLabel: {
            fontSize: 11,
            color: theme.foregroundMuted,
            marginBottom: 2,
        },
        balanceValue: {
            fontSize: 14,
            fontWeight: '700',
        },
        negativeValue: {
            color: colors.error[600],
        },
    });

