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
        cardWrapper: {
            marginBottom: 16,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            padding: 8,
            minWidth: 40,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            flex: 1,
            textAlign: 'center',
        },
        addButton: {
            padding: 8,
            minWidth: 40,
            alignItems: 'flex-end',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
            marginTop: 16,
            marginBottom: 8,
        },
        emptySubtext: {
            fontSize: 14,
            color: theme.foregroundMuted,
            textAlign: 'center',
        },
        paginationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingTop: 16,
            gap: 16,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        paginationButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        paginationButtonDisabled: {
            opacity: 0.5,
        },
        paginationIndicators: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        paginationDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.foregroundMuted,
            opacity: 0.3,
        },
        paginationDotActive: {
            width: 24,
            backgroundColor: colors.primary[600],
            opacity: 1,
        },
    });
