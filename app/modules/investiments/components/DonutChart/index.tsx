import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

interface DonutChartData {
    label: string;
    value: number;
    color: string;
}

interface DonutChartProps {
    data: DonutChartData[];
    totalValue: number;
    size?: number;
    strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
    data,
    totalValue,
    size = 200,
    strokeWidth = 30,
}) => {
    const theme = useTheme();
    const styled = styles(theme, size);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    let currentOffset = 0;

    const segments = data.map((item, index) => {
        const percentage = (item.value / totalValue) * 100;
        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
        const offset = currentOffset;
        currentOffset -= (percentage / 100) * circumference;

        return {
            ...item,
            percentage,
            strokeDasharray,
            offset,
        };
    });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);

    return (
        <View style={styled.container}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <G rotation="-90" origin={`${center}, ${center}`}>
                    {segments.map((segment, index) => (
                        <Circle
                            key={index}
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeDasharray={segment.strokeDasharray}
                            strokeDashoffset={segment.offset}
                            strokeLinecap="round"
                        />
                    ))}
                </G>
            </Svg>
            <View style={styled.centerLabel}>
                <Text style={styled.centerValue}>{formatCurrency(totalValue)}</Text>
                <Text style={styled.centerText}>Total</Text>
            </View>
        </View>
    );
};
