import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { ScreenWithHeader } from '../../components';
import { styles } from './styles';

export default function DashboardScreen() {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <ScreenWithHeader>
            <ScrollView
                style={styled.container}
                contentContainerStyle={styled.content}
            >
                <Text style={styled.title}>Dashboard</Text>
                <Text style={styled.subtitle}>
                    Bem-vindo ao seu painel de controle
                </Text>
            </ScrollView>
        </ScreenWithHeader>
    );
}

