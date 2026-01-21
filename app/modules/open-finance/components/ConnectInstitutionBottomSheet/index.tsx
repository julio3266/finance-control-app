import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image,
    Dimensions,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchConnectToken, createConnection, type Connector } from '../../slices';
import { PluggyConnect } from 'react-native-pluggy-connect';
import { styles } from './styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConnectInstitutionBottomSheetProps {
    modalizeRef: React.RefObject<IHandles>;
    connector: Connector | null;
    onSuccess?: () => void;
    onClose?: () => void;
}

export const ConnectInstitutionBottomSheet: React.FC<ConnectInstitutionBottomSheetProps> = ({
    modalizeRef,
    connector,
    onSuccess,
    onClose,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const styled = styles(theme);

    const connectToken = useAppSelector((state) => state.openFinance.connectToken);
    const connectTokenLoading = useAppSelector((state) => state.openFinance.connectTokenLoading);
    const connectTokenError = useAppSelector((state) => state.openFinance.connectTokenError);
    const connectionsLoading = useAppSelector((state) => state.openFinance.connectionsLoading);

    const [logoError, setLogoError] = useState(false);
    const [step, setStep] = useState<'token' | 'connecting' | 'success'>('token');
    const [showWidget, setShowWidget] = useState(false);

    useEffect(() => {
        if (connector && modalizeRef.current) {
            modalizeRef.current.open();
        }
    }, [connector, modalizeRef]);

    useEffect(() => {
        if (connector) {
            dispatch(fetchConnectToken());
            setStep('token');
            setLogoError(false);
            setShowWidget(false);
        }
    }, [connector, dispatch]);

    useEffect(() => {
        if (connectToken && step === 'token') {
            setStep('connecting');
        }
    }, [connectToken, step]);

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

        modalizeRef.current?.close();
        if (onClose) {
            onClose();
        }
    };

    const handleContinue = () => {
        modalizeRef.current?.close();
        if (onSuccess) {
            onSuccess();
        }
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
        if (!connector) return null;

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
        if (!connector) return null;

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
        <Modalize
            ref={modalizeRef}
            modalHeight={SCREEN_HEIGHT * 0.9}
            modalStyle={styled.bottomSheet}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            onClosed={() => {
                setShowWidget(false);
                if (onClose) {
                    onClose();
                }
            }}
            HeaderComponent={
                connector && !showWidget ? (
                    <View style={styled.bottomSheetHeader}>
                        <Text style={styled.bottomSheetTitle}>Conectar instituição</Text>
                        <TouchableOpacity
                            onPress={() => {
                                modalizeRef.current?.close();
                                if (onClose) {
                                    onClose();
                                }
                            }}
                            style={styled.bottomSheetCloseButton}
                        >
                            <Feather name="x" size={24} color={theme.foreground} />
                        </TouchableOpacity>
                    </View>
                ) : null
            }
        >
            {!connector ? (
                <View style={styled.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.foreground} />
                </View>
            ) : showWidget ? (
                <View style={styled.webViewContainer}>
                    {connectToken && connector ? (
                        <PluggyConnect
                            connectToken={connectToken}
                            connectorIds={[connector.id]}
                            onSuccess={handlePluggySuccess}
                            onError={handlePluggyError}
                            onClose={handlePluggyClose}
                            includeSandbox={false}
                        />
                    ) : (
                        <View style={styled.webViewFallback}>
                            <ActivityIndicator size="large" color={theme.foreground} />
                            <Text style={styled.webViewFallbackText}>Carregando...</Text>
                        </View>
                    )}
                </View>
            ) : (
                <ScrollView
                    style={styled.scrollView}
                    contentContainerStyle={[styled.scrollContent, { paddingBottom: insets.bottom }]}
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
        </Modalize>
    );
};
