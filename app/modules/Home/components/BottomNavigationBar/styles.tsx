import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        wrapper: {
            position: 'relative',
            zIndex: 1000,
        },
        container: {
            flexDirection: 'row',
            backgroundColor: theme.background,
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 20,
            paddingHorizontal: 0,
            alignItems: 'flex-end',
        },
        tab: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
        },
        fabSpacer: {
            width: 72,
        },
        iconContainer: {
            marginBottom: 4,
            alignItems: 'center',
            justifyContent: 'center',
        },
        tabLabel: {
            fontSize: 11,
            color: theme.foregroundMuted,
            fontWeight: '500',
        },
        tabLabelActive: {
            color: colors.primary[600],
            fontWeight: '600',
        },
        fabContainer: {
            position: 'absolute',
            bottom: 28,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 10,
        },
        fab: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary[600],
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.primary[600],
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        fabIcon: {
            fontSize: 28,
            color: '#ffffff',
            fontWeight: '300',
        },
    });
