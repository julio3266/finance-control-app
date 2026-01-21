import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import Feather from '@expo/vector-icons/Feather';
import { styles } from './styles';
import { colors } from '@app/utils/colors';

interface InvestmentItemProps {
    ticker: string;
    broker: string;
    currentValue: number;
    returnValue: number;
    returnPercentage: number;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const InvestmentItem: React.FC<InvestmentItemProps> = ({
    ticker,
    broker,
    currentValue,
    returnValue,
    returnPercentage,
    onView,
    onEdit,
    onDelete,
}) => {
    const theme = useTheme();
    const styled = styles(theme);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);

    return (
        <View style={styled.container}>
            <View style={styled.leftSection}>
                <View style={styled.iconContainer}>
                    <View style={styled.iconBackground}>
                        <View style={styled.iconGraph}>
                            <View style={[styled.iconGraphLine, styled.iconGraphLine1]} />
                            <View style={[styled.iconGraphLine, styled.iconGraphLine2]} />
                            <View style={[styled.iconGraphLine, styled.iconGraphLine3]} />
                        </View>
                    </View>
                </View>
                <View style={styled.infoContainer}>
                    <Text style={styled.ticker}>{ticker}</Text>
                    <Text style={styled.broker}>{broker}</Text>
                </View>
            </View>
            <View style={styled.rightSection}>
                <View style={styled.valueContainer}>
                    <Text style={styled.currentValue}>{formatCurrency(currentValue)}</Text>
                    <Text style={styled.returnText}>
                        {formatCurrency(returnValue)} ({returnPercentage > 0 ? '+' : ''}
                        {returnPercentage.toFixed(2)}%)
                    </Text>
                </View>
                <View style={styled.actionsContainer}>
                    <TouchableOpacity onPress={onView} style={styled.actionButton}>
                        <Feather name="eye" size={18} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onEdit} style={styled.actionButton}>
                        <Feather name="edit-2" size={18} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete} style={styled.actionButton}>
                        <Feather name="trash-2" size={18} color={theme.foregroundMuted} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
