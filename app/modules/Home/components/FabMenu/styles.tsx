import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
        },
        menuContainer: {
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            height: 200,
            zIndex: 999,
            pointerEvents: 'box-none',
        },
        menuItem: {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            marginLeft: -40,
        },
        menuItemLeft: {},
        menuItemRight: {},
        menuButton: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
        },
        iconWrapper: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        menuText: {
            fontSize: 12,
            fontWeight: '500',
            color: theme.foreground,
            textAlign: 'center',
        },
    });
