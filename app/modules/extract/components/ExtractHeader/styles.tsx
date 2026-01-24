import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.background,
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        topSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 24,
        },
        titleContainer: {
            flex: 1,
        },
        subtitle: {
            fontSize: 14,
            fontWeight: '400',
            color: theme.foregroundMuted,
            marginBottom: 4,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.foreground,
        },
        actionsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        iconButton: {
            padding: 8,
        },
        monthSelectorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.cardBg,
            borderRadius: 30,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            minHeight: 48,
        },
        monthNavButton: {
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.backgroundSecondary || theme.buttonPrimaryBg,
            flexShrink: 0,
        },
        monthScrollContent: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 4,
            position: 'relative',
        },
        monthItem: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center',
        },
        monthItemSelected: {
            borderRadius: 30,
            backgroundColor: theme.backgroundSecondary || theme.background,
        },
        monthText: {
            fontSize: 11,
            fontWeight: '500',

            color: theme.foregroundMuted,
        },
        monthTextSelected: {
            fontSize: 12.5,
            borderRadius: 10,
            fontWeight: '700',
            color: theme.foreground,
        },
    });
