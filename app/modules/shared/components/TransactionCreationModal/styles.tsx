import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder,
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
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 24,
            textAlign: 'center',
        },
        optionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: theme.inputBg,
            borderWidth: 1,
            borderColor: theme.border,
            marginBottom: 12,
        },
        optionIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: theme.background,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
        },
        openFinanceIconContainer: {
            backgroundColor: '#9333EA20',
        },
        optionContent: {
            flex: 1,
        },
        optionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 4,
        },
        optionMessage: {
            fontSize: 14,
            color: theme.foregroundMuted,
            lineHeight: 20,
        },
        openFinanceHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
        },
        premiumBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: '#9333EA20',
            borderWidth: 1,
            borderColor: '#9333EA',
            gap: 4,
        },
        premiumText: {
            fontSize: 10,
            fontWeight: '600',
            color: '#9333EA',
        },
    });
