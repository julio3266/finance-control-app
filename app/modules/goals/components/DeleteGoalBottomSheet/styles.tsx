import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        bottomSheet: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            marginTop: 8,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            padding: 24,
        },
        iconContainer: {
            alignItems: 'center',
            marginBottom: 24,
        },
        iconCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.error[50],
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 12,
        },
        message: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
        },
        goalName: {
            fontWeight: '600',
            color: theme.foreground,
        },
        buttonsContainer: {
            flexDirection: 'row',
            gap: 12,
        },
        button: {
            flex: 1,
            paddingVertical: 16,
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

