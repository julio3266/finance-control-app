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
        selectField: {
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
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
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        inputError: {
            borderBottomColor: colors.error[500],
        },
        currencyInput: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            paddingVertical: 12,
        },
        currencyText: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '600',
            marginRight: 8,
        },
        inputText: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
        },
        errorText: {
            fontSize: 12,
            color: colors.error[500],
            marginTop: 4,
        },
        errorContainer: {
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.error[50],
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.error[200],
        },
        categoryGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 8,
        },
        categoryItem: {
            width: '22%',
            alignItems: 'center',
            padding: 12,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: theme.border,
            backgroundColor: theme.cardBg,
        },
        categoryItemSelected: {
            borderWidth: 2,
        },
        categoryIcon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        categoryName: {
            fontSize: 12,
            color: theme.foreground,
            textAlign: 'center',
            fontWeight: '500',
        },
        saveButton: {
            backgroundColor: colors.primary[600],
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 32,
            marginBottom: 20,
        },
        saveButtonDisabled: {
            opacity: 0.6,
        },
        saveButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        emojiIcon: {
            fontSize: 20,
        },
    });

