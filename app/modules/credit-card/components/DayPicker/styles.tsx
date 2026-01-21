import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>, accentColor: string) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            marginTop: 8,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            padding: 20,
            paddingTop: 8,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 20,
            textAlign: 'center',
        },
        listContainer: {
            maxHeight: 500,
        },
        listContent: {
            paddingVertical: 4,
        },
        dayItem: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 2,
            borderRadius: 12,
            backgroundColor: 'transparent',
        },
        dayItemSelected: {
            backgroundColor: theme.backgroundTertiary,
            borderWidth: 1,
            borderColor: accentColor,
        },
        dayText: {
            fontSize: 18,
            fontWeight: '500',
            color: theme.foreground,
        },
        dayTextSelected: {
            fontWeight: '600',
            color: theme.foreground,
        },
    });
