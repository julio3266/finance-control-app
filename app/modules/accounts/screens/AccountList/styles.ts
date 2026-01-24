import { colors } from '@app/utils/colors';
import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

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
            paddingHorizontal: 16,
            paddingBottom: 16,
            backgroundColor: theme.background,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        addButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        cardContainer: {
            flex: 1,
            marginHorizontal: 16,
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            marginBottom: 16,
        },
        listContent: {
            padding: 16,
            flexGrow: 1,
        },
        divider: {
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 4,
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
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginTop: 16,
        },
        addAccountButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: `${colors.primary[600]}15`,
            borderRadius: 8,
            gap: 8,
        },
        addAccountText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary[600],
        },
    });
