import { useTheme } from '@app/utils/useTheme';
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        content: {
            flex: 1,
            paddingHorizontal: 20,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        // Header
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 16,
            paddingBottom: 16,
            backgroundColor: theme.background,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
        },
        headerAddButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },

        // Main Card - Você pode gastar
        mainCard: {
            backgroundColor: theme.primary,
            borderRadius: 20,
            padding: 24,
            marginTop: 16,
            marginBottom: 16,
        },
        mainCardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        mainCardTitle: {
            fontSize: 16,
            color: 'rgba(255,255,255,0.85)',
            fontWeight: '500',
        },
        daysRemainingBadge: {
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },
        daysRemainingText: {
            fontSize: 12,
            color: '#FFFFFF',
            fontWeight: '600',
        },
        mainCardAmount: {
            fontSize: 40,
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: 4,
        },
        mainCardSubtitle: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
        },

        // Summary Cards Row
        summaryCardsRow: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 16,
        },
        summaryCard: {
            flex: 1,
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            alignItems: 'center',
            gap: 8,
        },
        summaryCardLabel: {
            fontSize: 12,
            color: theme.foregroundMuted,
        },
        summaryCardValue: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },

        // Progress Card
        progressCard: {
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        progressHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        progressTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },
        progressPercentage: {
            fontSize: 16,
            fontWeight: '700',
        },
        progressBarContainer: {
            height: 10,
            backgroundColor: `${theme.foreground}15`,
            borderRadius: 5,
            overflow: 'hidden',
        },
        progressBar: {
            height: '100%',
            borderRadius: 5,
        },
        progressInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
        },
        progressInfoText: {
            fontSize: 13,
            color: theme.foregroundMuted,
        },

        // Progress Section (legacy)
        progressSection: {
            marginBottom: 24,
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
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        seeAllText: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },

        // Category Card
        categoryCard: {
            backgroundColor: theme.cardBg,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
        },
        categoryHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        categoryIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
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
        categorySubtitle: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        categoryAmount: {
            alignItems: 'flex-end',
        },
        categorySpent: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.foreground,
        },
        categoryLimit: {
            fontSize: 12,
            color: theme.foregroundMuted,
            marginTop: 2,
        },
        categoryProgressContainer: {
            height: 6,
            backgroundColor: `${theme.foreground}15`,
            borderRadius: 3,
            overflow: 'hidden',
            marginTop: 12,
        },
        categoryProgress: {
            height: '100%',
            borderRadius: 3,
        },

        // Subcategories
        subCategoriesContainer: {
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: theme.cardBorder,
        },
        subCategoryItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 8,
        },
        subCategoryLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        subCategoryIcon: {
            fontSize: 14,
            marginRight: 8,
        },
        subCategoryName: {
            fontSize: 14,
            color: theme.foreground,
        },
        subCategoryAmount: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foreground,
        },

        // Empty State
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
        },
        emptyIconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: `${theme.foreground}10`,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 8,
            textAlign: 'center',
        },
        emptyDescription: {
            fontSize: 14,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 24,
        },
        createButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primary,
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 12,
            gap: 8,
        },
        createButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
        },

        // FAB
        fab: {
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },

        // Daily Spending Card
        dailySpendingCard: {
            backgroundColor: theme.primary,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
        },
        dailySpendingHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        dailySpendingTitle: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
        },
        dailySpendingPeriod: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
        },
        dailySpendingAmount: {
            fontSize: 32,
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: 4,
        },
        dailySpendingSubtitle: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
        },
        dailySpendingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.2)',
        },
        dailySpendingItem: {
            alignItems: 'center',
        },
        dailySpendingItemLabel: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 4,
        },
        dailySpendingItemValue: {
            fontSize: 16,
            fontWeight: '700',
            color: '#FFFFFF',
        },

        // Period Selector
        periodSelector: {
            flexDirection: 'row',
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
        },
        periodOption: {
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 8,
        },
        periodOptionActive: {
            backgroundColor: theme.primary,
        },
        periodOptionText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
        },
        periodOptionTextActive: {
            color: '#FFFFFF',
        },
    });
