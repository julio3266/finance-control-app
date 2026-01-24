import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image,
    Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import Feather from '@expo/vector-icons/Feather';
import { useTheme, useThemeMode } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchConnectToken, createConnection, type Connector } from '../../slices';
import { PluggyConnect } from 'react-native-pluggy-connect';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { styles } from './styles';

import type { PluggyProduct } from '../../routes/openFinanceRoutes';

type ConnectInstitutionRouteProp = RouteProp<
    {
        ConnectInstitution: {
            connector: Connector;
            products?: PluggyProduct[];
        };
    },
    'ConnectInstitution'
>;

export const ConnectInstitutionScreen: React.FC = () => {
    const theme = useTheme();
    const themeMode = useThemeMode();
    const navigation = useNavigation();
    const route = useRoute<ConnectInstitutionRouteProp>();
    const dispatch = useAppDispatch();
    const styled = styles(theme);

    const { connector, products } = route.params;

    const connectToken = useAppSelector((state) => state.openFinance.connectToken);
    const connectTokenLoading = useAppSelector((state) => state.openFinance.connectTokenLoading);
    const connectTokenError = useAppSelector((state) => state.openFinance.connectTokenError);
    const connectionsLoading = useAppSelector((state) => state.openFinance.connectionsLoading);

    const [logoError, setLogoError] = useState(false);
    const [step, setStep] = useState<'token' | 'connecting' | 'success'>('token');
    const [showWidget, setShowWidget] = useState(false);

    const callbackUrl = Platform.select({
        ios: 'financecontrol://open-finance/oauth-callback',
        android: 'financecontrol://open-finance/oauth-callback',
        default: Linking.createURL('open-finance/oauth-callback'),
    });

    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const url = event.url;

            // Check if this is an OAuth callback
            if (url.includes('oauth-callback') || url.includes('open-finance/connect')) {
                // If we have the widget open, it will handle the OAuth response
                // If not, we might need to reopen it
                if (!showWidget && step === 'connecting') {
                    setShowWidget(true);
                }
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink({ url });
            }
        });

        return () => {
            subscription.remove();
        };
    }, [showWidget, step]);

    useEffect(() => {
        dispatch(fetchConnectToken());
    }, [dispatch]);

    useEffect(() => {
        if (connectToken && step === 'token') {
            setStep('connecting');
        }
    }, [connectToken, step]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleOpenWidget = () => {
        if (!connectToken || !connector) {
            return;
        }

        setShowWidget(true);
    };

    const handlePluggySuccess = (data: { item: { id: string } }) => {
        if (!connector) return;

        setShowWidget(false);

        const itemId = data.item.id;
        const pluggyItemId = itemId.startsWith('item_') ? itemId.replace('item_', '') : itemId;

        dispatch(
            createConnection({
                pluggyItemId,
                connectorId: connector.id,
                connectorName: connector.name,
                connectorLogo: connector.imageUrl,
            }),
        );
        setStep('success');
    };

    const handlePluggyError = () => {
        setShowWidget(false);
    };

    const handlePluggyClose = () => {
        setShowWidget(false);
    };

    const handleContinue = () => {
        // Voltar para a tela de MyConnections para ver a conexão adicionada
        navigation.navigate('MyConnections' as never);
    };

    const formatColor = (color?: string): string => {
        if (!color) return colors.primary[600];
        if (color.startsWith('#')) return color;
        return `#${color}`;
    };

    const formatInstitutionType = (type: string): string => {
        const typeMap: Record<string, string> = {
            PERSONAL_BANK: 'Pessoa Física',
            BUSINESS_BANK: 'Pessoa Jurídica',
            INVESTMENT: 'Investimento',
        };

        return typeMap[type] || type;
    };

    const renderLogo = () => {
        const isSvg =
            connector.imageUrl?.toLowerCase().includes('.svg') ||
            connector.imageUrl?.includes('/serve/');

        if (logoError || !connector.imageUrl) {
            return (
                <View
                    style={[
                        styled.logoPlaceholder,
                        { backgroundColor: formatColor(connector.primaryColor) },
                    ]}
                >
                    <Text style={styled.logoText}>{connector.name.charAt(0).toUpperCase()}</Text>
                </View>
            );
        }

        if (isSvg) {
            return (
                <View
                    style={[
                        styled.logoPlaceholder,
                        { backgroundColor: formatColor(connector.primaryColor) },
                    ]}
                >
                    <Text style={styled.logoText}>{connector.name.charAt(0).toUpperCase()}</Text>
                </View>
            );
        }

        return (
            <Image
                source={{ uri: connector.imageUrl }}
                style={styled.logo}
                resizeMode="contain"
                onError={() => setLogoError(true)}
            />
        );
    };

    const renderContent = () => {
        if (connectTokenLoading || step === 'token') {
            return (
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.foreground} />
                    <Text style={styled.loadingText}>Preparando conexão...</Text>
                </View>
            );
        }

        if (connectTokenError) {
            return (
                <View style={styled.errorContainer}>
                    <Feather name="alert-circle" size={48} color={colors.error[500]} />
                    <Text style={styled.errorTitle}>Erro ao conectar</Text>
                    <Text style={styled.errorText}>{connectTokenError}</Text>
                    <TouchableOpacity
                        style={styled.retryButton}
                        onPress={() => dispatch(fetchConnectToken())}
                    >
                        <Text style={styled.retryButtonText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (step === 'connecting') {
            return (
                <View style={styled.contentContainer}>
                    <Text style={styled.title}>Conectar com {connector.name}</Text>
                    <Text style={styled.description}>
                        Você será redirecionado para autorizar o acesso aos seus dados bancários de
                        forma segura.
                    </Text>

                    <View style={styled.infoBox}>
                        <Feather name="shield" size={20} color={colors.primary[600]} />
                        <Text style={styled.infoText}>
                            Seus dados são protegidos e criptografados. Nunca armazenamos suas
                            senhas.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styled.connectButton}
                        onPress={handleOpenWidget}
                        disabled={connectionsLoading}
                    >
                        {connectionsLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <Feather name="link" size={20} color="#ffffff" />
                                <Text style={styled.connectButtonText}>Conectar</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            );
        }

        if (step === 'success') {
            return (
                <View style={styled.contentContainer}>
                    <View style={styled.successIcon}>
                        <Feather name="check-circle" size={64} color={colors.success[500]} />
                    </View>
                    <Text style={styled.successTitle}>Conexão estabelecida!</Text>
                    <Text style={styled.successText}>
                        Sua conta {connector.name} foi conectada com sucesso. Agora vamos
                        sincronizar seus dados.
                    </Text>

                    <TouchableOpacity
                        style={styled.continueButton}
                        onPress={handleContinue}
                        disabled={connectionsLoading}
                    >
                        {connectionsLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styled.continueButtonText}>Continuar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    const renderHeader = () => (
        <View style={styled.header}>
            <TouchableOpacity
                onPress={handleBack}
                style={styled.backButton}
                activeOpacity={0.7}
            >
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.headerTitle}>Conectar instituição</Text>
            {showWidget ? (
                <TouchableOpacity
                    onPress={handlePluggyClose}
                    style={styled.backButton}
                    activeOpacity={0.7}
                >
                    <Feather name="x" size={24} color={theme.foreground} />
                </TouchableOpacity>
            ) : (
                <View style={styled.backButton} />
            )}
        </View>
    );

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            {showWidget && connectToken && connector ? (
                <View style={styled.widgetContainer}>
                    <PluggyConnect
                        key={`${connector.id}-${connectToken.substring(0, 10)}`}
                        connectToken={connectToken}
                        connectorIds={[connector.id]}
                        onSuccess={handlePluggySuccess}
                        products={products}
                        onError={handlePluggyError}
                        onClose={handlePluggyClose}
                        language="pt-BR"
                        theme={themeMode === 'light' ? 'light' : 'dark'}
                        includeSandbox={false}
                        oauthRedirectUri={callbackUrl}
                    />
                </View>
            ) : (
                <ScrollView
                    style={styled.scrollView}
                    contentContainerStyle={styled.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Institution Info */}
                    <View style={styled.institutionCard}>
                        <View style={styled.logoContainer}>{renderLogo()}</View>
                        <Text style={styled.institutionName}>{connector.name}</Text>
                        <Text style={styled.institutionType}>
                            {formatInstitutionType(connector.type)}
                        </Text>
                    </View>

                    {/* Content */}
                    {renderContent()}
                </ScrollView>
            )}
        </ScreenWithHeader>
    );
};
