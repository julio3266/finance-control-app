import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { colors } from '@app/utils/colors';
import { useTheme } from '@app/utils/useTheme';

export default function SubscriptionSuccessScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const checkmarkScale = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const benefitsOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animation sequence
        Animated.sequence([
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
    }, []);

    const handleNavigateToConnections = () => {
        navigation.reset({
            index: 1,
            routes: [
                { name: 'HomeTabs' },
                { name: 'OpenFinance', params: { screen: 'ConnectAccounts' } },
            ],
        });
    };

    const handleGoHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomeTabs' }],
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
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
            color: theme.foreground,
            textAlign: 'center',
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 16,
            color: theme.foregroundMuted,
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 24,
        },
        benefitsContainer: {
            width: '100%',
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
        },
        benefitsTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.foregroundMuted,
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
            color: theme.foreground,
            flex: 1,
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
        buttonsContainer: {
            width: '100%',
            gap: 12,
        },
        primaryButton: {
            width: '100%',
            backgroundColor: colors.primary[600],
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: colors.primary[600],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        primaryButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#ffffff',
        },
        secondaryButton: {
            width: '100%',
            backgroundColor: 'transparent',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
        },
        secondaryButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.foreground,
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
        <View style={styles.container}>
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

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleNavigateToConnections}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Conectar Contas Bancárias</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleGoHome}
                    activeOpacity={0.8}
                >
                    <Text style={styles.secondaryButtonText}>Ir para Início</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
