import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    StatusBar,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

interface CheckoutWebViewProps {
    visible: boolean;
    url: string;
    onClose: () => void;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CheckoutWebView: React.FC<CheckoutWebViewProps> = ({
    visible,
    url,
    onClose,
    onSuccess,
    onCancel,
}) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const webViewRef = useRef<WebView>(null);

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        const { url: currentUrl } = navState;


        // Detectar URLs de sucesso ou cancelamento do Stripe
        if (currentUrl.includes('/subscription/success') || currentUrl.includes('checkout.stripe.com') && currentUrl.includes('success')) {
            onSuccess?.();
            onClose();
        } else if (currentUrl.includes('/subscription/cancel') || currentUrl.includes('canceled')) {
            onCancel?.();
            onClose();
        }
    };

    const handleShouldStartLoadWithRequest = (request: any) => {
        const { url: requestUrl } = request;

        // Permitir URLs do Stripe e do nosso domínio
        if (
            requestUrl.startsWith('https://checkout.stripe.com') ||
            requestUrl.startsWith('https://billing.stripe.com') ||
            requestUrl.startsWith('https://js.stripe.com') ||
            requestUrl.startsWith('https://m.stripe.network') ||
            requestUrl.includes('financecontrolapp.com') ||
            requestUrl.startsWith('about:blank')
        ) {
            return true;
        }

        // Para outros URLs, permitir também
        return true;
    };

    const handleError = () => {
        setError(true);
        setLoading(false);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            backgroundColor: theme.card,
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
        },
        closeButton: {
            padding: 8,
        },
        placeholder: {
            width: 40,
        },
        webview: {
            flex: 1,
            backgroundColor: '#ffffff',
        },
        loadingContainer: {
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
        loadingText: {
            marginTop: 12,
            fontSize: 14,
            color: theme.foregroundMuted,
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            fontSize: 16,
            color: theme.foreground,
            textAlign: 'center',
            marginTop: 12,
        },
        retryButton: {
            marginTop: 20,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: colors.primary[600],
            borderRadius: 8,
        },
        retryButtonText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
        },
    });

    const insets = useSafeAreaInsets();

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <StatusBar barStyle="light-content" />
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Feather name="x" size={24} color={theme.foreground} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout Seguro</Text>
                    <View style={styles.placeholder} />
                </View>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Feather name="alert-circle" size={48} color={colors.error[500]} />
                        <Text style={styles.errorText}>
                            Não foi possível carregar o checkout.{'\n'}
                            Verifique sua conexão e tente novamente.
                        </Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                setError(false);
                                setLoading(true);
                                webViewRef.current?.reload();
                            }}
                        >
                            <Text style={styles.retryButtonText}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={0}
                    >
                        <WebView
                            ref={webViewRef}
                            source={{ uri: url }}
                            style={styles.webview}
                            onLoadStart={() => setLoading(true)}
                            onLoadEnd={() => setLoading(false)}
                            onNavigationStateChange={handleNavigationStateChange}
                            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                            onError={handleError}
                            onHttpError={handleError}
                            javaScriptEnabled
                            domStorageEnabled
                            startInLoadingState={false}
                            scalesPageToFit={false}
                            sharedCookiesEnabled
                            thirdPartyCookiesEnabled
                            mixedContentMode="always"
                            allowsInlineMediaPlayback
                            mediaPlaybackRequiresUserAction={false}
                            originWhitelist={['*']}
                            allowsBackForwardNavigationGestures={false}
                            bounces={false}
                            scrollEnabled
                            automaticallyAdjustContentInsets={false}
                            contentInsetAdjustmentBehavior="never"
                            keyboardDisplayRequiresUserAction={false}
                            hideKeyboardAccessoryView={false}
                            allowsLinkPreview={false}
                            textInteractionEnabled
                        />
                    </KeyboardAvoidingView>
                )}

                {loading && !error && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary[600]} />
                        <Text style={styles.loadingText}>Carregando checkout...</Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};
