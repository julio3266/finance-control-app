import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        leftSection: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        iconContainer: {
            marginRight: 12,
        },
        iconBackground: {
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconGraph: {
            width: 20,
            height: 14,
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 2,
        },
        iconGraphLine: {
            backgroundColor: colors.error[500],
            borderRadius: 1,
            width: 3,
        },
        iconGraphLine1: {
            height: 4,
        },
        iconGraphLine2: {
            height: 8,
        },
        iconGraphLine3: {
            height: 6,
        },
        infoContainer: {
            flex: 1,
        },
        ticker: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 4,
        },
        broker: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        rightSection: {
            alignItems: 'flex-end',
        },
        valueContainer: {
            alignItems: 'flex-end',
            marginBottom: 8,
        },
        currentValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 4,
        },
        returnText: {
            fontSize: 12,
            fontWeight: '500',
            color: colors.success[500],
        },
        actionsContainer: {
            flexDirection: 'row',
            gap: 12,
        },
        actionButton: {
            padding: 4,
        },
    });
