import { colors } from '@app/utils/colors';
import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            marginBottom: 16,
        },
        divider: {
            height: 1,
            backgroundColor: theme.border,
            marginVertical: 4,
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 24,
        },
        emptyText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 16,
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: `${colors.primary[600]}15`,
            borderRadius: 8,
            gap: 6,
        },
        addButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary[600],
        },
    });
