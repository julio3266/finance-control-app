import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image,
    Linking,
    Dimensions,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchConnectToken, createConnection, type Connector } from '../../slices';
import { styles } from './styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// WebView será importado quando react-native-webview estiver instalado
// Para instalar: npm install react-native-webview
// Depois, descomentar a linha abaixo e remover o try/catch
// import { WebView } from 'react-native-webview';
let WebView: any = null;
try {
    WebView = require('react-native-webview').WebView;
} catch {
    // WebView não está instalado ainda
}

type ConnectInstitutionRouteProp = RouteProp<
    {
        ConnectInstitution: {
            connector: Connector;
        };
    },
    'ConnectInstitution'
>;

export const ConnectInstitutionScreen: React.FC = () => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<ConnectInstitutionRouteProp>();
    const dispatch = useAppDispatch();
    const styled = styles(theme);

    const { connector } = route.params;

    const connectToken = useAppSelector((state) => state.openFinance.connectToken);
    const connectTokenLoading = useAppSelector((state) => state.openFinance.connectTokenLoading);
    const connectTokenError = useAppSelector((state) => state.openFinance.connectTokenError);
    const connectionsLoading = useAppSelector((state) => state.openFinance.connectionsLoading);

    const [logoError, setLogoError] = useState(false);
    const [step, setStep] = useState<'token' | 'connecting' | 'success'>('token');
    const widgetModalRef = useRef<IHandles>(null);
    const webViewRef = useRef<any>(null);

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
        if (!connectToken) {
            return;
        }

        widgetModalRef.current?.open();
    };

    const handleWidgetMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            // Pluggy widget envia eventos via postMessage
            if (data.type === 'PLUGGY_CONNECT_SUCCESS') {
                const { itemId } = data;
                handleWidgetSuccess(itemId);
            } else if (data.type === 'PLUGGY_CONNECT_ERROR') {
                handleWidgetError();
            } else if (data.type === 'PLUGGY_CONNECT_CLOSE') {
                widgetModalRef.current?.close();
            }
        } catch {
            // Ignorar mensagens que não são JSON válido
        }
    };

    const handleWidgetSuccess = (itemId: string) => {
        widgetModalRef.current?.close();

        // Remove o prefixo "item_" se existir, pois o backend espera apenas o UUID
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

    const handleWidgetError = () => {
        widgetModalRef.current?.close();
        // TODO: Mostrar erro ao usuário
    };

    const getPluggyWidgetUrl = () => {
        if (!connectToken) return '';
        // URL do widget Pluggy Connect
        // Em produção, usar a URL correta da Pluggy conforme documentação
        return `https://cdn.pluggy.ai/connect-widget/index.html?connectToken=${connectToken}`;
    };

    const handleOpenInBrowser = async () => {
        if (!connectToken) return;
        const url = getPluggyWidgetUrl();
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        }
    };

    const handleContinue = () => {
        // Sincronizar a conexão criada
        // TODO: Obter o ID da conexão criada e sincronizar
        (navigation as any).navigate('OpenFinance', { screen: 'ConnectAccounts' });
    };

    const formatColor = (color?: string): string => {
        if (!color) return colors.primary[600];
        if (color.startsWith('#')) return color;
        return `#${color}`;
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

    return (
        <View style={[styled.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styled.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styled.backButton}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={24} color={theme.foreground} />
                </TouchableOpacity>
                <Text style={styled.headerTitle}>Conectar instituição</Text>
                <View style={styled.backButton} />
            </View>

            <ScrollView
                style={styled.scrollView}
                contentContainerStyle={styled.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Institution Info */}
                <View style={styled.institutionCard}>
                    <View style={styled.logoContainer}>{renderLogo()}</View>
                    <Text style={styled.institutionName}>{connector.name}</Text>
                    <Text style={styled.institutionType}>{connector.type}</Text>
                </View>

                {/* Content */}
                {renderContent()}
            </ScrollView>

            {/* Pluggy Widget BottomSheet */}
            <Modalize
                ref={widgetModalRef}
                modalHeight={SCREEN_HEIGHT * 0.9}
                modalStyle={styled.bottomSheet}
                handleStyle={styled.handle}
                overlayStyle={styled.overlay}
                HeaderComponent={
                    <View style={styled.bottomSheetHeader}>
                        <Text style={styled.bottomSheetTitle}>Conectar com {connector.name}</Text>
                        <TouchableOpacity
                            onPress={() => widgetModalRef.current?.close()}
                            style={styled.bottomSheetCloseButton}
                        >
                            <Feather name="x" size={24} color={theme.foreground} />
                        </TouchableOpacity>
                    </View>
                }
            >
                {connectToken && WebView ? (
                    <WebView
                        ref={webViewRef}
                        source={{ uri: getPluggyWidgetUrl() }}
                        style={styled.webView}
                        onMessage={handleWidgetMessage}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState
                        renderLoading={() => (
                            <View style={styled.webViewLoading}>
                                <ActivityIndicator size="large" color={theme.foreground} />
                            </View>
                        )}
                    />
                ) : connectToken ? (
                    <View style={styled.webViewFallback}>
                        <Text style={styled.webViewFallbackText}>
                            Para usar o widget Pluggy, é necessário instalar react-native-webview
                        </Text>
                        <TouchableOpacity
                            style={styled.openBrowserButton}
                            onPress={handleOpenInBrowser}
                        >
                            <Text style={styled.openBrowserButtonText}>Abrir no navegador</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styled.webViewFallback}>
                        <ActivityIndicator size="large" color={theme.foreground} />
                        <Text style={styled.webViewFallbackText}>Carregando...</Text>
                    </View>
                )}
            </Modalize>
        </View>
    );
};
