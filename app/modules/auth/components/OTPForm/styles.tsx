import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>, themeMode: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        headerButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerButtonRight: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerIcon: {
            fontSize: 24,
            color: theme.foregroundMuted,
            fontWeight: '300',
        },
        scrollContent: {
            padding: 24,
            paddingTop: 32,
        },
        iconContainer: {
            alignItems: 'center',
            marginBottom: 32,
        },
        iconCircle: {
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: colors.primary[600],
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconText: {
            fontSize: 40,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 16,
            color: theme.foregroundSecondary,
            textAlign: 'center',
            marginBottom: 8,
        },
        email: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.primary[600],
            textAlign: 'center',
            marginBottom: 32,
        },
        otpContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 32,
            gap: 12,
        },
        otpInput: {
            flex: 1,
            height: 56,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            borderRadius: 12,
            backgroundColor: theme.inputBg,
            fontSize: 24,
            fontWeight: '600',
            color: theme.foreground,
            textAlign: 'center',
        },
        otpInputFilled: {
            borderColor: colors.primary[600],
            borderWidth: 2,
        },
        resendContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 24,
        },
        resendText: {
            fontSize: 14,
            color: theme.foregroundSecondary,
        },
        resendLink: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary[600],
        },
        errorText: {
            color: colors.error[500],
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 16,
            marginTop: -16,
        },
        otpInputError: {
            borderColor: colors.error[500],
            borderWidth: 2,
        },
    });
