import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '@app/store';
import { styles } from './styles';
import { useTheme } from '@app/utils/useTheme';
import { TextInput } from '@app/ui/TextInput';
import { Button } from '@app/ui/Button';
import { emailSchema } from '../../schemas';
import { sendOtp } from '../../slices/authApi';
import { ZodError } from 'zod';

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const theme = useTheme();
    const styled = styles(theme);
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.loading);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (emailError) {
            setEmailError('');
        }
    };

    const handleSubmit = async () => {
        try {

            emailSchema.parse({ email });
            setEmailError('');


            await dispatch(sendOtp(email)).unwrap();

            onSuccess?.();
        } catch (error) {
            if (error instanceof ZodError) {
                const firstError = error.issues?.[0];
                setEmailError(firstError?.message || 'Erro ao enviar código. Tente novamente.');
            } else {
                setEmailError('Erro ao enviar código. Tente novamente.');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styled.container}
        >
            <ScrollView
                contentContainerStyle={styled.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styled.iconContainer}>
                    <View style={styled.iconCircle}>
                        <Text style={styled.iconText}>✉️</Text>
                    </View>
                </View>

                <Text style={styled.title}>Bem-vindo de volta</Text>
                <Text style={styled.subtitle}>
                    Digite seu email para receber um código de acesso
                </Text>

                <TextInput
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={emailError}
                    icon={<Text style={styled.inputIcon}>@</Text>}
                />

                <Button
                    title="Continuar"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!email.trim()}
                    variant="primary"
                />

                <Text style={styled.legalText}>
                    Ao continuar, você concorda com nossos{' '}
                    <Text style={styled.legalLink}>Termos de Serviço</Text> e{' '}
                    <Text style={styled.legalLink}>Política de Privacidade</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

