import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { ScreenWithHeader } from '../../components';
import { styles } from './styles';

export default function TransactionsScreen() {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <ScreenWithHeader>
            <ScrollView style={styled.container} contentContainerStyle={styled.content}>
                <View style={styled.balanceContainer} />
            </ScrollView>
        </ScreenWithHeader>
    );
}
