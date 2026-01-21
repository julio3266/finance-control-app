import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { styles } from './styles';

interface DistributionItem {
    type: string;
    percentage: number;
    value: number;
    profitability: number;
    color: string;
}

interface DistributionCardProps {
    title: string;
    items: DistributionItem[];
}

export const DistributionCard: React.FC<DistributionCardProps> = ({ title, items }) => {
    const theme = useTheme();
    const styled = styles(theme);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);

    return (
        <View style={styled.container}>
            <Text style={styled.title}>{title}</Text>
            <View style={styled.list}>
                {items.map((item, index) => (
                    <View key={index} style={styled.item}>
                        <View style={styled.itemHeader}>
                            <Text style={styled.itemType}>{item.type}</Text>
                            <Text style={styled.itemPercentage}>
                                {item.percentage.toFixed(1)}% do total
                            </Text>
                        </View>
                        <View style={styled.itemContent}>
                            <Text style={styled.itemValue}>{formatCurrency(item.value)}</Text>
                            <Text style={styled.itemProfitability}>
                                +{item.profitability.toFixed(2)}%
                            </Text>
                        </View>
                        <View style={styled.barContainer}>
                            <View
                                style={[
                                    styled.bar,
                                    {
                                        width: `${item.percentage}%`,
                                        backgroundColor: item.color,
                                    },
                                ]}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
