import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        triggerButton: {
            display: 'none',
        },
        modal: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder,
            maxHeight: '80%',
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            height: 4,
            marginTop: 12,
            marginBottom: 8,
        },
        overlay: {
            backgroundColor: theme.overlay,
        },
        content: {
            paddingHorizontal: 20,
            paddingTop: 8,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.inputBg,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
        },
        searchInput: {
            flex: 1,
            marginLeft: 12,
            fontSize: 16,
            color: theme.foreground,
        },
        listContainer: {
            maxHeight: 400,
        },
        categoryItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        categoryIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        categoryName: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
            fontWeight: '500',
        },
        radioButton: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.border,
        },
        actionsContainer: {
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        actionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            gap: 12,
        },
        actionText: {
            fontSize: 16,
            color: theme.foreground,
        },
        loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        loadingText: {
            marginTop: 12,
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        emptyText: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        emojiIcon: {
            fontSize: 20,
        },
    });
