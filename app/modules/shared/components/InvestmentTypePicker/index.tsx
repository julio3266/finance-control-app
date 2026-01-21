import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

export interface InvestmentType {
    id: string;
    name: string;
    code: string;
}

const FIXED_INVESTMENT_TYPES: InvestmentType[] = [
    { id: '1', name: 'CDB', code: 'CDB' },
    { id: '2', name: 'LCI', code: 'LCI' },
    { id: '3', name: 'LCA', code: 'LCA' },
    { id: '4', name: 'Tesouro Direto', code: 'TD' },
    { id: '5', name: 'LC', code: 'LC' },
    { id: '6', name: 'Debêntures', code: 'DEB' },
    { id: '7', name: 'CRI', code: 'CRI' },
    { id: '8', name: 'CRA', code: 'CRA' },
    { id: '9', name: 'Letra de Câmbio', code: 'LC' },
    { id: '10', name: 'RDB', code: 'RDB' },
];

interface InvestmentTypePickerModalProps {
    modalizeRef: React.RefObject<IHandles>;
    selectedType?: InvestmentType | null;
    onSelect: (type: InvestmentType) => void;
}

export const InvestmentTypePickerModal: React.FC<InvestmentTypePickerModalProps> = ({
    selectedType,
    onSelect,
    modalizeRef,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const handleSelect = (type: InvestmentType) => {
        onSelect(type);
        modalizeRef.current?.close();
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
                <Text style={styled.title}>Tipo de Investimento</Text>

                {/* Types List */}
                <ScrollView style={styled.listContainer} showsVerticalScrollIndicator={false}>
                    {FIXED_INVESTMENT_TYPES.map((type) => {
                        const isSelected = selectedType?.id === type.id;
                        return (
                            <TouchableOpacity
                                key={type.id}
                                style={styled.typeItem}
                                onPress={() => handleSelect(type)}
                                activeOpacity={0.7}
                            >
                                <Text style={styled.typeName}>{type.name}</Text>
                                {isSelected ? (
                                    <Feather name="check" size={20} color={colors.primary[600]} />
                                ) : (
                                    <View style={styled.radioButton} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </Modalize>
    );
};

export type { InvestmentType };
