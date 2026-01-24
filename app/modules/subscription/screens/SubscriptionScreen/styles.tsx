import { useTheme } from '@app/utils/useTheme';
import { StyleSheet } from 'react-native';
import { colors } from '@app/utils/colors';

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        content: {
            padding: 20,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            padding: 8,
            minWidth: 40,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
            flex: 1,
            textAlign: 'center',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
        },
        loadingText: {
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        // Current Subscription Card
        currentSubscriptionCard: {
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#9333EA40',
        },
        subscriptionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        subscriptionBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#9333EA20',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
        },
        subscriptionBadgeText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#9333EA',
        },
        statusBadge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
        },
        periodText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            marginBottom: 12,
        },
        cancelWarning: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: `${colors.warning[500]}15`,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
        },
        cancelWarningText: {
            fontSize: 13,
            color: colors.warning[600],
            flex: 1,
        },
        subscriptionActions: {
            flexDirection: 'row',
            gap: 12,
        },
        manageButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: `${colors.primary[600]}15`,
        },
        manageButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary[600],
        },
        cancelButton: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            backgroundColor: `${colors.error[500]}15`,
        },
        cancelButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.error[500],
        },
        reactivateButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: colors.primary[600],
        },
        reactivateButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
        },
        // Hero Section
        heroSection: {
            alignItems: 'center',
            marginBottom: 40,
            marginTop: 20,
        },
        iconContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: `${colors.primary[600]}15`,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
        },
        heroTitle: {
            fontSize: 32,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 12,
            textAlign: 'center',
        },
        heroSubtitle: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            lineHeight: 24,
            paddingHorizontal: 20,
        },
        priceContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginTop: 20,
        },
        priceValue: {
            fontSize: 40,
            fontWeight: '700',
            color: colors.primary[600],
        },
        priceInterval: {
            fontSize: 18,
            color: theme.foregroundMuted,
            marginLeft: 4,
        },
        // Features Section
        featuresSection: {
            marginBottom: 32,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 24,
        },
        featureItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            gap: 16,
        },
        featureIcon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: `${colors.primary[600]}15`,
            alignItems: 'center',
            justifyContent: 'center',
        },
        featureEmoji: {
            fontSize: 28,
        },
        featureContent: {
            flex: 1,
        },
        featureTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 4,
        },
        featureDescription: {
            fontSize: 13,
            color: theme.foregroundMuted,
            lineHeight: 18,
        },
        // Subscribe Button
        subscribeButton: {
            backgroundColor: colors.primary[600],
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
        },
        subscribeButtonText: {
            fontSize: 18,
            fontWeight: '700',
            color: '#ffffff',
        },
        // Terms
        termsText: {
            fontSize: 12,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginTop: 20,
            lineHeight: 18,
        },
    });
