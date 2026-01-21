import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';

interface EmptyCardProps {
    onAddCard?: () => void;
    onPress?: () => void;
}

export const EmptyCard: React.FC<EmptyCardProps> = ({ onAddCard, onPress }) => {
    const styled = styles();

    const gradientColors: [string, string, string] = ['#1a1a2e', '#16213e', '#0f3460'];

    const handlePress = onAddCard || onPress;

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styled.container}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styled.card}
            >
                <View style={styled.content}>
                    <View style={styled.iconContainer}>
                        <Feather name="plus" size={40} color="rgba(255, 255, 255, 0.6)" />
                    </View>
                    <Text style={styled.text}>Cadastrar novo cartão</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};
