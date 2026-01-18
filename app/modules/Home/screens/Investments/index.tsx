import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { ScreenWithHeader } from '../../components';
import { styles } from './styles';

export default function BudgetScreen() {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <ScreenWithHeader>
            <ScrollView style={styled.container} contentContainerStyle={styled.content}>
                <Text style={styled.title}>Investimentos</Text>
                <Text style={styled.subtitle}>Acompanhe seus investimentos</Text>
            </ScrollView>
        </ScreenWithHeader>
    );
}
