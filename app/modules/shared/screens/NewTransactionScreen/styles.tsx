import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';
import { TransactionType } from './index';

export const styles = (theme: ReturnType<typeof useTheme>, type: TransactionType) =>
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
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            minWidth: 60,
        },
        headerButtonRight: {
            minWidth: 60,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
            flex: 1,
            textAlign: 'center',
        },
        currencyText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
            marginRight: 4,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 100,
        },
        amountSection: {
            marginTop: 24,
            marginBottom: 32,
        },
        amountLabel: {
            fontSize: 14,
            color: theme.foregroundSecondary,
            marginBottom: 8,
        },
        amountInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        amountIcon: {
            marginRight: 12,
        },
        amountInput: {
            flex: 1,
            fontSize: 32,
            fontWeight: '700',
            color: theme.foreground,
            padding: 0,
        },
        formSection: {
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
        dateButtonsContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        dateButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.backgroundTertiary,
        },
        dateButtonText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            fontWeight: '500',
        },
        dateButtonTextActive: {
            color: '#ffffff',
        },
        categoryPill: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            gap: 6,
        },
        categoryPillText: {
            fontSize: 14,
            fontWeight: '600',
        },
        accountPill: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            gap: 8,
        },
        accountPillText: {
            fontSize: 14,
            fontWeight: '600',
        },
        descriptionSection: {
            marginBottom: 8,
            marginTop: 8,
        },
        descriptionLabel: {
            fontSize: 16,
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        descriptionSeparator: {
            height: 1,
            backgroundColor: theme.border,
            marginBottom: 12,
        },
        descriptionInput: {
            fontSize: 16,
            color: theme.foreground,
            minHeight: 40,
            paddingVertical: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
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
        moreDetailsButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 24,
            marginBottom: 16,
            gap: 8,
        },
        moreDetailsText: {
            fontSize: 14,
            fontWeight: '600',
            letterSpacing: 0.5,
        },
        moreDetailsContent: {
            marginTop: 8,
            marginBottom: 16,
            paddingVertical: 8,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
        },
        detailLabel: {
            fontSize: 16,
            color: theme.foreground,
            marginLeft: 12,
        },
        separator: {
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 4,
        },
        observationInputContainer: {
            marginTop: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 12,
            padding: 12,
            backgroundColor: theme.inputBg,
            minHeight: 80,
        },
        observationInput: {
            fontSize: 16,
            color: theme.foreground,
            textAlignVertical: 'top',
        },
        repeatDetails: {
            marginTop: 8,
            marginBottom: 8,
        },
        repeatInputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        repeatCountInput: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 16,
            color: theme.foreground,
            backgroundColor: theme.inputBg,
            minWidth: 60,
            textAlign: 'center',
        },
        repeatText: {
            fontSize: 16,
            color: theme.foreground,
        },
        repeatPeriodButton: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: theme.inputBg,
            gap: 4,
        },
        repeatPeriodText: {
            fontSize: 16,
            color: theme.foreground,
        },
        ignoreSection: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 24,
            paddingVertical: 12,
        },
        saveButtonContainer: {
            alignItems: 'center',
            paddingTop: 16,
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
            shadowRadius: 8,
            elevation: 8,
        },
    });
