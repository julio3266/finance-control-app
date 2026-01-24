import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        selector: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.inputBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            paddingHorizontal: 16,
            minHeight: 56,
        },
        selectedValue: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        selectedLogoContainer: {
            width: 32,
            height: 32,
            borderRadius: 6,
            overflow: 'hidden',
            marginRight: 12,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectedText: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
        },
        placeholderText: {
            flex: 1,
            fontSize: 16,
            color: theme.foregroundMuted,
        },

        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        screenContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
        },

        screenHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder,
        },
        backButton: {
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
        },
        screenTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
        },

        searchWrapper: {
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.inputBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            paddingHorizontal: 12,
            height: 48,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: theme.foreground,
            paddingVertical: 0,
        },
        searchLoading: {
            marginLeft: 8,
        },
        clearButton: {
            padding: 4,
            marginLeft: 4,
        },

        institutionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder,
        },
        logoContainer: {
            width: 48,
            height: 48,
            borderRadius: 12,
            overflow: 'hidden',
            marginRight: 14,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logo: {
            width: 32,
            height: 32,
        },
        svgWrapper: {
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
        },
        logoPlaceholder: {
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.primary[600],
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoPlaceholderText: {
            fontSize: 20,
            fontWeight: '700',
            color: '#ffffff',
        },
        institutionInfo: {
            flex: 1,
        },
        institutionName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 2,
        },
        institutionType: {
            fontSize: 13,
            color: theme.foregroundMuted,
        },

        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 64,
            paddingHorizontal: 32,
        },
        emptyIconContainer: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: theme.cardBg,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
        },
        emptyText: {
            fontSize: 17,
            fontWeight: '600',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 6,
        },
        emptySubtext: {
            fontSize: 14,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 20,
        },
    });
