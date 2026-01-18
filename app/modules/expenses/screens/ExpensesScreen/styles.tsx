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
            fontSize: 28,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 16,
            color: theme.foregroundSecondary,
        },
    });

