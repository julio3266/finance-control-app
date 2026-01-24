import { StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        content: {
            paddingBottom: 40,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 16,
            backgroundColor: theme.background,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        // Period Selector Styles
        periodSelectorContainer: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            gap: 12,
        },
        periodTypeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.backgroundSecondary,
            gap: 8,
        },
        periodTypeText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary[600],
        },
        periodNavigation: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        periodArrow: {
            padding: 8,
        },
        periodText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            textTransform: 'capitalize',
            marginHorizontal: 16,
            minWidth: 180,
            textAlign: 'center',
        },
        // Modal Styles
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalOverlayTouchable: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        modalContent: {
            backgroundColor: theme.background,
            borderRadius: 16,
            padding: 20,
            minWidth: 280,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 16,
            textAlign: 'center',
        },
        modalOption: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            marginBottom: 4,
        },
        modalOptionActive: {
            backgroundColor: theme.backgroundSecondary,
        },
        modalOptionText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.foreground,
        },
        modalOptionTextActive: {
            color: colors.primary[600],
            fontWeight: '600',
        },
        // Custom Period Modal Styles
        customPeriodModalContent: {
            backgroundColor: theme.background,
            borderRadius: 16,
            padding: 20,
            minWidth: 320,
            maxWidth: '90%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
        },
        // Calendar Modal Styles
        calendarModalContent: {
            backgroundColor: theme.background,
            borderRadius: 16,
            padding: 16,
            width: '90%',
            maxWidth: 360,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
        },
        calendarHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 4,
        },
        dateRangeInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.backgroundSecondary,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
        },
        dateRangeItem: {
            flex: 1,
            alignItems: 'center',
        },
        dateRangeLabel: {
            fontSize: 12,
            fontWeight: '500',
            color: theme.foregroundMuted,
            marginBottom: 4,
        },
        dateRangeValue: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
        },
        customPeriodButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: theme.backgroundSecondary,
        },
        datePickerSection: {
            marginBottom: 20,
        },
        dateLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
            marginBottom: 8,
        },
        datePickerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            backgroundColor: theme.backgroundSecondary,
            gap: 12,
        },
        datePickerText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.foreground,
            flex: 1,
        },
        dateScrollContent: {
            gap: 8,
            paddingVertical: 4,
        },
        dateOption: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dateOptionMonth: {
            width: 56,
            paddingHorizontal: 8,
        },
        dateOptionActive: {
            backgroundColor: colors.primary[600],
        },
        dateOptionText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
        },
        dateOptionTextActive: {
            color: '#ffffff',
            fontWeight: '600',
        },
        customPeriodButtons: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 8,
        },
        customPeriodCancelButton: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: theme.backgroundSecondary,
            alignItems: 'center',
        },
        customPeriodCancelText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        customPeriodConfirmButton: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: colors.primary[600],
            alignItems: 'center',
        },
        customPeriodConfirmButtonDisabled: {
            backgroundColor: theme.foregroundMuted,
            opacity: 0.5,
        },
        customPeriodConfirmText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        // Legacy styles (kept for compatibility)
        monthSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
        },
        monthArrow: {
            padding: 8,
        },
        monthText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            textTransform: 'capitalize',
            marginHorizontal: 16,
            minWidth: 150,
            textAlign: 'center',
        },
        tabsContainer: {
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        tabsContent: {
            paddingHorizontal: 16,
            gap: 8,
        },
        tab: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            backgroundColor: theme.backgroundSecondary,
            gap: 8,
        },
        tabActive: {
            backgroundColor: colors.primary[600],
        },
        tabText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foregroundMuted,
        },
        tabTextActive: {
            color: '#ffffff',
        },
    });
