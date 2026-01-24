import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';

interface EmptyGoalProps {
    onAddGoal?: () => void;
    onPress?: () => void;
    fullWidth?: boolean;
}

export const EmptyGoal: React.FC<EmptyGoalProps> = ({ onAddGoal, onPress, fullWidth = false }) => {
    const styled = styles(fullWidth);

    const gradientColors: [string, string, string] = ['#1a1a2e', '#16213e', '#0f3460'];

    const handlePress = onAddGoal || onPress;

    const content = (
        <View style={styled.container}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styled.card}
            >
                <View style={styled.content}>
                    <View style={styled.iconContainer}>
                        <Feather name="target" size={40} color="rgba(255, 255, 255, 0.6)" />
                    </View>
                    <Text style={styled.text}>Criar nova meta</Text>
                </View>
            </LinearGradient>
        </View>
    );

    if (handlePress) {
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

