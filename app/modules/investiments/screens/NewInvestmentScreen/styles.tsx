import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
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
            paddingBottom: 120,
            flexGrow: 1,
        },
        typeSelector: {
            flexDirection: 'row',
            marginTop: 24,
            marginBottom: 32,
            gap: 12,
        },
        typeButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: theme.inputBg,
            borderWidth: 1,
            borderColor: theme.border,
            gap: 8,
        },
        typeButtonActive: {
            backgroundColor: colors.primary[600],
            borderColor: colors.primary[600],
        },
        typeButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
        },
        typeButtonTextActive: {
            color: '#ffffff',
        },
        formSection: {
            marginTop: 8,
        },
        formRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
        },
        formRowRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        formLabel: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
        },
        formValue: {
            fontSize: 16,
            color: theme.foregroundMuted,
        },
        separator: {
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 4,
        },
        inputSection: {
            marginBottom: 24,
        },
        inputLabel: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
            marginBottom: 8,
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
        inputWithIconText: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
            marginRight: 8,
            paddingVertical: 8,
        },
        inputError: {
            borderBottomColor: colors.error[500],
        },
        errorText: {
            fontSize: 12,
            color: colors.error[500],
            marginTop: 4,
            marginLeft: 4,
        },
        required: {
            color: colors.error[500],
        },
        saveButtonContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            paddingTop: 16,
            backgroundColor: theme.background,
        },
        saveButton: {
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        },
    });
