import { colors } from '@app/utils/colors';
import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        listAccountContainer: {
            height: 75,
            justifyContent: 'center',
            backgroundColor: theme.cardBg,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        listHeaderContainer: {
            justifyContent: 'center',
        },
        listFooterContainer: {
            paddingTop: 16,
        },
        content: {
            padding: 20,
            flexGrow: 1,
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
        premiumCard: {
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            marginTop: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        premiumCardContent: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            gap: 12,
        },
        premiumIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: `${colors.primary[600]}15`,
            alignItems: 'center',
            justifyContent: 'center',
        },
        premiumTextContainer: {
            flex: 1,
            gap: 4,
        },
        premiumTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 4,
        },
        premiumSubtitle: {
            fontSize: 14,
            color: theme.foregroundMuted,
            lineHeight: 20,
        },
    });
