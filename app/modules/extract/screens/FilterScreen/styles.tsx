import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        header: {
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        closeButton: {
            padding: 8,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            flex: 1,
            textAlign: 'center',
        },
        clearButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        clearButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
        },
        tabsContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        tab: {
            paddingBottom: 12,
            borderBottomWidth: 2,
            borderBottomColor: 'transparent',
        },
        tabActive: {
            borderBottomColor: theme.foreground,
        },
        tabText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.foregroundMuted,
        },
        tabTextActive: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        content: {
            flex: 1,
        },
        contentContainer: {
            padding: 20,
            flexGrow: 1,
        },
        filtersContainer: {
            gap: 24,
        },
        filterSection: {
            marginBottom: 8,
        },
        filterLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 12,
        },
        chipsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        dateInput: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        dateInputText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.foreground,
        },
        categoriesContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
        },
        emptyText: {
            fontSize: 16,
            color: theme.foregroundMuted,
        },
        buttonContainer: {
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: theme.background,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
    });
