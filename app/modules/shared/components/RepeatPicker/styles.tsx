import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>, accentColor: string) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder,
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            height: 4,
            marginTop: 12,
            marginBottom: 8,
        },
        overlay: {
            backgroundColor: theme.overlay,
        },
        content: {
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 20,
        },
        title: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 24,
            textAlign: 'center',
        },
        fieldRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
        },
        fieldLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        fieldLabel: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
        },
        quantityContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        quantityButton: {
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        quantityInput: {
            minWidth: 60,
            paddingHorizontal: 16,
            paddingVertical: 8,
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '600',
        },
        separator: {
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 4,
        },
        periodButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        periodText: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
        },
        periodOptions: {
            marginTop: 8,
            marginBottom: 8,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: theme.inputBg,
        },
        periodOption: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        periodOptionSelected: {
            backgroundColor: accentColor + '10',
        },
        periodOptionText: {
            fontSize: 16,
            color: theme.foreground,
        },
        periodOptionTextSelected: {
            color: accentColor,
            fontWeight: '600',
        },
        doneButton: {
            marginTop: 24,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        doneButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: 0.5,
        },
    });
