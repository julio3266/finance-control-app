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
        heroSection: {
            alignItems: 'center',
            marginBottom: 40,
            marginTop: 20,
        },
        iconContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary[50],
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
            marginBottom: 24,
            gap: 16,
        },
        featureIcon: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
        },
        featureContent: {
            flex: 1,
        },
        featureTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 8,
        },
        featureDescription: {
            fontSize: 14,
            color: theme.foregroundMuted,
            lineHeight: 20,
        },
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
    });
