import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './useTheme';
import { colors } from './colors';
import Feather from '@expo/vector-icons/Feather';

type ToastType = 'error' | 'success' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const theme = useTheme();

    const showToast = useCallback((message: string, type: ToastType = 'error') => {
        const id = Date.now().toString();
        const newToast: Toast = { id, message, type };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const getToastConfig = (type: ToastType) => {
        switch (type) {
            case 'error':
                return {
                    backgroundColor: colors.error[500],
                    icon: 'alert-circle',
                    iconColor: '#ffffff',
                };
            case 'success':
                return {
                    backgroundColor: colors.success[500],
                    icon: 'check-circle',
                    iconColor: '#ffffff',
                };
            case 'info':
                return {
                    backgroundColor: colors.primary[600],
                    icon: 'info',
                    iconColor: '#ffffff',
                };
            default:
                return {
                    backgroundColor: colors.error[500],
                    icon: 'alert-circle',
                    iconColor: '#ffffff',
                };
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={styles.container} pointerEvents="box-none">
                {toasts.map((toast) => {
                    const config = getToastConfig(toast.type);
                    return (
                        <ToastItem
                            key={toast.id}
                            toast={toast}
                            config={config}
                            theme={theme}
                            onRemove={removeToast}
                        />
                    );
                })}
            </View>
        </ToastContext.Provider>
    );
};

interface ToastItemProps {
    toast: Toast;
    config: { backgroundColor: string; icon: string; iconColor: string };
    theme: ReturnType<typeof useTheme>;
    onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, config, theme, onRemove }) => {
    const insets = useSafeAreaInsets();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(-100)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onRemove(toast.id);
            });
        }, 4000);

        return () => clearTimeout(timer);
    }, [fadeAnim, slideAnim, onRemove, toast.id]);

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    backgroundColor: config.backgroundColor,
                    top: insets.top + 16,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.toastContent}>
                <Feather name={config.icon as any} size={20} color={config.iconColor} />
                <Text style={styles.toastText}>{toast.message}</Text>
                <TouchableOpacity
                    onPress={() => onRemove(toast.id)}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Feather name="x" size={18} color={config.iconColor} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        alignItems: 'center',
    },
    toast: {
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 50,
        maxWidth: Dimensions.get('window').width - 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    toastContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    toastText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    closeButton: {
        padding: 4,
    },
});
