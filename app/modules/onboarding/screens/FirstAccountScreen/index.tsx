import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useTheme } from '@app/utils/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TextInput } from '@app/ui/TextInput';
import { InstitutionPicker } from '../../components';
import { Institution } from '../../slices';
import { styles } from './styles';

// Função para formatar valor como moeda brasileira
const formatCurrencyInput = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    if (!numbers) return '';

    // Converte para número (centavos)
    const cents = parseInt(numbers, 10);

    // Converte para reais
    const reais = cents / 100;

    // Formata como moeda brasileira
    return reais.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

// Função para extrair o valor numérico (em centavos) de um valor formatado
const parseCurrencyValue = (formattedValue: string): number => {
    const numbers = formattedValue.replace(/\D/g, '');
    return numbers ? parseInt(numbers, 10) : 0;
};

interface FirstAccountScreenProps {
    onFinish: (data: AccountData) => void;
    onBack: () => void;
    loading?: boolean;
}

export interface AccountData {
    name: string;
    institution: string;
    institutionId?: string;
    institutionLogo?: string;
    type: AccountType;
    initialBalance: string;
    color: string;
}

type AccountType = 'checking' | 'savings' | 'cash' | 'credit' | 'investment' | 'other';

const ACCOUNT_TYPES: { id: string; type: AccountType; label: string; icon: React.ReactNode }[] = [
    {
        id: '1',
        type: 'checking',
        label: 'Conta Corrente',
        icon: <FontAwesome5 name="university" size={20} color={colors.primary[400]} />,
    },
    {
        id: '2',
        type: 'savings',
        label: 'Poupança',
        icon: <FontAwesome5 name="piggy-bank" size={20} color={colors.primary[400]} />,
    },
    {
        id: '3',
        type: 'cash',
        label: 'Dinheiro',
        icon: <MaterialCommunityIcons name="cash" size={24} color={colors.primary[400]} />,
    },
    {
        id: '4',
        type: 'credit',
        label: 'Cartão de Crédito',
        icon: <Feather name="credit-card" size={20} color={colors.primary[400]} />,
    },
    {
        id: '5',
        type: 'investment',
        label: 'Investimento',
        icon: <FontAwesome5 name="chart-line" size={18} color={colors.primary[400]} />,
    },
    {
        id: '6',
        type: 'other',
        label: 'Outro',
        icon: <Feather name="folder" size={20} color={colors.primary[400]} />,
    },
];

const COLORS = [
    '#8B5CF6',
    '#3B82F6',
    '#10B981',
    '#14B8A6',
    '#F59E0B',
    '#EF4444',
    '#EC4899',
    '#6366F1',
];

export const FirstAccountScreen: React.FC<FirstAccountScreenProps> = ({
    onFinish,
    onBack,
    loading,
}) => {
    const theme = useTheme();
    const styled = styles(theme);
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [type, setType] = useState<AccountType>('checking');
    const [initialBalance, setInitialBalance] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    const typeModalRef = useRef<IHandles>(null);

    const isValid = name.trim() && selectedInstitution !== null;

    const selectedTypeData = ACCOUNT_TYPES.find((item) => item.type === type);

    const handleSelectInstitution = useCallback((inst: Institution) => {
        setSelectedInstitution(inst);
    }, []);

    const handleBalanceChange = useCallback((text: string) => {
        const formatted = formatCurrencyInput(text);
        setInitialBalance(formatted);
    }, []);

    const handleOpenTypePicker = useCallback(() => {
        typeModalRef.current?.open();
    }, []);

    const handleSelectType = useCallback((selectedType: AccountType) => {
        setType(selectedType);
        typeModalRef.current?.close();
    }, []);

    const handleFinish = () => {
        if (isValid && selectedInstitution) {
            onFinish({
                name,
                institution: selectedInstitution.name,
                institutionId: selectedInstitution.id,
                institutionLogo: selectedInstitution.logo || selectedInstitution.localLogo,
                type,
                initialBalance,
                color,
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
                    <View style={styled.stepBadgeCompleted}>
                        <Feather name="check" size={14} color="#ffffff" />
                        <Text style={styled.stepLabelCompleted}>Dados Pessoais</Text>
                    </View>
                    <View style={styled.stepBadgeActive}>
                        <Text style={styled.stepNumber}>2</Text>
                        <Text style={styled.stepLabelActive}>Primeira Conta</Text>
                    </View>
                </View>

                <View style={styled.iconContainer}>
                    <View style={styled.iconBox}>
                        <Feather name="credit-card" size={32} color={colors.primary[400]} />
                    </View>
                </View>

                <Text style={styled.title}>Sua Primeira Conta</Text>
                <Text style={styled.subtitle}>Configure sua conta principal</Text>

                <View style={styled.form}>
                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>
                            Título <Text style={styled.required}>*</Text>
                        </Text>
                        <TextInput
                            placeholder="Ex: Conta Principal, Nubank, etc."
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>
                            Instituição <Text style={styled.required}>*</Text>
                        </Text>
                        <InstitutionPicker
                            value={selectedInstitution}
                            onSelect={handleSelectInstitution}
                            placeholder="Selecione uma instituição"
                        />
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Tipo de Conta</Text>
                        <TouchableOpacity
                            style={styled.selectButton}
                            onPress={handleOpenTypePicker}
                            activeOpacity={0.7}
                        >
                            <View style={styled.selectContent}>
                                {selectedTypeData && (
                                    <View style={styled.selectIcon}>
                                        {selectedTypeData.icon}
                                    </View>
                                )}
                                <Text style={styled.selectText}>
                                    {selectedTypeData?.label || 'Selecione um tipo'}
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                        </TouchableOpacity>
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Saldo Inicial</Text>
                        <TextInput
                            placeholder="R$ 0,00"
                            value={initialBalance}
                            onChangeText={handleBalanceChange}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Cor</Text>
                        <View style={styled.colorsRow}>
                            {COLORS.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styled.colorOption,
                                        { backgroundColor: c },
                                        color === c && styled.colorOptionActive,
                                    ]}
                                    onPress={() => setColor(c)}
                                    activeOpacity={0.7}
                                />
                            ))}
                        </View>
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
                        style={[styled.finishButton, !isValid && styled.finishButtonDisabled]}
                        onPress={handleFinish}
                        activeOpacity={0.8}
                        disabled={!isValid || loading}
                    >
                        <Feather name="check" size={20} color="#ffffff" />
                        <Text style={styled.finishButtonText}>
                            {loading ? 'Salvando...' : 'Finalizar'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Account Type BottomSheet */}
            <Modalize
                ref={typeModalRef}
                adjustToContentHeight
                modalStyle={styled.bottomSheet}
                handleStyle={styled.bottomSheetHandle}
                overlayStyle={styled.bottomSheetOverlay}
                closeOnOverlayTap
            >
                <View style={[styled.bottomSheetContent, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={styled.bottomSheetHeader}>
                        <Text style={styled.bottomSheetTitle}>Tipo de Conta</Text>
                        <TouchableOpacity
                            onPress={() => typeModalRef.current?.close()}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Feather name="x" size={24} color={theme.foreground} />
                        </TouchableOpacity>
                    </View>

                    <View style={styled.typesList}>
                        {ACCOUNT_TYPES.map((item) => (
                            <TouchableOpacity
                                key={item.type}
                                style={[
                                    styled.typeOption,
                                    type === item.type && styled.typeOptionActive,
                                ]}
                                onPress={() => handleSelectType(item.type)}
                                activeOpacity={0.7}
                            >
                                <View style={styled.typeOptionLeft}>
                                    <View style={[
                                        styled.typeOptionIcon,
                                        type === item.type && styled.typeOptionIconActive,
                                    ]}>
                                        {item.icon}
                                    </View>
                                    <Text style={[
                                        styled.typeOptionLabel,
                                        type === item.type && styled.typeOptionLabelActive,
                                    ]}>
                                        {item.label}
                                    </Text>
                                </View>
                                {type === item.type && (
                                    <Feather name="check" size={20} color={colors.primary[500]} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modalize>
        </KeyboardAvoidingView>
    );
};

export default FirstAccountScreen;
