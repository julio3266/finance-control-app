import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';
import type { Theme } from '@app/utils/useTheme';

export const styles = (theme: Theme) =>
    StyleSheet.create({
        bottomSheet: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
        },
        handle: {
            backgroundColor: theme.border,
            width: 40,
            height: 4,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            padding: 24,
            gap: 16,
        },
        iconContainer: {
            alignItems: 'center',
            marginBottom: 8,
        },
        iconCircle: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: `${colors.error[500]}15`,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
        },
        message: {
            fontSize: 15,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 22,
        },
        connectionName: {
            fontWeight: '600',
            color: theme.foreground,
        },
        warning: {
            fontSize: 13,
            color: colors.warning[500],
            textAlign: 'center',
            fontStyle: 'italic',
        },
        buttonsContainer: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 8,
        },
        button: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cancelButton: {
            backgroundColor: theme.backgroundTertiary,
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        deleteButton: {
            backgroundColor: colors.error[500],
        },
        deleteButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });
