import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>, size: number) =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: size,
            height: size,
        },
        centerLabel: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: size / 2 - 20,
            left: 0,
            right: 0,
        },
        centerValue: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
        },
        centerText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            marginTop: 4,
        },
    });
