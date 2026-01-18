import { useTheme } from '@app/utils/useTheme';
import React, { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, View, Animated } from 'react-native';
import { LoginForm, OTPForm } from '../../components';
import { IHandles } from 'react-native-modalize/lib/options';
import { styles } from './styles';
import { Button } from '@app/ui/Button';
import { LoginHeader } from '../../components/LoginHeader';
import { Modal } from '@app/ui/Modal';
import { useAppSelector } from '@app/store';

export default function LoginScreen() {
    const theme = useTheme();
    const modalizeRef = useRef<IHandles>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const [showOtp, setShowOtp] = React.useState(false);
    const email = useAppSelector((state) => state.auth.email);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const openModal = () => {
        modalizeRef.current?.open();
    };

    const screenStyles = styles(theme);

    return (
        <KeyboardAvoidingView
            style={screenStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <LoginHeader slideAnim={slideAnim} fadeAnim={fadeAnim} />
            <View style={screenStyles.footer}>
                <Button
                    title="Comece gratuitamente"
                    onPress={openModal}
                    variant="primary"
                    size="large"
                />
            </View>

            <Modal modalizeRef={modalizeRef}>
                {showOtp && email ? (
                    <OTPForm
                        email={email}
                        onBack={() => setShowOtp(false)}
                        onClose={() => {
                            modalizeRef.current?.close();
                            setShowOtp(false);
                        }}
                    />
                ) : (
                    <LoginForm onSuccess={() => setShowOtp(true)} />
                )}
            </Modal>
        </KeyboardAvoidingView>
    );
}
