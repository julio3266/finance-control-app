import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            height: 4,
            marginTop: 8,
            marginBottom: 8,
        },
        content: {
            padding: 20,
            paddingTop: 10,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
        },
        clearButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        clearButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
        },
        calendar: {
            marginBottom: 20,
        },
        footer: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 10,
        },
        button: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cancelButton: {
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        applyButton: {
            backgroundColor: colors.primary[600],
        },
        applyButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });

