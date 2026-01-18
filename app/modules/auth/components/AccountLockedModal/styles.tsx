import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        modalContainer: {
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 20,
            width: '100%',
            maxWidth: 400,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 16,
            paddingTop: 12,
        },
        closeButton: {
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
        },
        closeIcon: {
            fontSize: 20,
            color: theme.foregroundMuted,
        },
        content: {
            padding: 24,
            alignItems: 'center',
        },
        iconContainer: {
            width: 64,
            height: 64,
            borderRadius: 12,
            backgroundColor: colors.error[50],
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 12,
        },
        message: {
            fontSize: 14,
            color: theme.foregroundSecondary,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 20,
        },
        timerContainer: {
            backgroundColor: colors.error[50],
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 24,
            marginBottom: 16,
            alignItems: 'center',
        },
        timer: {
            fontSize: 32,
            fontWeight: '700',
            color: colors.error[600],
            marginBottom: 4,
        },
        timerLabel: {
            fontSize: 12,
            color: colors.error[600],
            fontWeight: '500',
        },
        progressBarContainer: {
            width: '100%',
            height: 4,
            backgroundColor: theme.border,
            borderRadius: 2,
            overflow: 'hidden',
            marginBottom: 16,
        },
        progressBar: {
            height: '100%',
            backgroundColor: colors.error[600],
            borderRadius: 2,
        },
        securityMessage: {
            fontSize: 12,
            color: theme.foregroundMuted,
            textAlign: 'center',
        },
    });
