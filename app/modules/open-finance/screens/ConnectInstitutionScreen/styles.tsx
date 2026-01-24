import { useTheme } from '@app/utils/useTheme';
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@app/utils/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        institutionCard: {
            alignItems: 'center',
            paddingVertical: 32,
            marginTop: 24,
        },
        logoContainer: {
            marginBottom: 16,
        },
        logo: {
            width: 80,
            height: 80,
            borderRadius: 40,
        },
        logoPlaceholder: {
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        logoText: {
            fontSize: 32,
            fontWeight: '700',
            color: '#ffffff',
        },
        institutionName: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 8,
        },
        institutionType: {
            fontSize: 16,
            color: theme.foregroundMuted,
        },
        loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
        loadingText: {
            fontSize: 16,
            color: theme.foregroundMuted,
            marginTop: 16,
        },
        errorContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        errorTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.foreground,
            marginTop: 16,
            marginBottom: 8,
        },
        errorText: {
            fontSize: 14,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginBottom: 24,
        },
        retryButton: {
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors.primary[600],
            borderRadius: 12,
        },
        retryButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        contentContainer: {
            marginTop: 32,
        },
        title: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            marginBottom: 12,
            textAlign: 'center',
        },
        description: {
            fontSize: 16,
            color: theme.foregroundMuted,
            lineHeight: 24,
            textAlign: 'center',
            marginBottom: 24,
        },
        infoBox: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 16,
            backgroundColor: theme.cardBg,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.cardBorder,
            marginBottom: 32,
            gap: 12,
        },
        infoText: {
            flex: 1,
            fontSize: 14,
            color: theme.foregroundMuted,
            lineHeight: 20,
        },
        connectButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
            backgroundColor: colors.primary[600],
            borderRadius: 12,
            gap: 8,
        },
        connectButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        successIcon: {
            alignItems: 'center',
            marginBottom: 24,
        },
        successTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 12,
        },
        successText: {
            fontSize: 16,
            color: theme.foregroundMuted,
            lineHeight: 24,
            textAlign: 'center',
            marginBottom: 32,
        },
        continueButton: {
            paddingVertical: 16,
            backgroundColor: colors.primary[600],
            borderRadius: 12,
            alignItems: 'center',
        },
        continueButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        bottomSheet: {
            backgroundColor: theme.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
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
        bottomSheetHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        bottomSheetTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
        },
        bottomSheetCloseButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        webView: {
            flex: 1,
            minHeight: SCREEN_HEIGHT * 0.8,
        },
        webViewLoading: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.background,
        },
        webViewFallback: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        webViewFallbackText: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginBottom: 24,
        },
        openBrowserButton: {
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors.primary[600],
            borderRadius: 12,
        },
        openBrowserButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#ffffff',
        },
        widgetContainer: {
            flex: 1,
        },
    });
