import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        modal: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            marginTop: 8,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            padding: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 20,
        },
        listContainer: {
            maxHeight: 400,
        },
        brandItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: theme.backgroundTertiary,
            marginBottom: 12,
        },
        brandInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        brandIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        brandIconText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#ffffff',
        },
        brandName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        radioButton: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.border,
        },
        loadingContainer: {
            paddingVertical: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brandIconImageContainer: {
            width: 40,
            height: 40,
            marginRight: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        brandIconImage: {
            width: 40,
            height: 40,
        },
    });
