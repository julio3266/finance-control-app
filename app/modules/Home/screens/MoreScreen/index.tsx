import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { ScreenWithHeader } from '../../components';
import { styles } from './styles';

export default function MoreScreen() {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <ScreenWithHeader>
            <ScrollView style={styled.container} contentContainerStyle={styled.content}>
                <Text style={styled.title}>More</Text>
                <Text style={styled.subtitle}>Configurações e outras opções</Text>
            </ScrollView>
        </ScreenWithHeader>
    );
}
