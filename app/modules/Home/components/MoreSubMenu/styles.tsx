import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        menuContainer: {
            backgroundColor: theme.backgroundSecondary,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 16,
            paddingBottom: 32,
            paddingHorizontal: 16,
            marginBottom: 80,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: -2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 10,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        menuItemFirst: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
        },
        menuItemLast: {
            borderBottomWidth: 0,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
        },
        menuItemIcon: {
            fontSize: 24,
            marginRight: 16,
            width: 32,
        },
        menuItemLabel: {
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
        },
    });

