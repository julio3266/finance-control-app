import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '@app/utils/useTheme';
import { ScreenWithHeader } from '@app/modules/Home/components';
import { styles } from './styles';

export default function InvestimentsScreen() {
    const theme = useTheme();
    const styled = styles(theme);

    return (
        <ScreenWithHeader>
            <ScrollView style={styled.container} contentContainerStyle={styled.content} />
        </ScreenWithHeader>
    );
}
