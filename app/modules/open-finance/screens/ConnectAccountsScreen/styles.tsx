import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: theme.inputBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            gap: 12,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
        },
        clearButton: {
            padding: 4,
        },
        listContent: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        institutionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        institutionLogoContainer: {
            marginRight: 16,
        },
        institutionLogo: {
            width: 48,
            height: 48,
            borderRadius: 24,
        },
        institutionLogoPlaceholder: {
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        institutionLogoText: {
            fontSize: 20,
            fontWeight: '700',
            color: '#ffffff',
        },
        institutionInfo: {
            flex: 1,
        },
        institutionName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 4,
        },
        institutionType: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        footerLoader: {
            paddingVertical: 20,
            alignItems: 'center',
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 16,
            color: theme.foregroundMuted,
            marginTop: 16,
            textAlign: 'center',
        },
    });
