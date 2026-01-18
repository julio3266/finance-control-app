import { StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: 24,
            paddingBottom: 40,
        },
        stepsIndicator: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 32,
        },
        stepBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBg,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            gap: 8,
        },
        stepBadgeActive: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary[600],
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            gap: 8,
        },
        stepNumber: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
        },
        stepNumberInactive: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
        },
        stepLabel: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        stepLabelActive: {
            fontSize: 14,
            fontWeight: '500',
            color: '#ffffff',
        },
        iconContainer: {
            alignItems: 'center',
            marginBottom: 24,
        },
        iconBox: {
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginBottom: 32,
        },
        form: {
            gap: 20,
            marginBottom: 32,
        },
        row: {
            flexDirection: 'row',
            gap: 12,
        },
        halfInput: {
            flex: 1,
        },
        streetInput: {
            flex: 3,
        },
        numberInput: {
            flex: 1,
        },
        cityInput: {
            flex: 3,
        },
        stateInput: {
            flex: 1,
        },
        inputGroup: {},
        cepInputContainer: {
            position: 'relative',
        },
        cepLoader: {
            position: 'absolute',
            right: 16,
            top: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
            marginBottom: 8,
        },
        required: {
            color: colors.error[500],
        },
        buttonsContainer: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 16,
        },
        backButton: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: theme.cardBg,
        },
        backButtonText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.foreground,
        },
        continueButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary[600],
            paddingVertical: 16,
            borderRadius: 12,
            gap: 8,
        },
        continueButtonDisabled: {
            opacity: 0.5,
        },
        continueButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        requiredNote: {
            fontSize: 14,
            color: theme.foregroundMuted,
            textAlign: 'center',
        },
    });
