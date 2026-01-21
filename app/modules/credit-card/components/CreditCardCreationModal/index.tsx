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

interface CreditCardCreationModalProps {
    modalizeRef: React.RefObject<IHandles>;
    isPremium: boolean;
    onManualPress: () => void;
    onOpenFinancePress: () => void;
}

export const CreditCardCreationModal: React.FC<CreditCardCreationModalProps> = ({
    modalizeRef,
    isPremium,
    onManualPress,
    onOpenFinancePress,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const handleManualPress = () => {
        modalizeRef.current?.close();
        onManualPress();
    };

    const handleOpenFinancePress = () => {
        modalizeRef.current?.close();
        onOpenFinancePress();
    };

    return (
        <Modalize
            ref={modalizeRef}
            modalStyle={styled.modal}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            adjustToContentHeight
        >
            <View style={[styled.content, { paddingBottom: insets.bottom }]}>
                <Text style={styled.title}>Como deseja cadastrar seu cartão?</Text>

                <TouchableOpacity
                    style={styled.optionItem}
                    onPress={handleManualPress}
                    activeOpacity={0.7}
                >
                    <View style={styled.optionIconContainer}>
                        <Feather name="edit-3" size={24} color={colors.primary[600]} />
                    </View>
                    <View style={styled.optionContent}>
                        <Text style={styled.optionTitle}>Cadastrar de forma manual</Text>
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
                            {isPremium && (
                                <View style={styled.premiumBadge}>
                                    <Feather name="star" size={12} color="#9333EA" />
                                    <Text style={styled.premiumText}>Premium</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styled.optionMessage}>
                            Conecte sua conta do banco e tenha suas transações sincronizadas
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Modalize>
    );
};
