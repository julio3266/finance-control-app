import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { colors } from '@app/utils/colors';

interface SubscriptionSuccessModalProps {
    visible: boolean;
    onComplete: () => void;
}


export const SubscriptionSuccessModal: React.FC<SubscriptionSuccessModalProps> = ({
    visible,
    onComplete,
}) => {
    const insets = useSafeAreaInsets();

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const checkmarkScale = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const benefitsOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            checkmarkScale.setValue(0);
            textOpacity.setValue(0);
            benefitsOpacity.setValue(0);

            // Start animation sequence
            Animated.sequence([
                // Background fade in
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // Circle scale up with bounce
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                // Checkmark appear
                Animated.spring(checkmarkScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 50,
                    useNativeDriver: true,
                }),
                // Text fade in
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                // Benefits fade in
                Animated.timing(benefitsOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto navigate after 4 seconds
            const timer = setTimeout(() => {
                onComplete();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
        },
        content: {
            alignItems: 'center',
            width: '100%',
        },
        circleContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.success[500],
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
            shadowColor: colors.success[500],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 10,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 24,
        },
        benefitsContainer: {
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 20,
        },
        benefitsTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 16,
            textAlign: 'center',
        },
        benefitItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        benefitIconContainer: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.primary[600],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        benefitText: {
            fontSize: 15,
            color: '#ffffff',
            flex: 1,
        },
        redirectText: {
            position: 'absolute',
            bottom: insets.bottom + 40,
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
        },
        premiumBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.warning[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginBottom: 24,
        },
        premiumBadgeText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#ffffff',
            marginLeft: 6,
        },
    });

    const benefits = [
        'Cartões de crédito ilimitados',
        'Contas bancárias ilimitadas',
        'Open Finance - Sincronização automática',
        'Metas financeiras avançadas',
        'Relatórios e insights exclusivos',
        'Suporte prioritário',
    ];

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            statusBarTranslucent
        >
            <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
                <View style={styles.content}>
                    <Animated.View style={[styles.premiumBadge, { transform: [{ scale: scaleAnim }] }]}>
                        <Feather name="award" size={18} color="#ffffff" />
                        <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                    </Animated.View>

                    <Animated.View style={[styles.circleContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}>
                            <Feather name="check" size={60} color="#ffffff" />
                        </Animated.View>
                    </Animated.View>

                    <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
                        Parabéns! 🎉
                    </Animated.Text>

                    <Animated.Text style={[styles.subtitle, { opacity: textOpacity }]}>
                        Sua assinatura Premium foi ativada com sucesso.{'\n'}
                        Aproveite todos os recursos exclusivos!
                    </Animated.Text>

                    <Animated.View style={[styles.benefitsContainer, { opacity: benefitsOpacity }]}>
                        <Text style={styles.benefitsTitle}>Agora você tem acesso a</Text>
                        {benefits.map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <View style={styles.benefitIconContainer}>
                                    <Feather name="check" size={14} color="#ffffff" />
                                </View>
                                <Text style={styles.benefitText}>{benefit}</Text>
                            </View>
                        ))}
                    </Animated.View>
                </View>

                <Text style={styles.redirectText}>
                    Redirecionando para a tela inicial...
                </Text>
            </Animated.View>
        </Modal>
    );
};
