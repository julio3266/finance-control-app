import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';

interface FilterOption {
    label: string;
    value: string;
    selectedColor?: string;
    accountSource?: 'manual' | 'open_finance'; // Para identificar o tipo de conta
}

interface FilterChipsProps {
    options: FilterOption[];
    selectedValue?: string;
    selectedValues?: string[];
    onSelect: (value: string) => void;
    multiple?: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
    options,
    selectedValue,
    selectedValues,
    onSelect,
    multiple = false,
}) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styled.container}
        >
            {options.map((option) => {
                let isSelected = false;
                if (multiple) {
                    // Para múltiplas seleções, verifica se está no array ou se é "all" e não há seleções
                    if (option.value === 'all') {
                        isSelected = !selectedValues || selectedValues.length === 0;
                    } else {
                        isSelected = selectedValues?.includes(option.value) || false;
                    }
                } else {
                    isSelected = selectedValue === option.value;
                }
                const selectedColor = option.selectedColor || colors.primary[600];
                return (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styled.chip,
                            isSelected && styled.chipSelected,
                            {
                                backgroundColor: isSelected ? selectedColor : theme.cardBg,
                                borderColor: isSelected ? selectedColor : theme.cardBorder,
                            },
                        ]}
                        onPress={() => onSelect(option.value)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styled.chipText,
                                { color: isSelected ? '#ffffff' : theme.foreground },
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: 8,
            paddingVertical: 8,
        },
        chip: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
        },
        chipSelected: {
            borderWidth: 1,
        },
        chipText: {
            fontSize: 14,
            fontWeight: '600',
        },
    });
