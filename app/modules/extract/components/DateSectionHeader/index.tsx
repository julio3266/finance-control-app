import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

interface DateSectionHeaderProps {
    date: string; // Formato: DD/MM/YYYY
}

export const DateSectionHeader: React.FC<DateSectionHeaderProps> = ({ date }) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={styled.container}>
            <Text style={styled.dateText}>{date}</Text>
        </View>
    );
};

