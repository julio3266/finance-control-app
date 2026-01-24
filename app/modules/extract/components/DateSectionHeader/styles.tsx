import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 8,
            backgroundColor: theme.background,
        },
        dateText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
        },
    });

