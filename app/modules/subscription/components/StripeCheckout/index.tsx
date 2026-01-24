import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardField, useConfirmSetupIntent } from '@stripe/stripe-react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { apiClient } from '@app/utils/api';
import { useAppSelector } from '@app/store';

interface StripeCheckoutProps {
    visible: boolean;
    clientSecret: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
    visible,
    clientSecret,
    onClose,
    onSuccess,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { confirmSetupIntent } = useConfirmSetupIntent();
    const [loading, setLoading] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [setupProcessed, setSetupProcessed] = useState(false);

    // Get auth token from Redux
    const token = useAppSelector((state) => (state.auth as any).token);

    // Reset state when modal closes or clientSecret changes
    React.useEffect(() => {
        if (!visible) {
            setLoading(false);
            setCardComplete(false);
            setCardDetails(null);
            setSetupProcessed(false);
        }
    }, [visible]);

    const handlePayment = async () => {
        if (setupProcessed) {
            Alert.alert('Atenção', 'Esta configuração já foi processada');
            return;
        }

        if (!cardComplete || !cardDetails?.complete) {
            Alert.alert(
                'Dados Incompletos',
                'Por favor, preencha todos os campos do cartão:\n\n✓ Número completo (16 dígitos)\n✓ Validade (MM/AA)\n✓ CVV'
            );
            return;
        }

        setLoading(true);

        try {

            const result = await confirmSetupIntent(clientSecret, {
                paymentMethodType: 'Card',
            });


            const { error, setupIntent } = result;

            if (error) {
                setLoading(false);
                return;
            }

            if (!setupIntent || !setupIntent.id) {
                Alert.alert('Erro', 'Setup não foi processado corretamente');
                setLoading(false);
                return;
            }


            setSetupProcessed(true);


            const paymentMethodId = setupIntent.paymentMethodId || setupIntent.paymentMethod?.id;
            if (!paymentMethodId) {
                console.error('ERROR: Payment method ID not found in setupIntent');
                Alert.alert('Erro', 'Método de pagamento não encontrado');
                setLoading(false);
                return;
            }

            try {
                await apiClient.post(
                    '/api/subscription/create-from-payment',
                    { paymentMethodId },
                    { Authorization: `Bearer ${token}` }
                );
                onSuccess?.();
                setTimeout(() => {
                    setLoading(false);
                    onClose();
                }, 1000);
            } catch (apiError: any) {
                console.error('Erro ao criar assinatura:', apiError);
                Alert.alert(
                    'Erro ao finalizar assinatura',
                    'O cartão foi salvo mas houve um erro ao criar sua assinatura. Entre em contato com o suporte.'
                );
                setLoading(false);
            }
        } catch (err: any) {
            console.error('Erro no setup:', err);
            Alert.alert('Erro', err.message || 'Erro ao processar cartão');
            setLoading(false);
        }
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
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.foreground,
            letterSpacing: 0.3,
        },
        closeButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.backgroundTertiary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        placeholder: {
            width: 40,
        },
        content: {
            flex: 1,
            padding: 24,
        },
        iconContainer: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: `${colors.primary[600]}15`,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            alignSelf: 'center',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.foreground,
            marginBottom: 8,
            textAlign: 'center',
        },
        priceContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'center',
            marginBottom: 8,
        },
        price: {
            fontSize: 42,
            fontWeight: 'bold',
            color: colors.primary[600],
        },
        priceSubtext: {
            fontSize: 18,
            color: theme.foregroundMuted,
            marginLeft: 4,
        },
        subtitle: {
            fontSize: 15,
            color: theme.foregroundMuted,
            marginBottom: 40,
            textAlign: 'center',
            lineHeight: 22,
        },
        formSection: {
            marginBottom: 32,
        },
        label: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.foreground,
            marginBottom: 12,
        },
        cardFieldContainer: {
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: theme.border,
            backgroundColor: '#FFFFFF',
        },
        cardField: {
            height: 56,
        },
        infoBox: {
            backgroundColor: theme.backgroundTertiary,
            padding: 16,
            borderRadius: 12,
            marginTop: 24,
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        infoIcon: {
            marginRight: 12,
            marginTop: 2,
        },
        infoText: {
            flex: 1,
            fontSize: 14,
            color: theme.foregroundMuted,
            lineHeight: 20,
        },
        buttonContainer: {
            marginTop: 'auto',
            paddingBottom: insets.bottom || 20,
        },
        button: {
            backgroundColor: colors.primary[600],
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            shadowColor: colors.primary[600],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        buttonDisabled: {
            backgroundColor: theme.foregroundMuted,
            opacity: 0.6,
            shadowOpacity: 0,
            elevation: 0,
        },
        buttonText: {
            color: '#ffffff',
            fontSize: 17,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        secureInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: theme.backgroundTertiary,
            borderRadius: 8,
            gap: 8,
        },
        secureText: {
            fontSize: 13,
            color: theme.foregroundMuted,
            fontWeight: '500',
        },
        cardBrands: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
            gap: 12,
        },
        cardBrandText: {
            fontSize: 11,
            color: theme.foregroundMuted,
            fontWeight: '600',
            letterSpacing: 0.5,
        },
    });

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
                    <Text style={styles.headerTitle}>Pagamento Seguro</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Feather name="credit-card" size={36} color={colors.primary[600]} />
                    </View>

                    <Text style={styles.title}>Premium</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>R$ 49,90</Text>
                        <Text style={styles.priceSubtext}>/mês</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Complete os dados do cartão para desbloquear todos os recursos exclusivos
                    </Text>

                    <View style={styles.formSection}>
                        <Text style={styles.label}>Informações do Cartão</Text>
                        <View style={[
                            styles.cardFieldContainer,
                            cardComplete && { borderColor: colors.primary[600] }
                        ]}>
                            <CardField
                                postalCodeEnabled={false}
                                placeholders={{
                                    number: '1234 1234 1234 1234',
                                }}
                                cardStyle={{
                                    backgroundColor: '#FFFFFF',
                                    textColor: '#000000',
                                    placeholderColor: '#999999',
                                    fontSize: 16,
                                }}
                                style={styles.cardField}
                                onCardChange={(details) => {
                                    setCardDetails(details);
                                    setCardComplete(details.complete === true);
                                }}
                            />
                        </View>

                        {!cardComplete && (
                            <Text style={{
                                fontSize: 12,
                                color: theme.foregroundMuted,
                                marginTop: 8,
                                marginLeft: 4
                            }}>
                                Preencha número do cartão, validade (MM/AA) e CVV
                            </Text>
                        )}

                        <View style={styles.cardBrands}>
                            <Text style={styles.cardBrandText}>VISA</Text>
                            <Text style={styles.cardBrandText}>•</Text>
                            <Text style={styles.cardBrandText}>MASTERCARD</Text>
                            <Text style={styles.cardBrandText}>•</Text>
                            <Text style={styles.cardBrandText}>AMEX</Text>
                            <Text style={styles.cardBrandText}>•</Text>
                            <Text style={styles.cardBrandText}>ELO</Text>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Feather
                            name="info"
                            size={18}
                            color={colors.primary[600]}
                            style={styles.infoIcon}
                        />
                        <Text style={styles.infoText}>
                            Sua assinatura será renovada automaticamente. Você pode cancelar a qualquer momento.
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                (!cardComplete || loading) && styles.buttonDisabled,
                            ]}
                            onPress={handlePayment}
                            disabled={!cardComplete || loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <>
                                    <ActivityIndicator size="small" color="#ffffff" />
                                    <Text style={styles.buttonText}>Processando...</Text>
                                </>
                            ) : (
                                <>
                                    <Feather name="lock" size={18} color="#ffffff" />
                                    <Text style={styles.buttonText}>Confirmar Pagamento</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.secureInfo}>
                            <Feather name="shield" size={16} color={colors.primary[600]} />
                            <Text style={styles.secureText}>
                                Processamento 100% seguro via Stripe
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
