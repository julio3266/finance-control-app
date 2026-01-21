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
        headerButton: {
            padding: 8,
            minWidth: 40,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
            flex: 1,
            marginLeft: 8,
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        headerIconButton: {
            padding: 4,
        },
        billSummary: {
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 10,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: theme.border,
            overflow: 'hidden',
        },
        cardMiniature: {
            marginBottom: 20,
            marginHorizontal: 0,
            alignItems: 'center',
        },
        billHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        brandInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        brandLogoContainer: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brandLogoImage: {
            width: 40,
            height: 40,
        },
        brandLogoCircle: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brandLogoText: {
            fontSize: 14,
            fontWeight: '700',
        },
        brandName: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
        },
        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
        },
        dateRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        dateLabel: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        financialRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        financialColumn: {
            alignItems: 'center',
        },
        financialLabel: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginBottom: 4,
        },
        financialValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },
        monthNavigation: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            gap: 8,
        },
        monthNavButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        monthScrollContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 8,
        },
        monthButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: theme.backgroundTertiary,
        },
        monthButtonActive: {
            backgroundColor: colors.primary[600],
        },
        monthText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foregroundMuted,
        },
        monthTextActive: {
            color: '#ffffff',
            fontWeight: '600',
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
        },
        loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
        transactionsList: {
            marginTop: 8,
            gap: 8,
        },
    });
