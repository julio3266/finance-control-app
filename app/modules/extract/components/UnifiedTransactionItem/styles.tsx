import { useTheme } from "@app/utils/useTheme";
import { StyleSheet } from "react-native";

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 80,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            marginBottom: 12,
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        iconEmoji: {
            fontSize: 20,
        },
        content: {
            flex: 1,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
            gap: 8,
        },
        description: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            flex: 1,
        },
        badge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        badgeText: {
            fontSize: 10,
            fontWeight: '700',
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        date: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        accountName: {
            fontSize: 12,
            color: theme.foregroundMuted,
            fontStyle: 'italic',
        },
        amountContainer: {
            alignItems: 'flex-end',
        },
        amount: {
            fontSize: 14,
            fontWeight: '700',
            marginBottom: 4,
        },
        statusBadge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        statusText: {
            fontSize: 10,
            fontWeight: '600',
        },
    });
