import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        rootStyle: {
            zIndex: 10000,
            elevation: 10000,
        },
        modal: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
        },
        handle: {
            backgroundColor: theme.foregroundMuted,
            width: 40,
            height: 4,
            marginTop: 12,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
            elevation: 9998,
        },
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
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
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
        content: {
            flex: 1,
        },
        contentContainer: {
            padding: 20,
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
    });

