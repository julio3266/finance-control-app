import { colors } from '@app/utils/colors';
import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 0,
            marginBottom: 0,
        },
        logoContainer: {
            marginRight: 12,
        },
        logoWrapper: {
            width: 40,
            height: 40,
            borderRadius: 20,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'transparent',
        },
        logoPlaceholder: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary[100],
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#ffffff',
        },
        name: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            flex: 1,
        },
        balanceContainer: {
            alignItems: 'flex-end',
            marginLeft: 'auto',
        },
        balanceLabel: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginBottom: 2,
        },
        balanceValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },
    });
