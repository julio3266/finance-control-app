import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useThemeMode } from '@app/utils/useTheme';
import { useAppDispatch } from '@app/store';
import { toggleTheme } from '@app/store/themeSlice';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';

interface AnimatedHeaderProps {
    onProfilePress?: () => void;
}

export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ onProfilePress }) => {
    const theme = useTheme();
    const themeMode = useThemeMode();
    const dispatch = useAppDispatch();
    const styled = styles(theme);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const gradientColors: [string, string, string] =
        themeMode === 'dark'
            ? [colors.primary[800], colors.primary[600], colors.primary[700]]
            : [colors.primary[600], colors.primary[500], colors.primary[700]];

    return (
        <View style={styled.wrapper}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styled.headerGradient}
            >
                <View style={styled.headerContent}>
                    <TouchableOpacity
                        style={styled.avatarButton}
                        onPress={onProfilePress}
                        activeOpacity={0.7}
                    >
                        <View style={styled.avatar}>
                            <Feather name="user" size={20} color={colors.primary[600]} />
                        </View>
                    </TouchableOpacity>
                    <View style={styled.titleSection}>
                        <Text style={styled.subtitle}>Balanço</Text>
                        <Text style={styled.title}>R$ 50.000,00</Text>
                    </View>
                    <TouchableOpacity
                        style={styled.themeButton}
                        onPress={handleThemeToggle}
                        activeOpacity={0.7}
                    >
                        <Feather
                            name={themeMode === 'dark' ? 'sun' : 'moon'}
                            size={24}
                            color="#ffffff"
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};
