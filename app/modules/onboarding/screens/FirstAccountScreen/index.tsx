import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TextInput } from '@app/ui/TextInput';
import { styles } from './styles';

interface FirstAccountScreenProps {
    onFinish: (data: AccountData) => void;
    onBack: () => void;
    loading?: boolean;
}

export interface AccountData {
    name: string;
    institution: string;
    type: AccountType;
    initialBalance: string;
    color: string;
}

type AccountType = 'checking' | 'savings' | 'cash' | 'credit' | 'investment' | 'other';

const ACCOUNT_TYPES: { type: AccountType; label: string; icon: React.ReactNode }[] = [
    {
        type: 'checking',
        label: 'Conta Corrente',
        icon: <FontAwesome5 name="university" size={20} color={colors.primary[400]} />,
    },
    {
        type: 'savings',
        label: 'Poupança',
        icon: <FontAwesome5 name="piggy-bank" size={20} color={colors.primary[400]} />,
    },
    {
        type: 'cash',
        label: 'Dinheiro',
        icon: <MaterialCommunityIcons name="cash" size={24} color={colors.primary[400]} />,
    },
    {
        type: 'credit',
        label: 'Cartão de Crédito',
        icon: <Feather name="credit-card" size={20} color={colors.primary[400]} />,
    },
    {
        type: 'investment',
        label: 'Investimento',
        icon: <FontAwesome5 name="chart-line" size={18} color={colors.primary[400]} />,
    },
    {
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
    '#8B5CF6',
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
    const [institution, setInstitution] = useState('');
    const [type, setType] = useState<AccountType>('checking');
    const [initialBalance, setInitialBalance] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    const isValid = name.trim() && institution.trim();

    const handleFinish = () => {
        if (isValid) {
            onFinish({ name, institution, type, initialBalance, color });
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
                            Nome da Conta <Text style={styled.required}>*</Text>
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
                        <TextInput
                            placeholder="Digite para buscar..."
                            value={institution}
                            onChangeText={setInstitution}
                        />
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Tipo de Conta</Text>
                        <View style={styled.typesGrid}>
                            {ACCOUNT_TYPES.map((item) => (
                                <TouchableOpacity
                                    key={item.type}
                                    style={[
                                        styled.typeCard,
                                        type === item.type && styled.typeCardActive,
                                    ]}
                                    onPress={() => setType(item.type)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styled.typeIcon}>{item.icon}</View>
                                    <Text
                                        style={[
                                            styled.typeLabel,
                                            type === item.type && styled.typeLabelActive,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styled.inputGroup}>
                        <Text style={styled.label}>Saldo Inicial</Text>
                        <TextInput
                            placeholder="R$ 0,00"
                            value={initialBalance}
                            onChangeText={setInitialBalance}
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
        </KeyboardAvoidingView>
    );
};

export default FirstAccountScreen;
