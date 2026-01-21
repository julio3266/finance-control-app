import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

export type RepeatPeriod = 'dias' | 'semanas' | 'meses' | 'anos';

interface RepeatPickerProps {
    modalizeRef: React.RefObject<IHandles>;
    repeatCount: string;
    repeatPeriod: RepeatPeriod;
    onSave: (count: string, period: RepeatPeriod) => void;
    accentColor: string;
}

const PERIOD_OPTIONS: { label: string; value: RepeatPeriod }[] = [
    { label: 'Diário', value: 'dias' },
    { label: 'Semanal', value: 'semanas' },
    { label: 'Mensal', value: 'meses' },
    { label: 'Anual', value: 'anos' },
];

export const RepeatPicker: React.FC<RepeatPickerProps> = ({
    modalizeRef,
    repeatCount,
    repeatPeriod,
    onSave,
    accentColor,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme, accentColor);
    const [count, setCount] = useState(repeatCount);
    const [period, setPeriod] = useState(repeatPeriod);
    const [showPeriodPicker, setShowPeriodPicker] = useState(false);

    const handleIncrement = () => {
        const num = parseInt(count, 10) || 0;
        setCount(String(num + 1));
    };

    const handleDecrement = () => {
        const num = parseInt(count, 10) || 0;
        if (num > 1) {
            setCount(String(num - 1));
        }
    };

    const handleDone = () => {
        onSave(count, period);
        modalizeRef.current?.close();
    };

    const getPeriodLabel = () => {
        const option = PERIOD_OPTIONS.find((opt) => opt.value === period);
        return option?.label || 'Mensal';
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
                <Text style={styled.title}>Como sua transação se repete?</Text>

                {/* Quantity Field */}
                <View style={styled.fieldRow}>
                    <View style={styled.fieldLeft}>
                        <Feather name="copy" size={20} color={theme.foregroundMuted} />
                        <Text style={styled.fieldLabel}>Quantidade</Text>
                    </View>
                    <View style={styled.quantityContainer}>
                        <TouchableOpacity onPress={handleDecrement} style={styled.quantityButton}>
                            <Feather name="chevron-down" size={16} color={theme.foreground} />
                        </TouchableOpacity>
                        <RNTextInput
                            style={styled.quantityInput}
                            value={count}
                            onChangeText={setCount}
                            keyboardType="numeric"
                            textAlign="center"
                        />
                        <TouchableOpacity onPress={handleIncrement} style={styled.quantityButton}>
                            <Feather name="chevron-up" size={16} color={theme.foreground} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styled.separator} />

                {/* Period Field */}
                <View style={styled.fieldRow}>
                    <View style={styled.fieldLeft}>
                        <Feather name="repeat" size={20} color={theme.foregroundMuted} />
                        <Text style={styled.fieldLabel}>Período</Text>
                    </View>
                    <TouchableOpacity
                        style={styled.periodButton}
                        onPress={() => setShowPeriodPicker(!showPeriodPicker)}
                    >
                        <Text style={styled.periodText}>{getPeriodLabel()}</Text>
                        <Feather name="chevron-down" size={16} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                </View>

                {showPeriodPicker && (
                    <View style={styled.periodOptions}>
                        {PERIOD_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styled.periodOption,
                                    period === option.value && styled.periodOptionSelected,
                                ]}
                                onPress={() => {
                                    setPeriod(option.value);
                                    setShowPeriodPicker(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styled.periodOptionText,
                                        period === option.value && styled.periodOptionTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                {period === option.value && (
                                    <Feather name="check" size={20} color={accentColor} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styled.separator} />

                {/* Done Button */}
                <TouchableOpacity
                    style={[styled.doneButton, { backgroundColor: accentColor }]}
                    onPress={handleDone}
                    activeOpacity={0.8}
                >
                    <Text style={styled.doneButtonText}>CONCLUIR</Text>
                </TouchableOpacity>
            </View>
        </Modalize>
    );
};
