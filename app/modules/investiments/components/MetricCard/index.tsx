import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

interface MetricCardProps {
    label: string;
    value: string;
    isPositive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, isPositive }) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={styled.container}>
            <Text style={styled.label}>{label}</Text>
            <Text style={[styled.value, isPositive && styled.valuePositive]}>{value}</Text>
        </View>
    );
};
