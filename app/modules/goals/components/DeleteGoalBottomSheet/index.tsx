import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

interface DeleteGoalBottomSheetProps {
    modalizeRef: React.RefObject<IHandles>;
    goalName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const DeleteGoalBottomSheet: React.FC<DeleteGoalBottomSheetProps> = ({
    modalizeRef,
    goalName,
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const handleCancel = () => {
        modalizeRef.current?.close();
        onCancel();
    };

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modalize
            ref={modalizeRef}
            adjustToContentHeight
            modalStyle={styled.bottomSheet}
            handleStyle={styled.handle}
            overlayStyle={styled.overlay}
            closeOnOverlayTap
            onClosed={onCancel}
        >
            <View style={[styled.content, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styled.iconContainer}>
                    <View style={styled.iconCircle}>
                        <Feather name="trash-2" size={32} color={colors.error[500]} />
                    </View>
                </View>

                <Text style={styled.title}>Deletar Meta</Text>

                <Text style={styled.message}>
                    Tem certeza que deseja deletar a meta{' '}
                    <Text style={styled.goalName}>{goalName}</Text>? Esta ação não pode ser
                    desfeita.
                </Text>

                <View style={styled.buttonsContainer}>
                    <TouchableOpacity
                        style={[styled.button, styled.cancelButton]}
                        onPress={handleCancel}
                        disabled={isLoading}
                        activeOpacity={0.7}
                    >
                        <Text style={styled.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styled.button, styled.deleteButton]}
                        onPress={handleConfirm}
                        disabled={isLoading}
                        activeOpacity={0.7}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styled.deleteButtonText}>Deletar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modalize>
    );
};

