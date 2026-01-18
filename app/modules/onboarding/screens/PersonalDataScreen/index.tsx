import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import { TextInput } from '@app/ui/TextInput';
import { useAppDispatch, useAppSelector } from '@app/store';
import { fetchAddressByCep, clearCepData } from '../../slices';
import { personalDataSchema } from '../../schemas';
import { ZodError } from 'zod';
import { styles } from './styles';

interface PersonalDataScreenProps {
    onContinue: (data: PersonalData) => void;
    onBack: () => void;
}

export interface PersonalData {
    firstName: string;
    lastName: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement: string;
}

export const PersonalDataScreen: React.FC<PersonalDataScreenProps> = ({ onContinue, onBack }) => {
    const theme = useTheme();
    const styled = styles(theme);
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    const cepLoading = useAppSelector((state) => state.onboarding.cepLoading);
    const cepError = useAppSelector((state) => state.onboarding.cepError);
    const addressFromCep = useAppSelector((state) => state.onboarding.address);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [complement, setComplement] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (addressFromCep) {
            setStreet(addressFromCep.street || '');
            setNeighborhood(addressFromCep.neighborhood || '');
            setCity(addressFromCep.city || '');
            setState(addressFromCep.state || '');
            if (addressFromCep.complement) {
                setComplement(addressFromCep.complement);
            }
        }
    }, [addressFromCep]);

    useEffect(
        () => () => {
            dispatch(clearCepData());
        },
        [dispatch],
    );

    const formatCep = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 5) {
            return numbers;
        }
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    };

    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) {
            return numbers;
        }
        if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        }
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleCepChange = (value: string) => {
        const formatted = formatCep(value);
        setCep(formatted);

        const cleanCep = value.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            dispatch(fetchAddressByCep(cleanCep));
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhone(formatPhone(value));
    };

    const validateForm = (): boolean => {
        try {
            personalDataSchema.parse({
                firstName,
                lastName,
                phone,
                cep,
                street,
                number,
                neighborhood,
                city,
                state,
                complement,
            });
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path.length > 0) {
                        newErrors[issue.path[0] as string] = issue.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const isValid = firstName.trim() && lastName.trim();

    const handleContinue = () => {
        if (validateForm()) {
            onContinue({
                firstName,
                lastName,
                phone,
                cep,
                street,
                number,
                neighborhood,
                city,
                state,
                complement,
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styled.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={[styled.scrollView, { paddingTop: insets.top + 16 }]}
                contentContainerStyle={styled.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styled.stepsIndicator}>
                    <View style={styled.stepBadgeActive}>
                        <Text style={styled.stepNumber}>1</Text>
                        <Text style={styled.stepLabelActive}>Dados Pessoais</Text>
                    </View>
                    <View style={styled.stepBadge}>
                        <Text style={styled.stepNumberInactive}>2</Text>
                        <Text style={styled.stepLabel}>Primeira Conta</Text>
                    </View>
                </View>

                <View style={styled.iconContainer}>
                    <View style={styled.iconBox}>
                        <Feather name="user" size={32} color={colors.primary[400]} />
                    </View>
                </View>

                <Text style={styled.title}>Dados Pessoais</Text>
                <Text style={styled.subtitle}>Conte-nos um pouco sobre você</Text>

                <View style={styled.form}>
                    <View style={styled.row}>
                        <View style={styled.halfInput}>
                            <Text style={styled.label}>
                                Nome <Text style={styled.required}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Seu nome"
                                value={firstName}
                                onChangeText={setFirstName}
                                error={errors.firstName}
                            />
                        </View>
                        <View style={styled.halfInput}>
                            <Text style={styled.label}>
                                Sobrenome <Text style={styled.required}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Seu sobrenome"
                                value={lastName}
                                onChangeText={setLastName}
                                error={errors.lastName}
                            />
                        </View>
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Telefone</Text>
                        <TextInput
                            placeholder="(00) 00000-0000"
                            value={phone}
                            onChangeText={handlePhoneChange}
                            keyboardType="phone-pad"
                            error={errors.phone}
                        />
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>CEP</Text>
                        <View style={styled.cepInputContainer}>
                            <TextInput
                                placeholder="00000-000"
                                value={cep}
                                onChangeText={handleCepChange}
                                keyboardType="number-pad"
                                maxLength={9}
                                error={errors.cep || cepError || undefined}
                            />
                            {cepLoading && (
                                <View style={styled.cepLoader}>
                                    <ActivityIndicator size="small" color={colors.primary[500]} />
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styled.row}>
                        <View style={styled.streetInput}>
                            <Text style={styled.label}>Rua</Text>
                            <TextInput
                                placeholder="Nome da rua"
                                value={street}
                                onChangeText={setStreet}
                            />
                        </View>
                        <View style={styled.numberInput}>
                            <Text style={styled.label}>Número</Text>
                            <TextInput
                                placeholder="Nº"
                                value={number}
                                onChangeText={setNumber}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Bairro</Text>
                        <TextInput
                            placeholder="Bairro"
                            value={neighborhood}
                            onChangeText={setNeighborhood}
                        />
                    </View>

                    <View style={styled.row}>
                        <View style={styled.cityInput}>
                            <Text style={styled.label}>Cidade</Text>
                            <TextInput placeholder="Cidade" value={city} onChangeText={setCity} />
                        </View>
                        <View style={styled.stateInput}>
                            <Text style={styled.label}>UF</Text>
                            <TextInput
                                placeholder="UF"
                                value={state}
                                onChangeText={setState}
                                maxLength={2}
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Complemento</Text>
                        <TextInput
                            placeholder="Apartamento, bloco, etc."
                            value={complement}
                            onChangeText={setComplement}
                        />
                    </View>
                </View>

                <View style={styled.buttonsContainer}>
                    <TouchableOpacity
                        style={styled.backButton}
                        onPress={onBack}
                        activeOpacity={0.7}
                    >
                        <Text style={styled.backButtonText}>Voltar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styled.continueButton, !isValid && styled.continueButtonDisabled]}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                        disabled={!isValid}
                    >
                        <Text style={styled.continueButtonText}>Continuar</Text>
                        <Feather name="arrow-right" size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                <Text style={styled.requiredNote}>
                    Os campos marcados com <Text style={styled.required}>*</Text> são obrigatórios
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PersonalDataScreen;
