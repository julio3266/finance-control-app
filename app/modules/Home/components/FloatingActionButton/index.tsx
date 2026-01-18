import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

interface FloatingActionButtonProps {
    onPress?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress }) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <TouchableOpacity style={styled.fab} onPress={onPress} activeOpacity={0.8}>
            <Text style={styled.fabIcon}>+</Text>
        </TouchableOpacity>
    );
};
