import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            marginBottom: 16,
        },
        title: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 16,
        },
        list: {
            gap: 12,
        },
        item: {
            marginBottom: 20,
        },
        itemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        itemType: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
        },
        itemPercentage: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        itemContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        itemValue: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
        },
        itemProfitability: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.success[500],
        },
        barContainer: {
            height: 6,
            backgroundColor: theme.backgroundTertiary,
            borderRadius: 3,
            overflow: 'hidden',
        },
        bar: {
            height: '100%',
            borderRadius: 3,
        },
    });
