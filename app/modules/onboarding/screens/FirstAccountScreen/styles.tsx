import { StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: 24,
            paddingBottom: 40,
        },
        stepsIndicator: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 32,
        },
        stepBadgeActive: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary[600],
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            gap: 8,
        },
        stepBadgeCompleted: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.success[500],
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            gap: 8,
        },
        stepNumber: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
        },
        stepLabelActive: {
            fontSize: 14,
            fontWeight: '500',
            color: '#ffffff',
        },
        stepLabelCompleted: {
            fontSize: 14,
            fontWeight: '500',
            color: '#ffffff',
        },
        iconContainer: {
            alignItems: 'center',
            marginBottom: 24,
        },
        iconBox: {
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginBottom: 32,
        },
        form: {
            gap: 24,
            marginBottom: 32,
        },
        inputGroup: {},
        label: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
            marginBottom: 8,
        },
        required: {
            color: colors.error[500],
        },
        selectButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        selectContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        selectIcon: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectText: {
            fontSize: 16,
            color: theme.foreground,
        },
        colorsRow: {
            flexDirection: 'row',
            gap: 12,
            flexWrap: 'wrap',
        },
        colorOption: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        colorOptionActive: {
            borderWidth: 3,
            borderColor: '#ffffff',
        },
        buttonsContainer: {
            flexDirection: 'row',
            gap: 12,
        },
        backButton: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: theme.cardBg,
        },
        backButtonText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.foreground,
        },
        finishButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.success[500],
            paddingVertical: 16,
            borderRadius: 12,
            gap: 8,
        },
        finishButtonDisabled: {
            opacity: 0.5,
        },
        finishButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        // BottomSheet Styles
        bottomSheet: {
            backgroundColor: theme.backgroundSecondary,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
        },
        bottomSheetHandle: {
            backgroundColor: theme.border,
            width: 40,
        },
        bottomSheetOverlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        bottomSheetContent: {
            padding: 20,
        },
        bottomSheetHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        bottomSheetTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
        },
        typesList: {
            gap: 8,
        },
        typeOption: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        typeOptionActive: {
            borderColor: colors.primary[500],
            borderWidth: 2,
            backgroundColor: colors.primary[500] + '10',
        },
        typeOptionLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        typeOptionIcon: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        typeOptionIconActive: {
            backgroundColor: colors.primary[500] + '20',
        },
        typeOptionLabel: {
            fontSize: 16,
            color: theme.foreground,
        },
        typeOptionLabelActive: {
            color: colors.primary[500],
            fontWeight: '600',
        },
    });
