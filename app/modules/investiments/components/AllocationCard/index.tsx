import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import Feather from '@expo/vector-icons/Feather';
import { DonutChart } from '../DonutChart';
import { styles } from './styles';

interface AllocationData {
    label: string;
    value: number;
    color: string;
    percentage: number;
}

interface AllocationCardProps {
    title: string;
    data: AllocationData[];
    totalValue: number;
}

export const AllocationCard: React.FC<AllocationCardProps> = ({ title, data, totalValue }) => {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <View style={styled.container}>
            <View style={styled.header}>
                <Text style={styled.title}>{title}</Text>
                <TouchableOpacity>
                    <Feather name="settings" size={20} color={theme.foregroundMuted} />
                </TouchableOpacity>
            </View>
            <View style={styled.chartContainer}>
                <DonutChart data={data} totalValue={totalValue} size={180} strokeWidth={25} />
            </View>
            <View style={styled.legend}>
                {data.map((item, index) => (
                    <View key={index} style={styled.legendItem}>
                        <View style={[styled.legendDot, { backgroundColor: item.color }]} />
                        <Text style={styled.legendText}>
                            {item.label} {item.percentage}%
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
