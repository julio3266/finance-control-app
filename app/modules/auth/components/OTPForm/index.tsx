import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { styles } from './styles';
import { useTheme, useThemeMode } from '@app/utils/useTheme';
import { Button } from '@app/ui/Button';
import { useAppDispatch, useAppSelector } from '@app/store';
import { loginUser } from '../../slices/authApi';
import { incrementOtpAttempts, resetOtpAttempts, unlockAccount } from '../../slices/authSlice';
import { otpSchema } from '../../schemas';
import { ZodError } from 'zod';
import { AccountLockedModal } from '../AccountLockedModal';

interface OTPFormProps {
    email: string;
    onBack?: () => void;
    onClose?: () => void;
}

export const OTPForm: React.FC<OTPFormProps> = ({ email, onBack, onClose }) => {
    const theme = useTheme();
    const themeMode = useThemeMode();
    const styled = styles(theme, themeMode);
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.loading);
    const otpAttempts = useAppSelector((state) => state.auth.otpAttempts);
    const lockUntil = useAppSelector((state) => state.auth.lockUntil);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const isLocked = lockUntil ? new Date(lockUntil) > new Date() : false;
    const getRemainingSeconds = (): number => {
        if (!lockUntil) return 0;
        const remaining = Math.max(0, Math.floor((new Date(lockUntil).getTime() - Date.now()) / 1000));
        return remaining;
    };

    React.useEffect(() => {
        if (lockUntil) {
            const checkInterval = setInterval(() => {
                const lockDate = new Date(lockUntil);
                const now = new Date();
                if (lockDate <= now) {
                    dispatch(unlockAccount());
                }
            }, 1000);

            return () => clearInterval(checkInterval);
        }
    }, [lockUntil, dispatch]);

    const handleOtpChange = (value: string, index: number) => {
        if (otpError) {
            setOtpError('');
        }

        if (value.length > 1) {
            const digits = value.replace(/\D/g, '').slice(0, 6).split('');
            const newOtp = [...otp];

            digits.forEach((digit, i) => {
                if (i < 6) {
                    newOtp[i] = digit;
                }
            });

            setOtp(newOtp);

            const lastFilledIndex = Math.min(digits.length - 1, 5);
            setTimeout(() => {
                inputRefs.current[lastFilledIndex]?.focus();
            }, 0);
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace') {
            if (otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                setTimeout(() => {
                    inputRefs.current[index - 1]?.focus();
                }, 0);
            }
            else if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const triggerShakeAnimation = () => {
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const clearOtp = () => {
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const handleVerify = async () => {
        if (isLocked) {
            setOtpError('Conta bloqueada. Aguarde o tempo restante.');
            return;
        }

        try {
            const otpCode = otp.join('');

            otpSchema.parse({ otp: otpCode });
            setOtpError('');

            await dispatch(loginUser({ email, otp: otpCode })).unwrap();
        } catch (error) {
            dispatch(incrementOtpAttempts());

            triggerShakeAnimation();

            clearOtp();

            const newAttempts = otpAttempts + 1;
            if (newAttempts >= 3) {
                setOtpError('Muitas tentativas incorretas. Conta bloqueada temporariamente.');
            } else {
                if (error instanceof ZodError) {
                    const firstError = error.issues?.[0];
                    setOtpError(firstError?.message || 'Código inválido');
                } else {
                    setOtpError(`Código incorreto. Tentativas restantes: ${3 - newAttempts}`);
                }
            }
        }
    };

    const handleUnlock = () => {
        dispatch(unlockAccount());
        setOtpError('');
        clearOtp();
    };

    const handleResend = () => {
        console.log('Reenviar código');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styled.container}
        >
            <View style={styled.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styled.headerButton}>
                        <Text style={styled.headerIcon}>‹</Text>
                    </TouchableOpacity>
                )}
                {onClose && (
                    <TouchableOpacity onPress={onClose} style={styled.headerButtonRight}>
                        <Text style={styled.headerIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                contentContainerStyle={styled.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styled.iconContainer}>
                    <View style={styled.iconCircle}>
                        <Text style={styled.iconText}>🔐</Text>
                    </View>
                </View>

                <Text style={styled.title}>Verifique seu email</Text>
                <Text style={styled.subtitle}>
                    Enviamos um código de 6 dígitos para
                </Text>
                <Text style={styled.email}>{email}</Text>

                <Animated.View
                    style={[
                        styled.otpContainer,
                        {
                            transform: [{ translateX: shakeAnim }],
                        },
                    ]}
                >
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            style={[
                                styled.otpInput,
                                digit && styled.otpInputFilled,
                                otpError && styled.otpInputError,
                            ]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={({ nativeEvent }) =>
                                handleKeyPress(nativeEvent.key, index)
                            }
                            keyboardType="number-pad"
                            maxLength={6}
                            selectTextOnFocus
                            textAlign="center"
                            autoFocus={index === 0}
                            editable={!isLocked}
                            textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : undefined}
                            autoComplete={Platform.OS === 'android' ? 'sms-otp' : undefined}
                            importantForAutofill={Platform.OS === 'android' ? 'yes' : undefined}
                        />
                    ))}
                </Animated.View>

                {otpError && (
                    <Text style={styled.errorText}>{otpError}</Text>
                )}

                <Button
                    title="Verificar Código"
                    onPress={handleVerify}
                    variant="primary"
                    loading={loading}
                    disabled={otp.some((digit) => !digit) || loading || isLocked}
                />

                <View style={styled.resendContainer}>
                    <Text style={styled.resendText}>Não recebeu o código? </Text>
                    <TouchableOpacity onPress={handleResend}>
                        <Text style={styled.resendLink}>Reenviar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <AccountLockedModal
                isVisible={isLocked}
                onClose={handleUnlock}
                countdownSeconds={getRemainingSeconds() || 60}
            />
        </KeyboardAvoidingView>
    );
};

