import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@app/utils/useTheme';
import { colors } from '@app/utils/colors';
import Feather from '@expo/vector-icons/Feather';
import { DonutChart, InvestmentItem } from '../../components';
import { styles } from './styles';

interface Investment {
    id: string;
    ticker: string;
    broker: string;
    type: 'fixed' | 'variable';
    currentValue: number;
    returnValue: number;
    returnPercentage: number;
}

export default function InvestimentsScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const styled = styles(theme);

    const currentValue = 240350.0;

    const allocationData = [
        { label: 'Outro', value: 121000.0, color: colors.primary[600], percentage: 50 },
        { label: 'FII', value: 58270.0, color: colors.success[500], percentage: 24 },
        { label: 'ETF', value: 37540.0, color: '#ec4899', percentage: 16 },
        { label: 'Ação', value: 23540.0, color: '#f97316', percentage: 10 },
    ];
    const handleViewInvestment = (_id: string) => {};

    const handleEditInvestment = (_id: string) => {};

    const handleDeleteInvestment = (_id: string) => {};

    const renderHeader = () => (
        <View style={[styled.header, { paddingTop: insets.top + 16 }]}>
            <View style={styled.headerButtonLeft} />
            <Text style={styled.title}>Seus Investimentos</Text>
        </View>
    );

    const renderChart = () => (
        <View style={styled.chartContainer}>
            <DonutChart
                data={allocationData}
                totalValue={currentValue}
                size={280}
                strokeWidth={40}
            />
            <View style={styled.chartLegend}>
                {allocationData.map((item, index) => (
                    <View key={index} style={styled.chartLegendItem}>
                        <View style={[styled.chartLegendDot, { backgroundColor: item.color }]} />
                        <Text style={styled.chartLegendText}>
                            {item.label} {item.percentage}%
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderInvestmentItem = ({ item }: { item: Investment }) => (
        <InvestmentItem
            ticker={item.ticker}
            broker={item.broker}
            currentValue={item.currentValue}
            returnValue={item.returnValue}
            returnPercentage={item.returnPercentage}
            onView={() => handleViewInvestment(item.id)}
            onEdit={() => handleEditInvestment(item.id)}
            onDelete={() => handleDeleteInvestment(item.id)}
        />
    );

    return (
        <View style={styled.container}>
            {renderHeader()}
            <FlatList
                data={[]}
                renderItem={renderInvestmentItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderChart()}
                contentContainerStyle={[styled.content, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
