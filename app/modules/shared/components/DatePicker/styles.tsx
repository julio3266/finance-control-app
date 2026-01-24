import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>, accentColor: string) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.background,
        },
        header: {
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            alignItems: 'center',
        },
        selectedDateText: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
        },
        calendar: {
            paddingHorizontal: 10,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingTop: 20,
            gap: 16,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        cancelButton: {
            paddingVertical: 12,
            paddingHorizontal: 24,
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: accentColor,
        },
        confirmButton: {
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
        },
        confirmButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });
