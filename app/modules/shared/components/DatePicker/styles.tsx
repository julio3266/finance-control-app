import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>, accentColor: string) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            paddingBottom: 20,
        },
        header: {
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: theme.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        yearSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
        },
        yearText: {
            fontSize: 16,
            fontWeight: '600',
            color: accentColor,
        },
        selectedDateText: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
        },
        monthNavigation: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        monthNavButton: {
            padding: 8,
        },
        monthText: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
        },
        daysOfWeek: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: 20,
            paddingBottom: 12,
        },
        dayOfWeekText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
            width: 40,
            textAlign: 'center',
        },
        calendarGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        calendarDay: {
            width: '14.28%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 4,
        },
        calendarDaySelected: {
            backgroundColor: accentColor,
            borderRadius: 20,
        },
        calendarDayText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.foreground,
        },
        calendarDayTextMuted: {
            color: theme.foregroundMuted,
            opacity: 0.5,
        },
        calendarDayTextSelected: {
            color: '#ffffff',
            fontWeight: '700',
        },
        yearList: {
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        yearOption: {
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginVertical: 4,
        },
        yearOptionSelected: {
            backgroundColor: accentColor + '20',
        },
        yearOptionText: {
            fontSize: 18,
            fontWeight: '500',
            color: theme.foreground,
        },
        yearOptionTextSelected: {
            color: accentColor,
            fontWeight: '700',
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
