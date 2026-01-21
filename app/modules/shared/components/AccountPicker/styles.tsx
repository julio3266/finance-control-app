import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>, isDark: boolean) =>
    StyleSheet.create({
        triggerButton: {
            display: 'none',
        },
        modal: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder,
            maxHeight: '80%',
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
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
        },
        searchInput: {
            flex: 1,
            marginLeft: 12,
            fontSize: 16,
            color: theme.foreground,
        },
        listContainer: {
            maxHeight: 400,
        },
        accountItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        accountIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        accountIconText: {
            fontSize: 14,
            fontWeight: '700',
        },
        accountInfo: {
            flex: 1,
        },
        accountName: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
            marginBottom: 2,
        },
        accountBank: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        accountTypeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        typeBadge: {
            backgroundColor: isDark ? colors.primary[900] : colors.primary[100],
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
        },
        typeBadgeText: {
            fontSize: 10,
            fontWeight: '600',
            color: isDark ? colors.primary[300] : colors.primary[600],
        },
        radioButton: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.border,
        },
        actionsContainer: {
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        actionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            gap: 12,
        },
        actionText: {
            fontSize: 16,
            color: theme.foreground,
        },
        addIconContainer: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        loadingContainer: {
            paddingVertical: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
