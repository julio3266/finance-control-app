import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 40 - 16;

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

const styles = () =>
    StyleSheet.create({
        container: {
            marginRight: 16,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: 'flex-start',
        },
        card: {
            width: CARD_WIDTH,
            height: 220,
            padding: 24,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderStyle: 'dashed',
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
        },
        text: {
            fontSize: 16,
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
        },
    });
