import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 16,
        },
        headerButton: {
            padding: 8,
            minWidth: 40,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
            flex: 1,
            textAlign: 'center',
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 100,
        },
        formSection: {
            marginTop: 24,
            gap: 20,
        },
        formRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
        },
        formRowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: 12,
        },
        iconCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
        },
        formLabel: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
        },
        accountPill: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },
        accountPillText: {
            fontSize: 14,
            fontWeight: '600',
        },
        brandPill: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },
        brandPillText: {
            fontSize: 14,
            fontWeight: '600',
        },
        brandText: {
            fontSize: 16,
            color: theme.foregroundMuted,
            fontWeight: '500',
        },
        inputSection: {
            marginTop: 8,
        },
        inputLabel: {
            fontSize: 14,
            color: theme.foregroundSecondary,
            marginBottom: 8,
        },
        required: {
            color: colors.error[500],
        },
        input: {
            fontSize: 16,
            color: theme.foreground,
            paddingVertical: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        inputWithIcon: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        currencyText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.foreground,
            marginRight: 8,
        },
        inputText: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
            paddingVertical: 8,
        },
        inputError: {
            borderBottomColor: colors.error[500],
        },
        errorText: {
            fontSize: 12,
            color: colors.error[500],
            marginTop: 4,
        },
        footer: {
            paddingHorizontal: 20,
            paddingTop: 16,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        saveButton: {
            backgroundColor: colors.primary[600],
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        saveButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        saveButtonDisabled: {
            opacity: 0.6,
        },
    });
