import { StyleSheet } from 'react-native';
import { Theme } from '@app/utils/useTheme';

export const styles = (theme: Theme) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            padding: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 20,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.cardBackground,
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            marginBottom: 20,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
            marginRight: 8,
        },
        listContainer: {
            maxHeight: 450,
        },
        assetItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: theme.cardBackground,
            borderRadius: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.borderColor,
        },
        assetInfo: {
            flex: 1,
            marginRight: 12,
        },
        assetTicker: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        assetName: {
            fontSize: 14,
            color: theme.foregroundMuted,
            marginTop: 4,
        },
        assetSector: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        assetPriceContainer: {
            alignItems: 'flex-end',
        },
        assetPrice: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        assetChange: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 2,
        },
        emptyState: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        emptyStateText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            marginTop: 12,
            textAlign: 'center',
        },
    });
