import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

export type TransactionModalType = 'income' | 'expense' | 'investment';

interface TransactionCreationModalProps {
    modalizeRef: React.RefObject<IHandles>;
    type: TransactionModalType;
    isPremium: boolean;
    onManualPress: () => void;
    onOpenFinancePress: () => void;
}

const getConfig = (type: TransactionModalType) => {
    switch (type) {
        case 'income':
            return {
                title: 'Como deseja cadastrar sua receita?',
                manualLabel: 'Cadastrar de forma manual',
                openFinanceMessage: 'Conecte sua conta do banco e tenha suas receitas sincronizadas automaticamente',
                accentColor: '#059669',
            };
        case 'expense':
            return {
                title: 'Como deseja cadastrar sua despesa?',
                manualLabel: 'Cadastrar de forma manual',
                openFinanceMessage: 'Conecte sua conta do banco e tenha suas despesas sincronizadas automaticamente',
                accentColor: colors.error[500],
            };
        case 'investment':
            return {
                title: 'Como deseja cadastrar seu investimento?',
                manualLabel: 'Cadastrar de forma manual',
                openFinanceMessage: 'Conecte sua corretora e tenha seus investimentos sincronizados automaticamente',
                accentColor: colors.primary[600],
            };
        default:
            return {
                title: 'Como deseja cadastrar?',
                manualLabel: 'Cadastrar de forma manual',
                openFinanceMessage: 'Conecte sua conta e tenha seus dados sincronizados',
                accentColor: colors.primary[600],
            };
    }
};

export const TransactionCreationModal: React.FC<TransactionCreationModalProps> = ({
    modalizeRef,
    type,
    isPremium,
    onManualPress,
    onOpenFinancePress,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);
    const config = getConfig(type);

    const handleManualPress = () => {
        modalizeRef.current?.close();
        setTimeout(() => {
            onManualPress();
        }, 300);
    };

    const handleOpenFinancePress = () => {
        modalizeRef.current?.close();
        setTimeout(() => {
            onOpenFinancePress();
        }, 300);
    };

    return (
        <Modalize
            ref={modalizeRef}
            modalStyle={styled.modal}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            adjustToContentHeight
        >
            <View style={[styled.content, { paddingBottom: insets.bottom + 20 }]}>
                <Text style={styled.title}>{config.title}</Text>

                <TouchableOpacity
                    style={styled.optionItem}
                    onPress={handleManualPress}
                    activeOpacity={0.7}
                >
                    <View style={[styled.optionIconContainer, { backgroundColor: `${config.accentColor}15` }]}>
                        <Feather name="edit-3" size={24} color={config.accentColor} />
                    </View>
                    <View style={styled.optionContent}>
                        <Text style={styled.optionTitle}>{config.manualLabel}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.foregroundMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styled.optionItem}
                    onPress={handleOpenFinancePress}
                    activeOpacity={0.7}
                >
                    <View style={[styled.optionIconContainer, styled.openFinanceIconContainer]}>
                        <FontAwesome6 name="link" size={24} color="#9333EA" />
                    </View>
                    <View style={styled.optionContent}>
                        <View style={styled.openFinanceHeader}>
                            <Text style={styled.optionTitle}>Open Finance</Text>
                            <View style={styled.premiumBadge}>
                                <Feather name="star" size={12} color="#9333EA" />
                                <Text style={styled.premiumText}>Premium</Text>
                            </View>
                        </View>
                        <Text style={styled.optionMessage}>
                            {config.openFinanceMessage}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Modalize>
    );
};
