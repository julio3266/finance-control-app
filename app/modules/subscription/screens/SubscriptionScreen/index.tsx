import React, { useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { useAppDispatch, useAppSelector } from '@app/store';
import { colors } from '@app/utils/colors';
import { ScreenWithHeader } from '@app/modules/Home/components';
import {
    fetchPlans,
    fetchSubscriptionInfo,
    createCheckoutSession,
    createSetupIntent,
    createPaymentIntent,
    openStripePortal,
    cancelSubscription,
    reactivateSubscription,
    clearCheckoutUrl,
    clearClientSecret,
    clearPortalUrl,
} from '@app/modules/subscription/slices';
import { fetchUserProfile, setPremiumStatus } from '@app/modules/profile/slices';
import { fetchFinanceOverview } from '@app/modules/dashboard/slices/financeApi';
import { CheckoutWebView, StripeCheckout } from '@app/modules/subscription/components';
import { styles } from './styles';

export default function SubscriptionScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const dispatch = useAppDispatch();

    const {
        plans,
        subscriptionInfo,
        checkoutUrl,
        clientSecret,
        portalUrl,
        plansLoading,
        checkoutLoading,
        portalLoading,
        cancelLoading,
        reactivateLoading,
        error,
    } = useAppSelector((state) => state.subscription);

    const profile = useAppSelector((state) => state.profile.profile);
    const isPremium = profile?.isPremium ?? false;

    const [refreshing, setRefreshing] = useState(false);
    const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
    const [showWebView, setShowWebView] = useState(false);
    const [showStripeCheckout, setShowStripeCheckout] = useState(false);

    // Load data on mount
    useEffect(() => {
        dispatch(fetchPlans());
        dispatch(fetchSubscriptionInfo());
    }, [dispatch]);

    // Handle checkout URL - show in WebView
    useEffect(() => {
        if (checkoutUrl) {
            setWebViewUrl(checkoutUrl);
            setShowWebView(true);
            dispatch(clearCheckoutUrl());
        }
    }, [checkoutUrl, dispatch]);

    // Handle client secret - show native Stripe checkout
    useEffect(() => {
        if (clientSecret) {
            setShowStripeCheckout(true);
        }
    }, [clientSecret]);

    // Handle portal URL - open in browser (Stripe portal works better externally)
    useEffect(() => {
        if (portalUrl) {
            Linking.openURL(portalUrl);
            dispatch(clearPortalUrl());
        }
    }, [portalUrl, dispatch]);

    // Show error alerts
    useEffect(() => {
        if (error) {
            Alert.alert('Erro', error);
        }
    }, [error]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            dispatch(fetchPlans()),
            dispatch(fetchSubscriptionInfo()),
            // fetchUserProfile removido - já atualiza via useFocusEffect do Dashboard
        ]);
        setRefreshing(false);
    }, [dispatch]);

    const handleSubscribe = async () => {
        if (isPremium) {
            Alert.alert('Atenção', 'Você já possui uma assinatura ativa.');
            return;
        }

        try {
            // Try native SDK first (Setup Intent for recurring subscriptions)
            await dispatch(createSetupIntent()).unwrap();
        } catch (err) {
            // Fallback to WebView (Checkout Session) if Setup Intent fails
            try {
                await dispatch(createCheckoutSession()).unwrap();
            } catch (fallbackErr) {
                // Error handled by global interceptor
            }
        }
    };

    const handleManageSubscription = async () => {
        try {
            await dispatch(openStripePortal()).unwrap();
        } catch (err) {
            // Error handled by useEffect
        }
    };

    const handleCancelSubscription = () => {
        Alert.alert(
            'Cancelar assinatura',
            'Tem certeza que deseja cancelar sua assinatura? Você ainda terá acesso até o final do período atual.',
            [
                { text: 'Não', style: 'cancel' },
                {
                    text: 'Sim, cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dispatch(cancelSubscription()).unwrap();
                            Alert.alert(
                                'Assinatura cancelada',
                                'Sua assinatura será cancelada no final do período atual.',
                            );
                            dispatch(fetchSubscriptionInfo());
                            dispatch(fetchUserProfile());
                        } catch (err) {
                            // Error handled by useEffect
                        }
                    },
                },
            ],
        );
    };

    const handleReactivateSubscription = async () => {
        try {
            await dispatch(reactivateSubscription()).unwrap();
            Alert.alert('Sucesso', 'Sua assinatura foi reativada!');
            dispatch(fetchSubscriptionInfo());
            // Profile atualiza automaticamente no Dashboard
        } catch (err) {
            // Error handled by useEffect
        }
    };

    const handleWebViewClose = () => {
        setShowWebView(false);
        setWebViewUrl(null);
    };

    const handleStripeCheckoutClose = () => {
        setShowStripeCheckout(false);
        dispatch(clearClientSecret());
    };

    const handleCheckoutSuccess = async () => {
        // Atualiza o status premium imediatamente (otimista)
        dispatch(setPremiumStatus(true));

        // Refresh subscription info in background
        await dispatch(fetchSubscriptionInfo());

        // Reload home data to show premium features
        dispatch(fetchFinanceOverview());
        dispatch(fetchUserProfile()).catch(() => { });

        // Navigate to success screen
        navigation.navigate('SubscriptionSuccess' as any);
    };

    const handleCheckoutCancel = () => {
        Alert.alert('Checkout cancelado', 'Você pode tentar novamente quando quiser.');
    };

    const premiumPlan = plans.find((p) => p.type === 'PREMIUM');

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(price);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const getStatusText = (status: string | null) => {
        switch (status) {
            case 'ACTIVE':
                return 'Ativa';
            case 'CANCELED':
                return 'Cancelada';
            case 'PAST_DUE':
                return 'Pagamento pendente';
            case 'UNPAID':
                return 'Não paga';
            case 'TRIALING':
                return 'Período de teste';
            case 'INCOMPLETE':
                return 'Incompleta';
            default:
                return 'Inativa';
        }
    };

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'ACTIVE':
            case 'TRIALING':
                return '#059669';
            case 'PAST_DUE':
            case 'INCOMPLETE':
                return colors.warning[500];
            case 'CANCELED':
            case 'UNPAID':
                return colors.error[500];
            default:
                return theme.foregroundMuted;
        }
    };

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styled.backButton}>
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.headerTitle}>Assinatura Premium</Text>
            <View style={styled.backButton} />
        </View>
    );

    const renderCurrentSubscription = () => {
        if (!subscriptionInfo?.isActive) return null;

        return (
            <View style={styled.currentSubscriptionCard}>
                <View style={styled.subscriptionHeader}>
                    <View style={styled.subscriptionBadge}>
                        <Feather name="star" size={16} color="#9333EA" />
                        <Text style={styled.subscriptionBadgeText}>Premium</Text>
                    </View>
                    <View
                        style={[
                            styled.statusBadge,
                            { backgroundColor: `${getStatusColor(subscriptionInfo.status)}20` },
                        ]}
                    >
                        <Text
                            style={[
                                styled.statusText,
                                { color: getStatusColor(subscriptionInfo.status) },
                            ]}
                        >
                            {getStatusText(subscriptionInfo.status)}
                        </Text>
                    </View>
                </View>

                {subscriptionInfo.currentPeriodEnd && (
                    <Text style={styled.periodText}>
                        {subscriptionInfo.cancelAtPeriodEnd
                            ? `Expira em: ${formatDate(subscriptionInfo.currentPeriodEnd)}`
                            : `Próxima cobrança: ${formatDate(subscriptionInfo.currentPeriodEnd)}`}
                    </Text>
                )}

                {subscriptionInfo.cancelAtPeriodEnd && (
                    <View style={styled.cancelWarning}>
                        <Feather name="alert-circle" size={16} color={colors.warning[500]} />
                        <Text style={styled.cancelWarningText}>
                            Sua assinatura será cancelada no final do período
                        </Text>
                    </View>
                )}

                <View style={styled.subscriptionActions}>
                    {subscriptionInfo.cancelAtPeriodEnd ? (
                        <TouchableOpacity
                            style={styled.reactivateButton}
                            onPress={handleReactivateSubscription}
                            disabled={reactivateLoading}
                            activeOpacity={0.8}
                        >
                            {reactivateLoading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                                <>
                                    <Feather name="refresh-cw" size={18} color="#ffffff" />
                                    <Text style={styled.reactivateButtonText}>Reativar</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TouchableOpacity
                                style={styled.manageButton}
                                onPress={handleManageSubscription}
                                disabled={portalLoading}
                                activeOpacity={0.8}
                            >
                                {portalLoading ? (
                                    <ActivityIndicator size="small" color={colors.primary[600]} />
                                ) : (
                                    <>
                                        <Feather
                                            name="settings"
                                            size={18}
                                            color={colors.primary[600]}
                                        />
                                        <Text style={styled.manageButtonText}>Gerenciar</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styled.cancelButton}
                                onPress={handleCancelSubscription}
                                disabled={cancelLoading}
                                activeOpacity={0.8}
                            >
                                {cancelLoading ? (
                                    <ActivityIndicator size="small" color={colors.error[500]} />
                                ) : (
                                    <Text style={styled.cancelButtonText}>Cancelar</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        );
    };

    const renderFeatureItem = (
        icon: string,
        title: string,
        description: string,
        included: boolean = true,
    ) => (
        <View style={styled.featureItem} key={title}>
            <View
                style={[
                    styled.featureIcon,
                    !included && { backgroundColor: `${theme.foregroundMuted}15` },
                ]}
            >
                <Feather
                    name={icon as any}
                    size={24}
                    color={included ? colors.primary[600] : theme.foregroundMuted}
                />
            </View>
            <View style={styled.featureContent}>
                <Text style={[styled.featureTitle, !included && { color: theme.foregroundMuted }]}>
                    {title}
                </Text>
                <Text style={styled.featureDescription}>{description}</Text>
            </View>
            {included && <Feather name="check-circle" size={20} color="#059669" />}
        </View>
    );

    if (plansLoading && plans.length === 0) {
        return (
            <ScreenWithHeader customHeader={renderHeader()}>
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[600]} />
                    <Text style={styled.loadingText}>Carregando planos...</Text>
                </View>
            </ScreenWithHeader>
        );
    }

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <ScrollView
                style={styled.container}
                contentContainerStyle={[styled.content, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary[600]}
                        colors={[colors.primary[600]]}
                    />
                }
            >
                {/* Current Subscription Status */}
                {renderCurrentSubscription()}

                {/* Hero Section - only show if not premium */}
                {!isPremium && (
                    <View style={styled.heroSection}>
                        <View style={styled.iconContainer}>
                            <Feather name="star" size={64} color={colors.primary[600]} />
                        </View>
                        <Text style={styled.heroTitle}>Torne-se Premium</Text>
                        <Text style={styled.heroSubtitle}>
                            Desbloqueie recursos exclusivos e tenha controle total das suas
                            finanças
                        </Text>

                        {premiumPlan && (
                            <View style={styled.priceContainer}>
                                <Text style={styled.priceValue}>
                                    {formatPrice(premiumPlan.price, premiumPlan.currency)}
                                </Text>
                                <Text style={styled.priceInterval}>/mês</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Features Section */}
                <View style={styled.featuresSection}>
                    <Text style={styled.sectionTitle}>
                        {isPremium ? 'Seus benefícios Premium' : 'Recursos Premium'}
                    </Text>

                    {premiumPlan?.features && premiumPlan.features.length > 0 ? (
                        [...premiumPlan.features]
                            .sort((a, b) => a.sortOrder - b.sortOrder)
                            .map((feature, index) => (
                                <View style={styled.featureItem} key={`${feature.id}-${index}`}>
                                    <View style={styled.featureIcon}>
                                        <Text style={styled.featureEmoji}>{feature.icon}</Text>
                                    </View>
                                    <View style={styled.featureContent}>
                                        <Text style={styled.featureTitle}>{feature.name}</Text>
                                        <Text style={styled.featureDescription}>
                                            {feature.description}
                                        </Text>
                                    </View>
                                    {feature.included && (
                                        <Feather name="check-circle" size={20} color="#059669" />
                                    )}
                                </View>
                            ))
                    ) : (
                        <>
                            {renderFeatureItem(
                                'link',
                                'Open Finance',
                                'Conecte suas contas bancárias e sincronize transações automaticamente',
                            )}
                            {renderFeatureItem(
                                'bar-chart-2',
                                'Relatórios Avançados',
                                'Análises detalhadas e insights sobre seus gastos',
                            )}
                            {renderFeatureItem(
                                'shield',
                                'Segurança Avançada',
                                'Proteção adicional para seus dados financeiros',
                            )}
                            {renderFeatureItem(
                                'download',
                                'Exportar Dados',
                                'Exporte seus dados para análise externa',
                            )}
                            {renderFeatureItem(
                                'headphones',
                                'Suporte Prioritário',
                                'Atendimento exclusivo e prioritário',
                            )}
                        </>
                    )}
                </View>

                {/* Subscribe Button - only show if not premium */}
                {!isPremium && (
                    <TouchableOpacity
                        style={styled.subscribeButton}
                        onPress={handleSubscribe}
                        disabled={checkoutLoading}
                        activeOpacity={0.8}
                    >
                        {checkoutLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styled.subscribeButtonText}>Assinar Premium</Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Terms */}
                <Text style={styled.termsText}>
                    Ao assinar, você concorda com nossos Termos de Uso e Política de Privacidade. A
                    cobrança será feita mensalmente até o cancelamento.
                </Text>
            </ScrollView>

            {/* Native Stripe Checkout Modal */}
            {clientSecret && (
                <StripeCheckout
                    visible={showStripeCheckout}
                    clientSecret={clientSecret}
                    onClose={handleStripeCheckoutClose}
                    onSuccess={handleCheckoutSuccess}
                />
            )}

            {/* Checkout WebView Modal (fallback) */}
            {webViewUrl && (
                <CheckoutWebView
                    visible={showWebView}
                    url={webViewUrl}
                    onClose={handleWebViewClose}
                    onSuccess={handleCheckoutSuccess}
                    onCancel={handleCheckoutCancel}
                />
            )}
        </ScreenWithHeader>
    );
}
