import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        label: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        value: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        valuePositive: {
            color: colors.success[500],
        },
    });
