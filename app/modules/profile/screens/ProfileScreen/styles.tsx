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
            paddingTop: 60,
            paddingBottom: 100,
        },
        profileSection: {
            alignItems: 'center',
            marginBottom: 40,
        },
        avatarContainer: {
            position: 'relative',
            marginBottom: 20,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.cardBg,
            alignItems: 'center',
            justifyContent: 'center',
        },
        editButton: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary[600],
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: theme.background,
        },
        name: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 8,
        },
        email: {
            fontSize: 16,
            color: theme.foregroundMuted,
        },
        menuSection: {
            gap: 12,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.cardBg,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        menuIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
        },
        menuLabel: {
            flex: 1,
            fontSize: 16,
            fontWeight: '500',
            color: theme.foreground,
        },
    });
