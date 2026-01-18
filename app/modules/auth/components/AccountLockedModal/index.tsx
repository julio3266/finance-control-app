import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';
import Feather from '@expo/vector-icons/Feather';

interface AccountLockedModalProps {
    isVisible: boolean;
    onClose: () => void;
    countdownSeconds?: number;
}

export const AccountLockedModal: React.FC<AccountLockedModalProps> = ({
    isVisible,
    onClose,
    countdownSeconds = 60,
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const [timeRemaining, setTimeRemaining] = useState(countdownSeconds);
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible && countdownSeconds > 0) {
            setTimeRemaining(countdownSeconds);

            const totalTime = 60;
            const initialProgress = 1 - (countdownSeconds / totalTime);
            progressAnim.setValue(Math.max(0, Math.min(1, initialProgress)));

            const interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            Animated.timing(progressAnim, {
                toValue: 1,
                duration: countdownSeconds * 1000,
                useNativeDriver: false,
            }).start();

            return () => clearInterval(interval);
        } else if (isVisible && countdownSeconds === 0) {
            onClose();
        }
    }, [isVisible, countdownSeconds, onClose, progressAnim]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    if (!isVisible) {
        return null;
    }

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styled.overlay}>
                <View style={styled.modalContainer}>
                    <View style={styled.header}>
                        <TouchableOpacity onPress={onClose} style={styled.closeButton}>
                            <Text style={styled.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styled.content}>
                        <View style={styled.iconContainer}>
                            <Feather name="clock" size={32} color={colors.error[600]} />
                        </View>

                        <Text style={styled.title}>Conta Bloqueada</Text>
                        <Text style={styled.message}>
                            Muitas tentativas incorretas. Aguarde para tentar novamente.
                        </Text>

                        <View style={styled.timerContainer}>
                            <Text style={styled.timer}>{formatTime(timeRemaining)}</Text>
                            <Text style={styled.timerLabel}>para liberar</Text>
                        </View>

                        <View style={styled.progressBarContainer}>
                            <Animated.View
                                style={[
                                    styled.progressBar,
                                    { width: progressWidth },
                                ]}
                            />
                        </View>

                        <Text style={styled.securityMessage}>
                            Isso é necessário para proteger sua conta.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

