import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import { styles } from './styles';

interface DayPickerModalProps {
    modalizeRef: React.RefObject<IHandles>;
    selectedDay?: string | null;
    onSelect: (day: string) => void;
    title: string;
    accentColor?: string;
}

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

export const DayPickerModal: React.FC<DayPickerModalProps> = ({
    selectedDay,
    onSelect,
    title,
    modalizeRef,
    accentColor = colors.primary[600],
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme, accentColor);

    const handleSelect = (day: string) => {
        onSelect(day);
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
                <Text style={styled.title}>{title}</Text>

                {/* Days List */}
                <ScrollView
                    style={styled.listContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styled.listContent}
                >
                    {DAYS.map((day) => {
                        const isSelected = selectedDay === day;
                        return (
                            <TouchableOpacity
                                key={day}
                                style={[styled.dayItem, isSelected && styled.dayItemSelected]}
                                onPress={() => handleSelect(day)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[styled.dayText, isSelected && styled.dayTextSelected]}
                                >
                                    {day}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </Modalize>
    );
};
