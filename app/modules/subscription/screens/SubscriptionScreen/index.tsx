import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { styles } from './styles';

export default function SubscriptionScreen() {
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<any>>();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styled.backButton}>
                <Feather name="arrow-left" size={24} color={theme.foreground} />
            </TouchableOpacity>
            <Text style={styled.headerTitle}>Assinatura Premium</Text>
            <View style={styled.backButton} />
        </View>
    );

    return (
        <ScreenWithHeader customHeader={renderHeader()}>
            <ScrollView
                style={styled.container}
                contentContainerStyle={[styled.content, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styled.heroSection}>
                    <View style={styled.iconContainer}>
                        <Feather name="star" size={64} color={colors.primary[600]} />
                    </View>
                    <Text style={styled.heroTitle}>Torne-se Premium</Text>
                    <Text style={styled.heroSubtitle}>
                        Desbloqueie recursos exclusivos e tenha controle total das suas finanças
                    </Text>
                </View>

                <View style={styled.featuresSection}>
                    <Text style={styled.sectionTitle}>Recursos Premium</Text>

                    <View style={styled.featureItem}>
                        <View style={styled.featureIcon}>
                            <Feather name="link" size={24} color={colors.primary[600]} />
                        </View>
                        <View style={styled.featureContent}>
                            <Text style={styled.featureTitle}>Open Finance</Text>
                            <Text style={styled.featureDescription}>
                                Conecte suas contas bancárias e sincronize transações
                                automaticamente
                            </Text>
                        </View>
                    </View>

                    <View style={styled.featureItem}>
                        <View style={styled.featureIcon}>
                            <Feather name="bar-chart-2" size={24} color={colors.primary[600]} />
                        </View>
                        <View style={styled.featureContent}>
                            <Text style={styled.featureTitle}>Relatórios Avançados</Text>
                            <Text style={styled.featureDescription}>
                                Análises detalhadas e insights sobre seus gastos
                            </Text>
                        </View>
                    </View>

                    <View style={styled.featureItem}>
                        <View style={styled.featureIcon}>
                            <Feather name="shield" size={24} color={colors.primary[600]} />
                        </View>
                        <View style={styled.featureContent}>
                            <Text style={styled.featureTitle}>Segurança Avançada</Text>
                            <Text style={styled.featureDescription}>
                                Proteção adicional para seus dados financeiros
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styled.subscribeButton} activeOpacity={0.8}>
                    <Text style={styled.subscribeButtonText}>Assinar Premium</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenWithHeader>
    );
}
