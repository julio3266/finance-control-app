import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@app/utils/colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { styles } from './styles';

interface WelcomeScreenProps {
    onStart: () => void;
}

interface StepItemProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

const StepItem: React.FC<StepItemProps> = ({ icon, title, subtitle }) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={styled.stepItem}>
            <View style={styled.stepIcon}>{icon}</View>
            <View style={styled.stepContent}>
                <Text style={styled.stepTitle}>{title}</Text>
                <Text style={styled.stepSubtitle}>{subtitle}</Text>
            </View>
        </View>
    );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const theme = useTheme();
    const styled = styles(theme);
    const insets = useSafeAreaInsets();

    return (
        <View style={[styled.container, { paddingTop: insets.top + 40 }]}>
            <View style={styled.logoContainer}>
                <View style={styled.logoBox}>
                    <FontAwesome6 name="arrow-trend-up" size={40} color="#ffffff" />
                </View>
            </View>

            <Text style={styled.title}>
                Bem-vindo ao <Text style={styled.titleHighlight}>Finance Control</Text>
            </Text>
            <Text style={styled.subtitle}>
                Vamos configurar sua conta em poucos passos para você começar a organizar suas
                finanças.
            </Text>

            <View style={styled.stepsContainer}>
                <StepItem
                    icon={<Feather name="user" size={20} color={colors.primary[400]} />}
                    title="Dados Pessoais"
                    subtitle="Nome e informações básicas"
                />
                <StepItem
                    icon={<FontAwesome5 name="university" size={18} color={colors.primary[400]} />}
                    title="Primeira Conta"
                    subtitle="Configure sua conta principal"
                />
            </View>

            <TouchableOpacity style={styled.button} onPress={onStart} activeOpacity={0.8}>
                <Text style={styled.buttonText}>Começar</Text>
                <Feather name="arrow-right" size={20} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

export default WelcomeScreen;
