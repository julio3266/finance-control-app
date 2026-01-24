import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';
import { Theme } from '@app/utils/useTheme';

export const styles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            padding: 8,
            marginLeft: -8,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
            flex: 1,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        headerActionButton: {
            padding: 8,
        },
        addButton: {
            padding: 8,
            marginRight: -8,
        },
        listContent: {
            padding: 16,
            gap: 16,
        },
        emptyListContent: {
            flex: 1,
            justifyContent: 'center',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
        },
        loadingText: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        connectionCard: {
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.border,
        },
        connectionHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
        },
        logoContainer: {
            width: 56,
            height: 56,
            borderRadius: 12,
            overflow: 'hidden',
        },
        logoWrapper: {
            width: 56,
            height: 56,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 8,
        },
        logoPlaceholder: {
            width: 56,
            height: 56,
            backgroundColor: theme.muted,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        connectionInfo: {
            flex: 1,
            gap: 4,
        },
        connectorName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        statusRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        statusText: {
            fontSize: 13,
            fontWeight: '500',
        },
        lastSync: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        accountsInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        accountsText: {
            fontSize: 13,
            color: theme.foregroundMuted,
            flex: 1,
        },
        accountsList: {
            marginTop: 12,
            gap: 8,
        },
        accountItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            backgroundColor: theme.muted,
            borderRadius: 12,
        },
        accountItemLast: {
            marginBottom: 0,
        },
        accountIcon: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: `${colors.primary[600]}15`,
            justifyContent: 'center',
            alignItems: 'center',
        },
        accountDetails: {
            flex: 1,
            gap: 2,
        },
        accountName: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
        },
        accountNumber: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        accountBalance: {
            alignItems: 'flex-end',
        },
        accountBalanceValue: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
        },
        connectionActions: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 16,
        },
        actionButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: `${colors.primary[600]}15`,
        },
        actionButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary[600],
        },
        deleteButton: {
            backgroundColor: `${colors.error[500]}15`,
        },
        deleteButtonText: {
            color: colors.error[500],
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            gap: 16,
        },
        emptyIconContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.muted,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.foreground,
            textAlign: 'center',
        },
        emptyMessage: {
            fontSize: 14,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 20,
        },
        addConnectionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 14,
            paddingHorizontal: 24,
            borderRadius: 12,
            backgroundColor: colors.primary[600],
            marginTop: 8,
        },
        addConnectionButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
    });
