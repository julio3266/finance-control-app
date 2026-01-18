import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        content: {
            padding: 20,
            flexGrow: 1,
        },
        title: {
            fontSize: 32,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 16,
        },
        subtitle: {
            fontSize: 18,
            color: theme.foregroundSecondary,
        },
    });

