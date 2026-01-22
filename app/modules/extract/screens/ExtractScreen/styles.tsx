import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        content: {
            padding: 20,
            flexGrow: 1,
        },
        header: {
            marginBottom: 24,
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.foreground,
        },
        clearButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        clearButtonText: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.foregroundMuted,
        },
        filtersContainer: {
            gap: 20,
        },
        filterSection: {
            marginBottom: 16,
        },
        filterLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 8,
        },
        accountButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            borderRadius: 12,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        accountButtonText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
            flex: 1,
        },
        accountList: {
            marginTop: 8,
            borderRadius: 12,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            overflow: 'hidden',
        },
        accountItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder,
        },
        accountItemText: {
            fontSize: 14,
            color: theme.foreground,
            flex: 1,
        },
        ofBadge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            backgroundColor: colors.primary[100],
        },
        ofBadgeText: {
            fontSize: 10,
            fontWeight: '700',
            color: colors.primary[700],
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginTop: 16,
        },
        footerLoader: {
            paddingVertical: 20,
            alignItems: 'center',
        },
    });
