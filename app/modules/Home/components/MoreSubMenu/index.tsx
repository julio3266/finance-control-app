import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

interface MoreSubMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onItemPress: (item: string) => void;
}

const menuItems = [
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'help', label: 'Ajuda', icon: '❓' },
    { id: 'about', label: 'Sobre', icon: 'ℹ️' },
];

export const MoreSubMenu: React.FC<MoreSubMenuProps> = ({
    isOpen,
    onClose,
    onItemPress,
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isOpen, slideAnim, opacityAnim]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            transparent
            visible={isOpen}
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styled.overlay}>
                    <Animated.View
                        style={[
                            styled.menuContainer,
                            {
                                opacity: opacityAnim,
                                transform: [{ translateY }],
                            },
                        ]}
                    >
                        <TouchableWithoutFeedback>
                            <View>
                                {menuItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styled.menuItem,
                                            index === 0 && styled.menuItemFirst,
                                            index === menuItems.length - 1 &&
                                            styled.menuItemLast,
                                        ]}
                                        onPress={() => {
                                            onItemPress(item.id);
                                            onClose();
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styled.menuItemIcon}>
                                            {item.icon}
                                        </Text>
                                        <Text style={styled.menuItemLabel}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

