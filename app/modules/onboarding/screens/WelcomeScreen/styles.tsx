import { StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            paddingHorizontal: 24,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 32,
        },
        logoBox: {
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: colors.primary[600],
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 16,
        },
        titleHighlight: {
            color: colors.primary[500],
            fontStyle: 'italic',
        },
        subtitle: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 40,
        },
        stepsContainer: {
            gap: 16,
            marginBottom: 40,
        },
        stepItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        stepIcon: {
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
        },
        stepContent: {
            flex: 1,
        },
        stepTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 4,
        },
        stepSubtitle: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary[600],
            paddingVertical: 16,
            borderRadius: 12,
            gap: 8,
        },
        buttonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });
