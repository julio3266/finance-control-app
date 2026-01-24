import { useTheme } from '@app/utils/useTheme';
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollView: {
            flex: 1,
        },
        content: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },

        // Header Navigation
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
            paddingBottom: 12,
            backgroundColor: theme.background,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.cardBg,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitleText: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        headerRight: {
            width: 40,
        },

        // Header Info
        headerInfo: {
            marginTop: 16,
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 8,
        },
        headerSubtitle: {
            fontSize: 14,
            color: theme.foregroundMuted,
            lineHeight: 20,
        },

        // Period Selector
        periodSection: {
            marginBottom: 24,
        },
        sectionLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 12,
        },
        periodOptions: {
            flexDirection: 'row',
            gap: 12,
        },
        periodOption: {
            flex: 1,
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'transparent',
        },
        periodOptionActive: {
            borderColor: theme.primary,
            backgroundColor: `${theme.primary}10`,
        },
        periodOptionIcon: {
            marginBottom: 8,
        },
        periodOptionText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
        },
        periodOptionTextActive: {
            color: theme.primary,
        },

        // Budget Name
        nameSection: {
            marginBottom: 24,
        },
        input: {
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: theme.foreground,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },

        // Total Limit
        totalSection: {
            marginBottom: 24,
        },
        totalCard: {
            backgroundColor: theme.primary,
            borderRadius: 16,
            padding: 20,
        },
        totalLabel: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 8,
        },
        totalInput: {
            fontSize: 32,
            fontWeight: '700',
            color: '#FFFFFF',
        },
        totalHint: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 8,
        },

        // Categories Section
        categoriesSection: {
            marginBottom: 24,
        },
        categoriesHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        categoriesTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        addCategoryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        addCategoryText: {
            fontSize: 14,
            color: theme.primary,
            fontWeight: '600',
        },

        // Category Item
        categoryItem: {
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            overflow: 'hidden',
        },
        categoryItemSelected: {
            borderColor: theme.primary,
        },
        categoryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
        },
        categoryCheckbox: {
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: theme.foregroundMuted,
            marginRight: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        categoryCheckboxSelected: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        categoryIcon: {
            width: 40,
            height: 40,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        categoryIconText: {
            fontSize: 20,
        },
        categoryInfo: {
            flex: 1,
        },
        categoryName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        categorySubCount: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        categoryLimitContainer: {
            alignItems: 'flex-end',
        },
        categoryLimitInput: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'right',
            minWidth: 100,
        },
        expandIcon: {
            marginLeft: 8,
        },

        // Subcategories
        subCategoriesContainer: {
            backgroundColor: `${theme.foreground}05`,
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        subCategoryItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder,
        },
        subCategoryItemLast: {
            borderBottomWidth: 0,
        },
        subCategoryLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        subCategoryCheckbox: {
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: theme.foregroundMuted,
            marginRight: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        subCategoryCheckboxSelected: {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
        },
        subCategoryIcon: {
            fontSize: 16,
            marginRight: 8,
        },
        subCategoryName: {
            fontSize: 14,
            color: theme.foreground,
        },
        subCategoryLimitInput: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
            textAlign: 'right',
            minWidth: 80,
            backgroundColor: theme.cardBg,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
        },

        // Summary
        summarySection: {
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        summaryRowLast: {
            marginBottom: 0,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder,
        },
        summaryLabel: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        summaryValue: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        summaryTotal: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.primary,
        },

        // Buttons
        buttonsContainer: {
            flexDirection: 'row',
            gap: 12,
            paddingTop: 8,
        },
        cancelButton: {
            flex: 1,
            paddingVertical: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            alignItems: 'center',
        },
        cancelButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        saveButton: {
            flex: 2,
            paddingVertical: 16,
            borderRadius: 12,
            backgroundColor: theme.primary,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
        },
        saveButtonDisabled: {
            opacity: 0.5,
        },
        saveButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
        },

        // Distribute Section
        distributeSection: {
            marginBottom: 24,
        },
        distributeCard: {
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        distributeLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        distributeText: {
            fontSize: 14,
            color: theme.foreground,
        },
        distributeButton: {
            backgroundColor: theme.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
        },
        distributeButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#FFFFFF',
        },
    });
