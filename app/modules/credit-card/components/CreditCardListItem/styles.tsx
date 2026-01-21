import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            padding: 12,
            borderWidth: 1,
            marginBottom: 8,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        brandLogoContainer: {
            width: 40,
            height: 40,
            marginRight: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brandLogoText: {
            fontSize: 10,
            color: theme.foregroundMuted,
        },
        content: {
            flex: 1,
        },
        bankName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 6,
        },
        infoRow: {
            flexDirection: 'row',
            marginBottom: 4,
        },
        infoLabel: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        infoValue: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.foreground,
        },
        rightSection: {
            alignItems: 'flex-end',
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 4,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: 4,
        },
        statusText: {
            fontSize: 10,
            fontWeight: '600',
        },
        closingDate: {
            fontSize: 11,
            color: theme.foregroundMuted,
        },
    });
